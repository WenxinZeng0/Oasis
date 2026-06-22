/* ============================================================
   main.js — 启动入口
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  bootGame();

  // 开发期方便：在控制台暴露断链检测和状态查看，不影响玩家
  window.checkAllLinks = checkAllLinks;
  window.getGameState = getState;
  console.log('%cTip: run checkAllLinks() in the console to verify all node links are valid', 'color:#888');
});
