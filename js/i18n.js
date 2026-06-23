/* ============================================================
   i18n.js — 语言切换
   NODES_EN（js/nodes.js）和 NODES_ZH（js/nodes.zh.js）各自定义好全部节点后，
   这里提供一个可切换的全局 NODES 引用：engine.js 里的 goToNode() 等函数
   只认 NODES 这个名字，不关心当前到底是英文版还是中文版。
   切换语言 = 把 NODES 重新指向另一份数据 + 记住玩家的选择，下次打开默认沿用。
   ============================================================ */

const LANG_STORAGE_KEY = 'oasisGameLang';

function getSavedLang() {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
  } catch (e) {
    return 'en';
  }
}

function getNodesForLang(lang) {
  return lang === 'zh' ? NODES_ZH : NODES_EN;
}

let CURRENT_LANG = getSavedLang();
let NODES = getNodesForLang(CURRENT_LANG);

// 登录页是静态写在 index.html 里的（唯一一个不经过 NODES render() 的页面），
// 所以它的文案切换单独处理：读取 data-en / data-zh（以及输入框的 data-en-placeholder / data-zh-placeholder）。
function applyStaticTranslations() {
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    el.textContent = CURRENT_LANG === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
  });
  document.querySelectorAll('[data-en-placeholder][data-zh-placeholder]').forEach(el => {
    el.placeholder = CURRENT_LANG === 'zh' ? el.getAttribute('data-zh-placeholder') : el.getAttribute('data-en-placeholder');
  });
}

function setLanguage(lang) {
  CURRENT_LANG = (lang === 'zh') ? 'zh' : 'en';
  NODES = getNodesForLang(CURRENT_LANG);
  try {
    localStorage.setItem(LANG_STORAGE_KEY, CURRENT_LANG);
  } catch (e) {
    // localStorage 不可用时静默忽略，本次会话内切换依然有效
  }
  applyStaticTranslations();
}

// screen-lang-select 是整个游戏最先出现的一整页（纯白背景+两个蓝色按钮），
// 选完语言后才会用 goToNode 跳转到 login 页 —— 这个跳转走的是正常的节点系统，
// 所以放在 DOMContentLoaded 里注册即可，不需要等 bootGame() 先跑完。
document.addEventListener('DOMContentLoaded', () => {
  applyStaticTranslations();

  document.querySelectorAll('.lang-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang'));
      goToNode('login');
    });
  });
});
