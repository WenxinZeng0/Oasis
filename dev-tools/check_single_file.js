const vm = require('vm');
const fs = require('fs');

const html = fs.readFileSync('oasis_game.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const css = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');

const sandbox = {};
sandbox.window = sandbox;
sandbox.localStorage = { _data:{}, getItem(k){return this._data[k]||null;}, setItem(k,v){this._data[k]=v;}, removeItem(k){delete this._data[k];} };

function makeFakeEl(id) {
  const el = {
    id,
    classList: { add(){}, remove(){}, contains(){return false;}, toggle(){} },
    style: {}, children: [],
    addEventListener(){}, setAttribute(){}, getAttribute(){return null;},
    appendChild(){}, cloneNode(){ return makeFakeEl(id); },
    parentNode: { replaceChild(){} },
    querySelectorAll(){ return []; }, querySelector(){ return null; },
    closest(){ return null; }, remove(){}, focus(){},
  };
  Object.defineProperty(el, 'innerHTML', { get(){return '';}, set(){} });
  Object.defineProperty(el, 'textContent', { get(){return '';}, set(){} });
  Object.defineProperty(el, 'value', { get(){return '';}, set(){} });
  return el;
}
sandbox.document = {
  getElementById(id) { return makeFakeEl(id); },
  querySelectorAll() { return []; }, querySelector() { return null; },
  addEventListener(){}, createElement(){ return makeFakeEl('created'); },
};
sandbox.requestAnimationFrame = (fn) => setTimeout(fn, 0);
sandbox.console = console;
sandbox.setTimeout = setTimeout;
sandbox.setInterval = setInterval;
sandbox.clearInterval = clearInterval;
sandbox.clearTimeout = clearTimeout;

vm.createContext(sandbox);
scripts.forEach((code, i) => {
  vm.runInContext(code, sandbox, { filename: 'inline-script-' + i });
});
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
  if (!VALID_CONTAINERS.includes(sandbox.NODES[id].container)) {
    console.error('❌ 节点 "' + id + '" container非法:', sandbox.NODES[id].container);
    containerProblems++;
  }
});
if (containerProblems === 0) console.log('✅ 所有节点container合法');

console.log('--- 断链检测 ---');
sandbox.checkAllLinks();

console.log('--- render() 试跑 ---');
let renderErrors = 0;
Object.keys(sandbox.NODES).forEach(id => {
  try {
    sandbox.setState({ currentNode: id });
    sandbox.NODES[id].render();
  } catch (e) {
    renderErrors++;
    console.error('❌ 节点 "' + id + '" render()报错:', e.message);
  }
});
if (renderErrors === 0) console.log('✅ 所有render()均正常执行');

console.log('--- CSS容器背景检查 ---');
let cssProblems = 0;
VALID_CONTAINERS.forEach(id => {
  const re = new RegExp('#' + id + '\\b');
  if (!re.test(css)) {
    console.error('❌ 容器 #' + id + ' 找不到CSS样式');
    cssProblems++;
  }
});
if (cssProblems === 0) console.log(`✅ 所有${VALID_CONTAINERS.length}个容器都有CSS背景`);

console.log('--- 完成 ---');
