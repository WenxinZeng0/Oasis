const vm = require('vm');
const fs = require('fs');

const sandbox = {};
sandbox.window = sandbox;
sandbox.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = v; },
  removeItem(k) { delete this._data[k]; }
};

function makeFakeEl(id) {
  const el = {
    id,
    classList: { add(){}, remove(){}, contains(){return false;}, toggle(){} },
    style: {},
    children: [],
    addEventListener(){},
    setAttribute(){},
    getAttribute(){return null;},
    appendChild(){},
    cloneNode(){ return makeFakeEl(id); },
    parentNode: { replaceChild(){} },
    querySelectorAll(){ return []; },
    querySelector(){ return null; },
    closest(){ return null; },
    remove(){},
    focus(){},
  };
  Object.defineProperty(el, 'innerHTML', { get(){return '';}, set(){} });
  Object.defineProperty(el, 'textContent', { get(){return '';}, set(){} });
  Object.defineProperty(el, 'value', { get(){return '';}, set(){} });
  return el;
}
sandbox.document = {
  getElementById(id) { return makeFakeEl(id); },
  querySelectorAll() { return []; },
  querySelector() { return null; },
  addEventListener(){},
  createElement(){ return makeFakeEl('created'); },
};
sandbox.requestAnimationFrame = (fn) => setTimeout(fn, 0);
sandbox.console = console;
sandbox.setTimeout = setTimeout;
sandbox.setInterval = setInterval;
sandbox.clearInterval = clearInterval;
sandbox.clearTimeout = clearTimeout;

vm.createContext(sandbox);

function loadScript(path) {
  const code = fs.readFileSync(path, 'utf8');
  vm.runInContext(code, sandbox, { filename: path });
}

loadScript('js/state.js');
loadScript('js/engine.js');
loadScript('js/helpers.js');
loadScript('js/characters.js');
loadScript('js/nodes.js');
vm.runInContext('this.NODES = NODES; this.gameState = gameState; this.CHARACTERS = CHARACTERS;', sandbox);

console.log('--- NODES 结构检查 ---');
console.log('节点总数:', Object.keys(sandbox.NODES).length);

const VALID_CONTAINERS = [
  'screen-login','screen-desktop','screen-mail','screen-social-feed','screen-story',
  'screen-profile','screen-chat','screen-document','screen-dataviz','screen-terminal',
  'screen-choice','screen-narrative','screen-ending','screen-collection','screen-website','screen-calendar'
];
let containerProblems = 0;
Object.keys(sandbox.NODES).forEach(id => {
  const c = sandbox.NODES[id].container;
  if (!VALID_CONTAINERS.includes(c)) {
    console.error(`❌ 节点 "${id}" 使用了非法/未知的container: "${c}"`);
    containerProblems++;
  }
});
if (containerProblems === 0) console.log('✅ 所有节点的container字段都合法');

console.log('--- 断链检测 ---');
sandbox.checkAllLinks();

console.log('--- render() 函数试跑检查 ---');
let renderErrors = 0;
Object.keys(sandbox.NODES).forEach(id => {
  try {
    sandbox.setState({ currentNode: id });
    sandbox.NODES[id].render();
  } catch (e) {
    renderErrors++;
    console.error(`❌ 节点 "${id}" 的 render() 执行报错:`, e.message);
  }
});
if (renderErrors === 0) console.log('✅ 所有节点的 render() 函数均可正常执行，无运行时异常');

console.log('--- CSS容器背景样式检查（防止改名/新增容器漏写背景色） ---');
const cssContent = fs.readFileSync('css/style.css', 'utf8') + '\n' + fs.readFileSync('css/style-extra.css', 'utf8');
let cssProblems = 0;
VALID_CONTAINERS.forEach(id => {
  // 检查是否存在针对这个id的选择器规则（容忍组合选择器，如 "#a, #b {"）
  const re = new RegExp('#' + id + '\\b');
  if (!re.test(cssContent)) {
    console.error(`❌ 容器 "#${id}" 在CSS中找不到任何样式规则，可能会露出默认黑色背景`);
    cssProblems++;
  }
});
if (cssProblems === 0) console.log(`✅ 所有${VALID_CONTAINERS.length}个通用容器都有对应的CSS背景样式`);

console.log('--- 完成 ---');

console.log('--- DOM id 完整性检查（防止 getElementById 引用了HTML里不存在的id） ---');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const helpersCode2 = fs.readFileSync('js/helpers.js', 'utf8');
const allJsCode = ['js/state.js','js/engine.js','js/helpers.js','js/characters.js','js/nodes.js','js/main.js']
  .map(f => fs.readFileSync(f, 'utf8')).join('\n');

// 1. 提取HTML里静态存在的所有id
const staticIds = new Set([...indexHtml.matchAll(/id="([^"]+)"/g)].map(m => m[1]));

// 2. 提取JS里"先动态创建id、再查找"的合法模式：
//    a) innerHTML字符串里写的 id="xxx"（在助手函数里用 wrap.innerHTML = `...id="xxx"...` 这种）
//    b) el.id = 'xxx' 这种直接赋值创建的
const dynamicallyCreatedIds = new Set([
  ...[...allJsCode.matchAll(/id="([^"]+)"/g)].map(m => m[1]),      // innerHTML字符串里的id=".."
  ...[...allJsCode.matchAll(/\.id\s*=\s*['"]([^'"]+)['"]/g)].map(m => m[1]), // el.id = '...'
]);

// 3. 提取所有 getElementById('xxx') 引用
const referencedIds = new Set([...allJsCode.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]));

let idProblems = 0;
referencedIds.forEach(id => {
  if (!staticIds.has(id) && !dynamicallyCreatedIds.has(id)) {
    console.error(`❌ getElementById("${id}") 引用的id，在HTML静态结构和JS动态创建中都找不到！`);
    idProblems++;
  }
});
if (idProblems === 0) {
  console.log(`✅ 所有 ${referencedIds.size} 个 getElementById 引用都能找到对应的id（静态HTML或JS动态创建）`);
}

console.log('--- imgOrFallback 占位背景色检查（防止空背景导致黑屏） ---');
const helpersCode = fs.readFileSync('js/helpers.js', 'utf8');
let __imgFallbackCounter = 0;
eval(helpersCode.match(/function imgOrFallback[\s\S]*?\n}/)[0]);
const imgTestCases = [
  ['story/test.jpg', '', '0', 'position:absolute;inset:0;'],
  ['avatars/test.jpg', 'linear-gradient(145deg,#FF9F6B,#C2185B)', '50%', ''],
  [null, '', '50%', ''],
];
let imgFbProblems = 0;
imgTestCases.forEach(([path, fb, radius, extra]) => {
  const html = imgOrFallback(path, fb, radius, extra);
  const bgMatch = html.match(/background:([^;]*);/);
  const bgValue = bgMatch ? bgMatch[1].trim() : '';
  if (!bgValue) {
    console.error(`❌ imgOrFallback(${JSON.stringify(path)}, ${JSON.stringify(fb)}) 生成了空的占位背景色，会导致黑屏！`);
    imgFbProblems++;
  }
});
if (imgFbProblems === 0) console.log('✅ imgOrFallback 在各种输入下都有保底背景色，不会出现空背景');
