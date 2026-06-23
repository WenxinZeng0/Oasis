/* ============================================================
   engine.js — 渲染引擎 / 节点路由器
   职责：根据 nodes.js 里的数据，把节点渲染到对应的 screen 容器里，
   并处理通用的跳转、toast、checkpoint触发。
   具体每个节点"长什么样"由 nodes.js 里每个节点的 render 函数决定。
   ============================================================ */

const toastEl = document.getElementById('toast');

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove('show'), 1600);
}

// 切换可见的 screen 容器（每个大类UI——桌面/邮件/聊天/story/解谜等——对应一个固定的screen容器，
// 节点只是往容器里填不同内容，不需要为每个节点单独建DOM容器）
function showScreenContainer(containerId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(containerId);
  if (!el) {
    console.error('Screen container not found:', containerId);
    return;
  }
  el.classList.add('active');
}

// 核心导航函数：跳转到某个节点
// 所有 data-goto、节点内部的跳转逻辑，最终都应该调用这个函数
function goToNode(nodeId) {
  const node = NODES[nodeId];
  if (!node) {
    console.error('Broken link! Node does not exist:', nodeId);
    showToast('(dev notice) Node not found: ' + nodeId);
    return;
  }
  // 记录"跳转前所在的节点"，供需要"动态返回来源页"的场景使用
  // （比如日历/OASIS app可能从多个不同桌面进入，返回时应该回到实际来源，而不是写死某一个）
  const previousNode = getState().currentNode;
  setState({ currentNode: nodeId, previousNode: previousNode });

  // 如果该节点是抉择点，自动记录checkpoint
  if (node.checkpoint) {
    recordCheckpoint(node.checkpoint, nodeId);
  }
  // 如果该节点是结局页，自动标记解锁
  if (node.ending) {
    unlockEnding(node.ending);
  }

  showScreenContainer(node.container);
  if (typeof node.render === 'function') {
    try {
      node.render();
    } catch (err) {
      // 渲染出错时不应该静默失败（那样玩家只会看到一片空白/卡死，完全不知道发生了什么）。
      // 在控制台打印完整错误堆栈方便定位，同时用toast给一个可见提示。
      console.error('Node "' + nodeId + '" threw an error during render:', err);
      showToast('(dev notice) "' + nodeId + '" failed to render — check console (F12) for details');
    }
  }
}

// 游戏启动时调用：根据存档恢复到上次的节点（如果有），否则从登录页开始
function bootGame() {
  // 设计决定：每次打开/刷新页面都是全新一局——重置所有状态后回到登录页。
  // "返回上一个抉择点重选"功能仍然可用，但仅限同一次会话内（不刷新、不关闭页面）。
  resetGameState();
  // screen-lang-select 是整个游戏最先出现的页面（纯静态HTML，不走NODES系统），
  // 玩家选完语言后才会跳转到 login —— 跳转逻辑见 i18n.js。
  showScreenContainer('screen-lang-select');
}

/* ---------------- 断链检测（开发工具，不影响玩家体验） ---------------- */
// 在浏览器控制台运行 checkAllLinks() 可以检查所有节点引用的跳转目标是否存在
function checkAllLinks() {
  const problems = [];
  Object.keys(NODES).forEach(id => {
    const node = NODES[id];
    const targets = node.links || [];
    targets.forEach(t => {
      if (!NODES[t]) {
        problems.push(`Node "${id}" references a target node "${t}" that does not exist`);
      }
    });
  });
  if (problems.length === 0) {
    console.log('✅ Link check passed — all targets exist. Total nodes checked:', Object.keys(NODES).length);
  } else {
    console.error('❌ Broken links found:', problems.length);
    problems.forEach(p => console.error(p));
  }
  return problems;
}

// 通用：监听所有带 data-goto / data-toast 的元素（适用于简单静态跳转，复杂节点可在render里自行绑定事件）
document.addEventListener('click', (e) => {
  const gotoEl = e.target.closest('[data-goto]');
  const toastTriggerEl = e.target.closest('[data-toast]');
  if (gotoEl) {
    goToNode(gotoEl.getAttribute('data-goto'));
  } else if (toastTriggerEl) {
    showToast(toastTriggerEl.getAttribute('data-toast'));
  }
});
