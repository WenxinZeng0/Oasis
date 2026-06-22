/* ============================================================
   state.js — 全局游戏状态（纯内存，不跨会话持久化）
   这是整个游戏唯一的"记忆"来源。所有节点跳转、分支判断都应该
   读写这里的 gameState，而不是在各节点逻辑里自己存变量。

   设计决定：游戏状态只存在内存里，关闭/刷新页面即清空，
   每次重新打开都从登录页全新开始。
   "返回上一个抉择点重选"功能只在同一次会话内有效——
   这正好通过"纯内存、不读写localStorage"自然得到，不需要额外处理。
   ============================================================ */

// 默认初始状态 —— 对应大纲里列出的全部变量
function createDefaultState() {
  return {
    // 当前所在节点ID（仅用于checkpoint快照记录"走到哪一步"，
    // 不用于刷新后恢复进度 —— 刷新后一律回登录页）
    currentNode: 'login',
    // 跳转前所在的节点，供"动态返回来源页"场景使用（如日历/OASIS app可能从多个不同桌面进入）
    previousNode: null,
    // 最近一次渲染过的"桌面"节点id（由renderDesktop自动记录）。
    // 和previousNode不同：previousNode是"刚才那一屏"，可能是dashboard/login等app内部页面；
    // lastDesktopNode始终是真正的桌面，用于OASIS/Calendar等多入口app的"返回桌面"逻辑，
    // 避免signout等操作后"返回"又绕回app内部页面而不是桌面。
    lastDesktopNode: 'desktop_1',

    // 玩家身份
    playerName: '',

    // 当前桌面对应的剧情日期（如 'Nov 8, 2032'），由renderDesktop每次渲染时自动更新，
    // 日历app读取这个值作为"今天"来计算生日倒计时
    currentGameDate: 'Nov 8, 2032',

    // 第一章节桌面通知进度（动态决定桌面回来时显示哪条待处理通知，不再依赖固定走哪条路径）
    mailNotifSeen: false,      // mail_vocalist 是否已进入过
    friendsNotifConsumed: false, // friends_feed 是否已进入过（不要求点开shawn story本身）
    debsChat1Done: false,      // debs_chat_1 是否已完整播放结束
    priyaChatDone: false,      // priya_chat 是否已完整播放结束

    // ---- 第二章节 ----
    oasisSession: 'none',         // 'none' | 'self' | 'debra' —— 当前OASIS app登录的是谁
    chapter2Stage: 'ruth_pending', // 'ruth_pending' -> 'free_roam' -> 'debs_odd_notif_pending' -> 'debra_login_ready' -> 'done'
    adrianMessaged: false,

    // ---- 第三、四章节（合并为一条连续进度，绝大部分是严格线性）----
    chapter34Stage: 'debra_dashboard',
    // 顺序：debra_dashboard -> debs_hacked_chat_pending -> call_debra_ready -> worried_chat_pending
    // -> pavlov1_pending -> ch4_transition_pending -> oasis_notice_pending -> amber_safety_pending
    // -> free_roam_2 -> debs_calm_chat_pending -> (分歧点1后) -> amber_followup_pending（仅told_oasis线）
    ch4Started: false,             // 一旦true，OASIS app图标永久指向ch4公告页，不再回到登录/dashboard流程
    amberSafetyChatDone: false,    // 解锁debs_profile里的ch4三条post（nova/蜡烛/陶瓷）
    debsProfileViewedCh4: false,   // 第四章节：只有看过debs主页之后，邮箱(pavlov/harmony邮件)才解锁
    debsCalmChatChoice: null,      // 'told_oasis' | 'suggest_stop'
    amberFindingsChoice: null,     // 'nova' | 'other'

    // 剧情变量（严格对应大纲的变量表）
    investigationChoice: null,      // 'gave_up' | 'continued'
    nova_keyword_replied: false,    // 是否对amber正确回复了 NOVA
    interceptionChoice: null,       // 'gave_up' | 'cooperated'
    finalChoice: null,              // 'fix_sister' | 'side_with_hacker'
    foundHiddenClause: false,       // 是否点开了合同隐藏条款（彩蛋）
    firewallRulesApplied: false,    // 任务3防火墙规则是否成功完成

    // 防火墙规则编辑器的草稿规则（任务3进行中临时使用）
    firewallRules: [],              // [{action:'DROP', field:'SRC', value:'BIO_'}, ...]

    // checkpoint：记录玩家经过的三个关键抉择点，用于结局页"返回重选"
    // 每个 checkpoint 存：到达时的节点ID + 那一刻之前已经确定的状态快照
    // 注意：这个回溯功能只在同一次会话内有效，刷新/关闭页面后随整个gameState一起清空
    checkpoints: {
      A: null, // { node: 'choice_a', stateSnapshot: {...} }
      B: null,
      C: null,
    },

    // 已解锁的结局，用于"结局收集"面板（同样只在本次会话内累积）
    unlockedEndings: [], // 例如 ['disconnected', 'consciousness_copy', 'capsule_lockdown']
  };
}

let gameState = createDefaultState();

// 重置游戏状态，回到游戏最开始（"重新开始整个游戏"按钮用，
// 也是玩家刷新/重新打开页面时实际发生的事——见 main.js 里的 bootGame 调用）
function resetGameState() {
  gameState = createDefaultState();
}

/* ---------------- 状态更新的统一入口 ---------------- */

// 所有节点逻辑都应该通过这个函数改状态，而不是直接改 gameState.xxx = ...
function setState(patch) {
  Object.assign(gameState, patch);
}

function getState() {
  return gameState;
}

/* ---------------- checkpoint 存档点 ---------------- */

// 到达三个抉择点页面时调用，记录"此刻"的状态快照
function recordCheckpoint(id, nodeId) {
  const snapshot = JSON.parse(JSON.stringify(gameState)); // 深拷贝，避免后续修改影响快照
  delete snapshot.checkpoints; // 快照里不需要再嵌套存checkpoints自身
  gameState.checkpoints[id] = { node: nodeId, stateSnapshot: snapshot };
}

// 结局页"返回到上一个抉择点"功能：恢复快照状态，并跳回那个节点
// （仅在本次会话内有效 —— 因为 gameState 本身就是内存变量）
function restoreCheckpoint(id) {
  const cp = gameState.checkpoints[id];
  if (!cp) {
    console.warn('Checkpoint not found:', id);
    return null;
  }
  const restored = Object.assign(JSON.parse(JSON.stringify(cp.stateSnapshot)), {
    checkpoints: gameState.checkpoints, // 保留所有checkpoint记录，不要丢
    unlockedEndings: gameState.unlockedEndings, // 保留结局收集记录
  });
  gameState = restored;
  gameState.currentNode = cp.node;
  return cp.node;
}

// 标记某个结局已解锁（用于结局收集面板）
function unlockEnding(endingId) {
  if (!gameState.unlockedEndings.includes(endingId)) {
    gameState.unlockedEndings.push(endingId);
  }
}
