/* ============================================================
   helpers.js — 通用UI渲染辅助函数
   每类UI（桌面、邮件、聊天、story...）的"画法"统一收在这里，
   nodes.js 里的每个节点只需要传入数据，调用对应 render 函数即可，
   不需要重复写DOM拼接逻辑。
   ============================================================ */

/* ---------------- 图片占位 / 真实图片自动切换 ----------------
   用法：imgOrFallback('avatars/shawn.jpg', 'linear-gradient(145deg,#FF9F6B,#C2185B)', '50%')
   - 如果 images/avatars/shawn.jpg 存在，显示真实图片
   - 如果文件不存在/加载失败，自动回退成传入的CSS渐变色块，不会出现裂图图标
   - 第三个参数是圆角（'50%' 表示头像圆形，'12px' 表示图片矩形圆角等）
   - 第四个参数可传额外内联样式（比如 story 背景图需要 position:absolute;inset:0;）

   实现说明：用唯一id标记每个占位容器，图片真正加载完成/失败后，
   通过JS函数切换显示状态 —— 不在 onerror 属性里拼接HTML字符串，
   避免引号转义和浏览器解析差异带来的不稳定。
   每次调用会生成一个新的占位容器，里面同时放着 <img> 和 fallback的div，
   默认fallback可见、img不可见；img加载成功后才切换显示img、隐藏fallback。
------------------------------------------------------------- */
let __imgFallbackCounter = 0;

function imgOrFallback(relativePath, fallbackBg, borderRadius, extraStyle) {
  const safeFallbackBg = fallbackBg || 'linear-gradient(145deg,#9098A5,#5C6370)'; // 保底颜色，永远不会是空值
  const radius = borderRadius || '0';
  const extra = extraStyle || '';

  if (!relativePath) {
    // 没有规划图片路径，直接用占位色块
    return `<div style="width:100%;height:100%;background:${safeFallbackBg};border-radius:${radius};${extra}"></div>`;
  }

  const uid = 'imgfb_' + (__imgFallbackCounter++);
  // 容器内：fallback的div默认显示；img默认 display:none，加载成功后才显示出来并隐藏fallback
  return `<span id="${uid}" style="display:block;width:100%;height:100%;position:relative;${extra}">
    <div class="imgfb-placeholder" style="width:100%;height:100%;background:${safeFallbackBg};border-radius:${radius};"></div>
    <img src="images/${relativePath}" alt=""
      style="display:none;width:100%;height:100%;object-fit:cover;border-radius:${radius};position:absolute;inset:0;"
      data-imgfb-id="${uid}" />
  </span>`;
}

// 监听全局的图片加载事件（用事件委托，不需要每张图单独绑定监听器）
// 加载成功 → 隐藏占位色块、显示图片
// 加载失败 → 显式保持占位色块可见（不依赖img默认display:none的巧合，逻辑更清晰）
function __handleImgFbLoad(e) {
  if (e.target && e.target.tagName === 'IMG' && e.target.hasAttribute('data-imgfb-id')) {
    const img = e.target;
    img.style.display = 'block';
    const placeholder = img.previousElementSibling;
    if (placeholder && placeholder.classList.contains('imgfb-placeholder')) {
      placeholder.style.display = 'none';
    }
  }
}
function __handleImgFbError(e) {
  if (e.target && e.target.tagName === 'IMG' && e.target.hasAttribute('data-imgfb-id')) {
    const img = e.target;
    img.style.display = 'none'; // 保持隐藏，占位块继续显示（占位块本来就是默认可见，这里显式写出避免依赖默认值）
  }
}
// load / error 事件都不冒泡，必须用 capture 阶段监听才能在document层面捕获到
document.addEventListener('load', __handleImgFbLoad, true);
document.addEventListener('error', __handleImgFbError, true);

/* ---------------- helpers.js 自身的UI文案双语表 ----------------
   helpers.js 是渲染逻辑共享文件（英文版/中文版都调用同一份），不像 nodes.js
   那样按语言整份复制 —— 所以这里所有"游戏框架本身"的固定文案（通知栏、
   桌面图标、toast提示、OASIS app面板、日历、结局按钮等）单独建一份双语表，
   通过 HT(key) 按 i18n.js 里的 CURRENT_LANG 取对应语言的文案。
   每个节点(nodes.js/nodes.zh.js)里自己传入的内容（如聊天文案、邮件正文、
   monthLabel等）已经是各自语言文件里翻译好的，不在这里处理。
------------------------------------------------------------- */
const HELPERS_STRINGS = {
  en: {
    sentYouMessage: ' sent you a new message',
    tapToView: 'Tap to view.',
    defaultDate: 'Thursday, November 5',
    appLabelCalendar: 'Calendar',
    appLabelNotes: 'Notes',
    appLabelStore: 'Store',
    appLabelSettings: 'Settings',
    toastNothingNewHere: 'Nothing new here.',
    toastNoNewNotes: 'No new notes.',
    toastWelcomeBackStore: 'Welcome back to the store.',
    toastNothingToAdjust: 'Nothing to adjust right now.',
    toastNoNewUpdates: 'No new updates right now.',
    toastNoUpdatesFriends: 'No Updates Right Now',
    toastNoNewPhotos: 'No new photos.',
    vocalistShipped: 'Your VOCALIST has shipped!',
    vocalistBody: 'Your new speaker set is on its way. Tap to view details.',
    shawnNewStory: 'Shawn921 posted a new story',
    shawnNewStoryBody: "Tap to see what Shawn's been up to.",
    textDebsThoughts: 'Text Debs. I need to tell her my thoughts.',
    tryCallingDebs: 'Try calling Debs',
    shePickUp: 'She might pick up.',
    newMessageReceived: 'New message received',
    anomalyAlert: 'Anomaly Alert: We are investigating capsule failures…',
    inbox: 'Inbox',
    tryThinkingAgain: 'Try thinking about it again…',
    endOfConversation: "That's the end of the conversation — ",
    goBack: 'go back',
    defaultBackLabelFriends: '‹ Friends',
    messageBtn: 'Message',
    messageUnavailable: 'Message unavailable right now.',
    friendsBtn: 'Friends',
    friendRequestAccepted: 'Friend request already accepted.',
    likesSuffix: 'likes',
    continueBtn: 'Continue',
    oasisLoginDefaultPrompt: 'Due to long inactivity, please log in again for safety.',
    yourName: 'Your Name',
    dateOfBirth: 'Date of Birth (MM/DD/YYYY)',
    oasisSystemNote: 'System: Your behavior in entering personal details help our verification of biometric consistency. Neural resonance patterns analysis in progress.',
    fillBothFields: 'Please fill in both fields.',
    errorTryAgain: 'Error, please try again.',
    logIn: 'Log In',
    submitBtn: 'Submit',
    accessApproved: 'Access Approved: ',
    authorizedByDebra: 'Authorized by Debra.',
    verifyLine1: 'Security Intervention: Identity conflict detected. User does not match entered profile. Analyzing neural resonance signature…',
    verifyLine2: 'Biological Verification: Neural pattern mismatch confirmed. Initiating Kinship protocol. Scanning shared gut-microbiome markers in Database…',
    verifyLine3: 'Match Found: Blood Relative confirmed. Access permissions granted via Family Wellness Agreement Section 9.4.',
    verifyLine4: "Authorization Pending… Cross-account access request sent to paired device: 'Debs_Phone'. Standing by for user consent…",
    stressResilienceTest: 'Stress Resilience Test',
    currentResilience: 'Current Resilience',
    initiateStressTest: 'Initiate Resilience Stress-Test',
    statusLabel: 'Status',
    activeSyncPrefix: 'ACTIVE | Sync: ',
    nextCalibration: 'Next Calibration',
    viewingPrefix: 'Viewing: ',
    emotionalStabilityIndex: 'Emotional Stability Index',
    currentlyStable: 'Currently stable',
    automatedInterventionLog: 'Automated Intervention Log',
    neuroFreqPlotter: 'Neuro-Frequency Plotter — Last 24H',
    viewDetailedData: 'View Detailed Historical Data ▾',
    hideDetailedData: 'Hide Detailed Historical Data ▴',
    failedLabel: 'FAILED',
    ourTerms: 'Our Terms',
    signOut: 'Sign Out',
    vagalMonitoring: 'Monitoring for Vagal Neural Processing Score...',
    correctFeedback: 'Correct.',
    wrongFeedback: 'Incorrect.',
    returnToPreviousChoice: 'Return to a Previous Choice',
    viewEndingCollection: 'View Ending Collection',
    restartGame: 'Restart the Game',
    weekdayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    legendWork: 'Work',
    legendFriends: 'Friends',
    legendExam: 'Exam',
    upcomingBirthdays: 'Upcoming Birthdays',
    today: 'Today!',
    daysLeft: 'days left',
    turningAge: (age) => `Turning ${age}`,
    bdayLocale: 'en-US',
  },
  zh: {
    sentYouMessage: '给你发了一条新消息',
    tapToView: '点击查看。',
    defaultDate: '11月5日 星期四',
    appLabelCalendar: '日历',
    appLabelNotes: '备忘录',
    appLabelStore: '商店',
    appLabelSettings: '设置',
    toastNothingNewHere: '暂无新内容。',
    toastNoNewNotes: '没有新备忘录。',
    toastWelcomeBackStore: '欢迎回到商店。',
    toastNothingToAdjust: '目前没有可调整的设置。',
    toastNoNewUpdates: '目前没有新动态。',
    toastNoUpdatesFriends: '目前没有新动态',
    toastNoNewPhotos: '没有新照片。',
    vocalistShipped: 'VOCALIST已发货！',
    vocalistBody: '你的新音箱套装正在路上。点击查看详情。',
    shawnNewStory: 'Shawn921发布了一条新动态',
    shawnNewStoryBody: '点击看看Shawn最近在忙什么。',
    textDebsThoughts: '给Debs发消息。我得告诉她我的想法。',
    tryCallingDebs: '试着给Debs打电话',
    shePickUp: '她可能会接。',
    newMessageReceived: '收到新消息',
    anomalyAlert: '异常警报：我们正在调查胶囊故障…',
    inbox: '收件箱',
    tryThinkingAgain: '再想想看…',
    endOfConversation: '对话到这里结束了 — ',
    goBack: '返回',
    defaultBackLabelFriends: '‹ 好友',
    messageBtn: '发消息',
    messageUnavailable: '暂时无法发送消息。',
    friendsBtn: '好友',
    friendRequestAccepted: '已经是好友了。',
    likesSuffix: '赞',
    continueBtn: '继续',
    oasisLoginDefaultPrompt: '由于长时间未操作，为了安全请重新登录。',
    yourName: '你的姓名',
    dateOfBirth: '出生日期（MM/DD/YYYY）',
    oasisSystemNote: '系统：你输入个人信息时的行为模式正在帮助我们验证生物识别一致性。神经共振模式分析中。',
    fillBothFields: '请填写两个字段。',
    errorTryAgain: '出错了，请重试。',
    logIn: '登录',
    submitBtn: '提交',
    accessApproved: '访问已批准：',
    authorizedByDebra: '已获Debra授权。',
    verifyLine1: '安全干预：检测到身份冲突。用户与输入的资料不匹配。正在分析神经共振特征…',
    verifyLine2: '生物验证：已确认神经模式不匹配。正在启动亲属关系协议。扫描数据库中的共享肠道微生物标记…',
    verifyLine3: '匹配成功：已确认血缘亲属关系。已根据《家庭健康协议》第9.4条授予访问权限。',
    verifyLine4: "授权待处理…跨账户访问请求已发送至配对设备：'Debs_Phone'。正在等待用户同意…",
    stressResilienceTest: '压力恢复力测试',
    currentResilience: '当前恢复力',
    initiateStressTest: '启动恢复力压力测试',
    statusLabel: '状态',
    activeSyncPrefix: '活跃 | 同步：',
    nextCalibration: '下次校准',
    viewingPrefix: '正在查看：',
    emotionalStabilityIndex: '情绪稳定指数',
    currentlyStable: '当前稳定',
    automatedInterventionLog: '自动干预日志',
    neuroFreqPlotter: '神经频率图 — 过去24小时',
    viewDetailedData: '查看详细历史数据 ▾',
    hideDetailedData: '隐藏详细历史数据 ▴',
    failedLabel: '失败',
    ourTerms: '我们的条款',
    signOut: '退出登录',
    vagalMonitoring: '检测迷走神经加工指数中...',
    correctFeedback: '回答正确。',
    wrongFeedback: '回答错误。',
    returnToPreviousChoice: '返回之前的选择',
    viewEndingCollection: '查看结局收藏',
    restartGame: '重新开始游戏',
    weekdayLabels: ['日', '一', '二', '三', '四', '五', '六'],
    legendWork: '工作',
    legendFriends: '好友',
    legendExam: '考试',
    upcomingBirthdays: '近期生日',
    today: '今天！',
    daysLeft: '天后',
    turningAge: (age) => `即将满 ${age} 岁`,
    bdayLocale: 'zh-CN',
  }
};
// 取当前语言对应的文案；CURRENT_LANG 由 i18n.js 定义（脚本加载顺序在 helpers.js 之后），
// 但这里只在函数被调用时才读取它的值（不是在脚本顶层立即读取），所以不存在加载顺序问题。
function HT(key) {
  const lang = (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'zh') ? 'zh' : 'en';
  const table = HELPERS_STRINGS[lang];
  return key in table ? table[key] : HELPERS_STRINGS.en[key];
}

/* ---------------- 标准化的 message 类通知配置 ----------------
   统一文案格式："MESSAGE / [Name] sent you a new message / Tap to view."
   以后任何角色（debs/ruth/amber等）发来消息提醒，调用这个函数生成notif配置，
   不要手写文案字符串 —— 确保全游戏的消息通知格式完全一致。
   用法：notif: messageNotif('Debs', 'debs_chat_1')
------------------------------------------------------------- */
function messageNotif(name, goto) {
  return {
    iconClass: 'friends', icon: '💬', app: 'MESSAGE',
    title: name + HT('sentYouMessage'),
    body: HT('tapToView'),
    goto: goto
  };
}

// OASIS图标点击目标的统一计算：ch4开始后永久指向公告页；否则按当前登录会话决定是直接进dashboard还是先登录
function oasisAppGoto() {
  const state = getState();
  if (state.ch4Started) return 'oasis_notice';
  if (state.oasisSession === 'self') return 'oasis_app_dashboard';
  if (state.oasisSession === 'debra') return 'debra_oasis_dashboard';
  return 'oasis_app_login';
}

/* ---------------- 桌面 ----------------
   config.date 始终用"Nov 8, 2032"这种英文月份缩写格式传入（包括中文版的nodes.zh.js也是如此），
   因为这个字符串同时被calendar app的parseGameDateToYMD()当作可解析的"今天"日期值使用。
   所以这里只负责"展示用"的格式转换：中文模式下把它重新格式化成"2032年11月8日"再显示，
   不改变 state.currentGameDate 里存的原始值，calendar逻辑完全不受影响。
------------------------------------------------------------- */
function formatDesktopDateForDisplay(dateStr) {
  if (typeof CURRENT_LANG === 'undefined' || CURRENT_LANG !== 'zh') return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const m = dateStr.match(/([A-Za-z]+)\s+(\d+),\s*(\d+)/);
  if (!m) return dateStr;
  const monthIdx = months.indexOf(m[1].slice(0, 3));
  if (monthIdx === -1) return dateStr;
  return `${m[3]}年${monthIdx + 1}月${parseInt(m[2], 10)}日`;
}

// config: { notif: {icon, app, title, body, goto} | null, dockGoto: {mail, friends, music, photos} }
function renderDesktop(config) {
  setState({ lastDesktopNode: getState().currentNode });
  const notifSlot = document.getElementById('desktop-notif-slot');
  if (config.notif) {
    notifSlot.innerHTML = `
      <div class="notif-banner" data-goto="${config.notif.goto}">
        <div class="notif-icon ${config.notif.iconClass}">${config.notif.icon}</div>
        <div class="notif-text">
          <div class="notif-app">${config.notif.app} <span class="time">now</span></div>
          <div class="notif-title">${config.notif.title}</div>
          <div class="notif-body">${config.notif.body}</div>
        </div>
      </div>`;
  } else {
    notifSlot.innerHTML = '';
  }

  document.getElementById('desktop-time-big').textContent = config.time || '9:41';
  document.getElementById('desktop-date').textContent = config.date ? formatDesktopDateForDisplay(config.date) : HT('defaultDate');
  // 把当前桌面对应的剧情日期存入全局状态，日历app读取这个值作为"今天"，
  // 这样不需要每个跳转到日历的节点单独传递日期参数
  if (config.date) setState({ currentGameDate: config.date });

  const appGrid = document.getElementById('desktop-app-grid');
  const oasisIconHtml = config.showOasisApp
    ? `<div class="app-icon-wrap"><div class="app-icon icon-oasis" data-goto="${config.oasisGoto || oasisAppGoto()}">OASIS</div><div class="app-label">Oasis</div></div>`
    : '';
  const calendarAttr = config.showCalendarApp
    ? `data-goto="${config.calendarGoto || 'calendar_app'}"`
    : `data-toast="${HT('toastNothingNewHere')}"`;
  appGrid.innerHTML = `
    <div class="app-icon-wrap"><div class="app-icon icon-cal" ${calendarAttr}>📅</div><div class="app-label">${HT('appLabelCalendar')}</div></div>
    <div class="app-icon-wrap"><div class="app-icon icon-notes" data-toast="${HT('toastNoNewNotes')}">📝</div><div class="app-label">${HT('appLabelNotes')}</div></div>
    <div class="app-icon-wrap"><div class="app-icon icon-store" data-toast="${HT('toastWelcomeBackStore')}">🛍️</div><div class="app-label">${HT('appLabelStore')}</div></div>
    <div class="app-icon-wrap"><div class="app-icon icon-settings" data-toast="${HT('toastNothingToAdjust')}">⚙️</div><div class="app-label">${HT('appLabelSettings')}</div></div>
    ${oasisIconHtml}
  `;

  const dock = document.getElementById('desktop-dock');
  const dg = config.dockGoto || {};
  dock.innerHTML = `
    <div class="app-icon-wrap"><div class="app-icon icon-mail" ${dg.mail ? `data-goto="${dg.mail}"` : `data-toast="${HT('toastNoNewUpdates')}"`}>✉️</div></div>
    <div class="app-icon-wrap"><div class="app-icon icon-friends" ${dg.friends ? `data-goto="${dg.friends}"` : `data-toast="${HT('toastNoUpdatesFriends')}"`}>👥</div></div>
    <div class="app-icon-wrap"><div class="app-icon icon-music" ${dg.music ? `data-goto="${dg.music}"` : `data-toast="${HT('toastNoNewUpdates')}"`}>🎵</div></div>
    <div class="app-icon-wrap"><div class="app-icon icon-photos" ${dg.photos ? `data-goto="${dg.photos}"` : `data-toast="${HT('toastNoNewPhotos')}"`}>🖼️</div></div>
  `;
}

/* ---------------- 第一章节：动态桌面通知 ----------------
   desktop_1/2/3/3b 这几个节点ID都保留（兼容现有所有links引用），
   但render内容统一委托给这个函数：根据状态标志动态决定"现在该显示哪条待处理通知"，
   不再依赖玩家走了哪条具体路径 —— 无论从哪个node id进来，显示的通知永远是当前真正待处理的那一条。
------------------------------------------------------------- */
function renderChapter1Desktop(time, date) {
  const state = getState();
  let notif = null;
  if (!state.mailNotifSeen) {
    notif = {
      iconClass: 'mail', icon: '✉️', app: 'MAIL',
      title: HT('vocalistShipped'),
      body: HT('vocalistBody'),
      goto: 'mail_vocalist'
    };
  } else if (!state.friendsNotifConsumed) {
    notif = {
      iconClass: 'friends', icon: '👥', app: 'FRIENDS',
      title: HT('shawnNewStory'),
      body: HT('shawnNewStoryBody'),
      goto: 'friends_feed'
    };
  } else if (!state.debsChat1Done) {
    notif = messageNotif('Debs', 'debs_chat_1');
  } else if (!state.priyaChatDone) {
    notif = messageNotif('Priya', 'priya_chat');
  } else {
    notif = null;
  }

  renderDesktop({
    time: time,
    date: date,
    notif: notif,
    showOasisApp: true,
    showCalendarApp: true,
    calendarGoto: 'calendar_app',
    dockGoto: { mail: 'mail_vocalist', friends: 'friends_feed' }
  });
}

/* ---------------- 第二章节：动态桌面通知 ---------------- */
function renderChapter2Desktop(time, date) {
  const state = getState();
  let notif = null;
  if (state.chapter2Stage === 'ruth_pending') {
    notif = messageNotif('Ruth', 'ruth_chat');
  } else if (state.chapter2Stage === 'debs_odd_notif_pending') {
    notif = messageNotif('Debs', 'debs_odd_notif_chat');
  } else {
    notif = null; // free_roam / debra_login_ready：玩家自行探索friends/oasis app，不强制推送
  }
  renderDesktop({
    time: time,
    date: date,
    notif: notif,
    showOasisApp: true,
    showCalendarApp: true,
    calendarGoto: 'calendar_app',
    dockGoto: state.chapter2Stage === 'ruth_pending' ? {} : { friends: 'friends_feed' }
  });
}

/* ---------------- 第三、四章节：动态桌面通知（连续一条进度线） ---------------- */
function renderChapter34Desktop(time, date) {
  const state = getState();
  let notif = null;
  let dockGoto = { friends: 'friends_feed' };

  switch (state.chapter34Stage) {
    case 'debs_hacked_chat_pending':
      notif = { iconClass: 'friends', icon: '💬', app: 'MESSAGE', title: HT('textDebsThoughts'), body: HT('tapToView'), goto: 'debs_hacked_chat' };
      break;
    case 'call_debra_ready':
      notif = { iconClass: 'friends', icon: '📞', app: 'PHONE', title: HT('tryCallingDebs'), body: HT('shePickUp'), goto: 'calling_debra' };
      break;
    case 'worried_chat_pending':
      notif = { iconClass: 'friends', icon: '💬', app: 'MESSAGE', title: HT('textDebsThoughts'), body: HT('tapToView'), goto: 'debs_worried_chat' };
      break;
    case 'pavlov1_pending':
      notif = { iconClass: 'mail', icon: '✉️', app: 'MAIL', title: HT('newMessageReceived'), body: HT('tapToView'), goto: 'pavlov_email_1' };
      dockGoto = { friends: 'friends_feed', mail: 'pavlov_email_1' };
      break;
    case 'pavlov3_pending':
      notif = { iconClass: 'mail', icon: '✉️', app: 'MAIL', title: HT('newMessageReceived'), body: HT('tapToView'), goto: 'pavlov_email_3' };
      dockGoto = { friends: 'friends_feed', mail: 'pavlov_email_3' };
      break;
    case 'oasis_notice_pending':
      notif = { iconClass: 'oasis', icon: '⚠️', app: 'OASIS', title: HT('anomalyAlert'), body: HT('tapToView'), goto: 'oasis_notice' };
      break;
    case 'amber_safety_pending':
      notif = null; // 玩家通过点击OASIS图标自行进入（oasis_notice页面本身仍可达）
      break;
    case 'free_roam_2':
      dockGoto = state.debsProfileViewedCh4
        ? { friends: 'friends_feed', mail: 'mail_ch4_emails' }
        : { friends: 'friends_feed' };
      break;
    case 'debs_calm_chat_pending':
      notif = messageNotif('Debs', 'debs_calm_chat');
      dockGoto = { friends: 'friends_feed', mail: 'mail_ch4_emails' };
      break;
    case 'amber_followup_pending':
      notif = messageNotif('Amber', 'amber_followup_chat');
      dockGoto = { friends: 'friends_feed', mail: 'mail_ch4_emails' };
      break;
    default:
      notif = null;
  }

  renderDesktop({
    time: time,
    date: date,
    notif: notif,
    showOasisApp: true,
    showCalendarApp: true,
    calendarGoto: 'calendar_app',
    dockGoto: dockGoto
  });
}


// mailList: [{id, from, subj, snippet, unread, detailRender: () => htmlString}]
// realMailId: 默认打开哪一封
// backTarget: 返回按钮目标节点
function renderMailApp(mailList, realMailId, backTarget) {
  document.getElementById('mail-back-btn').setAttribute('data-goto', backTarget);

  function paintList() {
    const list = document.getElementById('mail-list');
    list.innerHTML = `<div class="mail-list-header">${HT('inbox')}</div>` + mailList.map(m => `
      <div class="mail-item" data-mailid="${m.id}">
        <div class="from">${m.unread ? '<span class="unread-dot"></span>' : ''}${m.from}</div>
        <div class="subj">${m.subj}</div>
        <div class="snippet">${m.snippet}</div>
      </div>
    `).join('');

    list.querySelectorAll('.mail-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-mailid');
        const m = mailList.find(x => x.id === id);
        m.unread = false;
        document.getElementById('mail-detail').innerHTML = m.detailRender();
        paintList();
        setTimeout(() => {
          const refreshed = document.querySelector(`[data-mailid="${id}"]`);
          if (refreshed) refreshed.classList.add('active-mail');
        }, 0);
      });
    });
  }

  paintList();
  const initial = mailList.find(m => m.id === realMailId) || mailList[0];
  document.getElementById('mail-detail').innerHTML = initial.detailRender();
  initial.unread = false;
  paintList();
  setTimeout(() => {
    const el = document.querySelector(`[data-mailid="${initial.id}"]`);
    if (el) el.classList.add('active-mail');
  }, 0);
}

/* ---------------- 聊天界面（核心：自动播放 + 玩家预填发送 + 可选选项按钮） ---------------- */
// config: {
//   headerName, backTarget,
//   script: [{from:'me'|'them', text}] ,
//   optionsStep: { afterStepIndex, options: [{label, isCorrect, wrongFeedback}], onCorrect },
//   onEnd: () => void   // 对话全部结束时调用（比如自动跳转下一节点）
//   showEndBar: bool (默认true，是否显示"返回"链接)
// }
function renderChatApp(config) {
  document.getElementById('chat-header-name').textContent = config.headerName;
  document.getElementById('chat-back-btn').setAttribute('data-goto', config.backTarget);
  if (config.characterId) {
    const character = getCharacter(config.characterId);
    document.getElementById('chat-header-avatar').innerHTML = imgOrFallback(character.img, character.fallback, '50%');
  }
  document.getElementById('chat-body').innerHTML = '';
  document.getElementById('chat-end-bar').classList.add('hide');
  document.getElementById('chat-end-bar').innerHTML = '';
  document.getElementById('chat-options-row').classList.add('hide');
  document.getElementById('chat-options-row').innerHTML = '';
  document.getElementById('chat-input-row').classList.remove('hide');

  let chatInput = document.getElementById('chat-input');
  let chatSend = document.getElementById('chat-send');
  // 用克隆替换的方式清空旧的事件监听（避免每次进入聊天页事件叠加）
  const newInput = chatInput.cloneNode(true);
  chatInput.parentNode.replaceChild(newInput, chatInput);
  const newSend = chatSend.cloneNode(true);
  chatSend.parentNode.replaceChild(newSend, chatSend);
  chatInput = newInput;
  chatSend = newSend;

  let step = 0;
  let active = true;

  // line 可以是纯字符串（向后兼容旧调用方式），也可以是完整消息对象 { text } 或 { type:'image', img, caption }
  function appendBubble(from, line) {
    const body = document.getElementById('chat-body');
    const b = document.createElement('div');
    const isImageMsg = line && typeof line === 'object' && line.type === 'image';

    if (isImageMsg) {
      b.className = 'bubble bubble-image ' + (from === 'me' ? 'me' : 'them');
      b.innerHTML = imgOrFallback(line.img, 'linear-gradient(135deg,#cfd8e3,#9aa7b8)', '12px')
        + (line.caption ? `<div class="bubble-image-caption">${line.caption}</div>` : '');
    } else {
      const text = (line && typeof line === 'object') ? line.text : line;
      b.className = 'bubble ' + (from === 'me' ? 'me' : 'them');
      b.textContent = text;
    }
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
  }
  function showTyping() {
    const body = document.getElementById('chat-body');
    const t = document.createElement('div');
    t.className = 'typing-indicator';
    t.id = 'typing-now';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
  }
  function removeTyping() {
    const t = document.getElementById('typing-now');
    if (t) t.remove();
  }

  function primeDraft() {
    const line = config.script[step];
    if (line && line.from === 'me') {
      chatInput.value = line.text;
      chatInput.classList.add('draft');
      chatSend.disabled = false;
    } else {
      chatInput.value = '';
      chatInput.classList.remove('draft');
      chatSend.disabled = true;
    }
  }

  function maybeShowOptions() {
    if (config.optionsStep && config.optionsStep.afterStepIndex === step) {
      document.getElementById('chat-input-row').classList.add('hide');
      const optRow = document.getElementById('chat-options-row');
      optRow.classList.remove('hide');
      optRow.innerHTML = config.optionsStep.options.map((o, i) => `
        <div class="chat-option-btn ${o.extraClass || ''}" data-optidx="${i}">${o.label}</div>
      `).join('');
      optRow.querySelectorAll('.chat-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-optidx'));
          const opt = config.optionsStep.options[idx];
          if (opt.isCorrect) {
            appendBubble('me', opt.sendText || opt.label);
            optRow.classList.add('hide');
            document.getElementById('chat-input-row').classList.remove('hide');
            if (config.optionsStep.onCorrect) config.optionsStep.onCorrect();
            step++;
            setTimeout(advance, 500);
          } else {
            showToast(opt.wrongFeedback || HT('tryThinkingAgain'));
          }
        });
      });
      return true;
    }
    return false;
  }

  function advance() {
    if (!active) return;
    if (maybeShowOptions()) return;
    if (step >= config.script.length) {
      end();
      return;
    }
    const line = config.script[step];
    if (line.from === 'me') {
      primeDraft();
      return;
    } else {
      chatInput.value = '';
      chatInput.classList.remove('draft');
      chatSend.disabled = true;
      showTyping();
      setTimeout(() => {
        removeTyping();
        appendBubble('them', line);
        step++;
        setTimeout(advance, 550);
      }, 900 + Math.random() * 500);
    }
  }

  function playerSend() {
    if (!active) return;
    const line = config.script[step];
    if (!line || line.from !== 'me') return;
    appendBubble('me', line.text);
    chatInput.value = '';
    chatInput.classList.remove('draft');
    chatSend.disabled = true;
    step++;
    setTimeout(advance, 500);
  }

  chatSend.addEventListener('click', playerSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); playerSend(); }
    else if (chatInput.classList.contains('draft') && e.key !== 'Tab') { e.preventDefault(); }
  });

  function end() {
    active = false;
    document.getElementById('chat-input-row').classList.add('hide');
    const endBar = document.getElementById('chat-end-bar');
    endBar.classList.remove('hide');
    endBar.innerHTML = `${HT('endOfConversation')}<span class="chat-endbar-link" id="chat-endbar-gobtn">${HT('goBack')}</span>`;
    document.getElementById('chat-endbar-gobtn').addEventListener('click', () => {
      if (config.onEnd) config.onEnd();
      else goToNode(config.backTarget);
    });
  }

  advance();
}

/* ---------------- Story 播放页 ---------------- */
// config: { characterId, slides: [{sceneClass, img(可选), icon, caption}], onComplete: nodeId, profileTarget: nodeId, closeTarget: nodeId }
function renderStoryPlayer(config) {
  let idx = 0;
  const character = getCharacter(config.characterId);

  const topNameEl = document.getElementById('story-top-name');
  const topAvatarEl = document.getElementById('story-top-avatar');
  const topInfoEl = document.getElementById('story-top-info');
  const closeEl = document.getElementById('story-close');
  if (!topNameEl || !topAvatarEl || !topInfoEl || !closeEl) {
    console.error('renderStoryPlayer: could not find the story DOM elements — check whether index.html structure was modified');
    return;
  }
  topNameEl.textContent = character.name;
  topAvatarEl.innerHTML = imgOrFallback(character.img, character.fallback, '50%');
  topInfoEl.setAttribute('data-goto', config.profileTarget);
  closeEl.setAttribute('data-goto', config.closeTarget);

  function renderProgress() {
    const row = document.getElementById('story-progress-row');
    row.innerHTML = config.slides.map((_, i) => `
      <div class="story-progress-seg ${i < idx ? 'filled' : ''}"><div class="fill"></div></div>
    `).join('');
  }

  function renderSlide() {
    const content = document.getElementById('story-content');
    const slide = config.slides[idx];
    const bgContent = slide.img
      ? imgOrFallback(slide.img, '', '0', 'position:absolute;inset:0;')
      : `<div class="scene-icon-center">${slide.icon}</div>`;
    content.innerHTML = `
      <div class="story-bg-scene ${slide.sceneClass}">${bgContent}</div>
      <div class="story-caption-box">${slide.caption ? `<span class="cap">${slide.caption}</span>` : ''}</div>
    `;
    document.querySelectorAll('.story-progress-seg').forEach((seg, i) => {
      seg.classList.toggle('filled', i < idx);
      const fillBar = seg.querySelector('.fill');
      if (!fillBar) return; // 防御性保护：理论上不该发生，但避免在异常情况下抛出异常中断整个渲染
      if (i === idx) {
        fillBar.style.transition = 'none';
        fillBar.style.width = '0%';
        requestAnimationFrame(() => {
          fillBar.style.transition = 'width 4s linear';
          fillBar.style.width = '100%';
        });
      } else {
        fillBar.style.width = i < idx ? '100%' : '0%';
      }
    });
  }

  renderProgress();
  renderSlide();

  const nextEl = document.getElementById('story-next');
  const prevEl = document.getElementById('story-prev');
  const newNext = nextEl.cloneNode(true);
  nextEl.parentNode.replaceChild(newNext, nextEl);
  const newPrev = prevEl.cloneNode(true);
  prevEl.parentNode.replaceChild(newPrev, prevEl);

  newNext.addEventListener('click', () => {
    if (idx < config.slides.length - 1) {
      idx++;
      renderSlide();
    } else {
      goToNode(config.onComplete);
    }
  });
  newPrev.addEventListener('click', () => {
    if (idx > 0) { idx--; renderSlide(); }
  });
}

/* ---------------- 个人主页 ---------------- */
// config: { avatarImg(可选,如 'avatars/shawn.jpg'), avatarGradient, name, stats:[{n,l}], bio, messageTarget(可为null表示不开放), backTarget, gridCells: [css class,...] }
/* ---------------- 随机日常post生成（带session内缓存，避免每次重新渲染都换内容） ---------------- */
const RANDOM_CAPTION_POOL = [
  'best coffee run today ☕', 'rainy day vibes 🌧️', 'finally finished that book 📖',
  'gym day, feeling good 💪', 'trying out a new recipe tonight 🍝', 'long walk, clear head',
  "can't believe it's already this time of year", 'lazy sunday 😌', 'new playlist on repeat 🎧',
  'missed call from mom, calling back now', 'sunset from my window tonight 🌇', 'finally cleaned my room lol',
  'three coffees deep and still tired', 'found this place randomly, obsessed', 'currently spiraling about laundry',
  'good day. just a good day.', 'forgot how much I needed this weekend', 'new shoes, 10/10 no notes 👟',
];
const RANDOM_COMMENTER_NAMES = ['mia.l', 'jordan_t', 'devon__', 'priya92', 'lex.codes', 'reyna.b', 'noah_w', 'kit.av'];
const RANDOM_COMMENT_TEXT = ['love this!', 'omg same', 'literally me', '🔥🔥🔥', 'miss you!', 'need to try this', 'so real', 'this made my day', '🥹', 'yesss', 'okay but mood'];

function seededRandom(seedStr) {
  // 简单的字符串hash作种子，保证同样的cacheKey+index每次算出同一个"随机"值（避免每次渲染都换内容）
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) { h = (h * 31 + seedStr.charCodeAt(i)) >>> 0; }
  return (h % 10000) / 10000;
}
function shuffleSeeded(arr, seedStr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seedStr + '_' + i) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function randomDateInRange(dateStart, dateEnd, seedStr) {
  // dateStart/dateEnd: 'YYYY-MM-DD'；返回 {label: 'Nov 3', sortKey: 'YYYY-MM-DD'}，用于按时间倒序排列
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const start = new Date(dateStart);
  const end = new Date(dateEnd);
  const span = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  const offset = Math.floor(seededRandom(seedStr) * span);
  const d = new Date(start.getTime() + offset * 24 * 60 * 60 * 1000);
  return { label: months[d.getMonth()] + ' ' + d.getDate(), sortKey: d.toISOString().slice(0, 10) };
}
// 生成count条随机日常post，结果按cacheKey缓存在state里（同一局游戏内反复进入同一主页内容保持稳定）
function generateRandomPosts(cacheKey, count, dateStart, dateEnd) {
  const state = getState();
  if (!state.postCache) setState({ postCache: {} });
  if (getState().postCache[cacheKey]) return getState().postCache[cacheKey];

  const captions = shuffleSeeded(RANDOM_CAPTION_POOL, cacheKey + '_cap').slice(0, count);
  const posts = captions.map((cap, i) => {
    const seed = cacheKey + '_post_' + i;
    const date = randomDateInRange(dateStart, dateEnd, seed);
    const likes = 40 + Math.floor(seededRandom(seed + '_likes') * 360);
    const commentCount = 1 + Math.floor(seededRandom(seed + '_ccount') * 3);
    const commenters = shuffleSeeded(RANDOM_COMMENTER_NAMES, seed + '_commenters').slice(0, commentCount);
    const comments = commenters.map((name, ci) => ({
      name,
      text: RANDOM_COMMENT_TEXT[Math.floor(seededRandom(seed + '_ctext_' + ci) * RANDOM_COMMENT_TEXT.length)]
    }));
    return { caption: cap, dateLabel: date.label, sortKey: date.sortKey, likes, comments, img: '', goto: null };
  }).sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  const updated = Object.assign({}, getState().postCache, { [cacheKey]: posts });
  setState({ postCache: updated });
  return posts;
}

/* ---------------- 个人主页（Facebook风格，post直接展开显示，下滑浏览） ----------------
   config: { avatarImg, avatarGradient, name, stats, bio, messageTarget, messageDisabledToast,
             backTarget, backLabel, posts: [{img,gradient,caption,dateLabel,likes,comments:[{name,text}],goto,toast}] }
   和旧版renderProfile（九宫格）并存，互不影响；friends app里所有可点进的用户主页统一改用这个。
------------------------------------------------------------- */
function renderProfileFeed(config) {
  const scrollWrap = document.getElementById('profile-scroll-wrap');
  if (scrollWrap) scrollWrap.scrollTop = 0;
  const backBtn = document.getElementById('profile-back-btn');
  backBtn.setAttribute('data-goto', config.backTarget);
  backBtn.textContent = config.backLabel || HT('defaultBackLabelFriends');
  const header = document.getElementById('profile-header');
  header.innerHTML = `
    <div class="profile-top">
      <div class="profile-avatar">${imgOrFallback(config.avatarImg, config.avatarGradient, '50%')}</div>
      <div class="profile-stats">
        ${config.stats.map(s => `<div class="profile-stat"><div class="n">${s.n}</div><div class="l">${s.l}</div></div>`).join('')}
      </div>
    </div>
    <div class="profile-name">${config.name}</div>
    <div class="profile-bio">${config.bio}</div>
    <div class="profile-actions">
      ${config.messageTarget
        ? `<div class="profile-btn message" data-goto="${config.messageTarget}">${HT('messageBtn')}</div>`
        : `<div class="profile-btn message" data-toast="${config.messageDisabledToast || HT('messageUnavailable')}" style="opacity:0.5;">${HT('messageBtn')}</div>`}
      <div class="profile-btn" data-toast="${HT('friendRequestAccepted')}">${HT('friendsBtn')}</div>
    </div>
  `;
  const feed = document.getElementById('profile-grid');
  feed.classList.add('profile-feed-list');
  feed.innerHTML = config.posts.map((p, i) => `
    <div class="post profile-feed-post ${p.goto ? 'clickable-post' : ''}" data-postidx="${i}">
      <div class="post-head">
        <div class="post-avatar">${imgOrFallback(config.avatarImg, config.avatarGradient, '50%')}</div>
        <div><div class="post-name">${config.name}</div><div class="post-date">${p.dateLabel || ''}</div></div>
      </div>
      <div class="post-img">${imgOrFallback(p.img, p.gradient || 'linear-gradient(135deg,#cfd8e3,#9aa7b8)', '12px')}</div>
      <div class="post-caption">${p.caption}</div>
      <div class="post-likes">${p.likes != null ? `❤️ ${p.likes} ${HT('likesSuffix')}` : ''}</div>
      ${(p.comments || []).map(c => `<div class="comment-line"><b>${c.name}</b> ${c.text}</div>`).join('')}
    </div>
  `).join('');
  feed.querySelectorAll('.clickable-post').forEach(el => {
    const p = config.posts[parseInt(el.getAttribute('data-postidx'), 10)];
    el.addEventListener('click', () => goToNode(p.goto));
  });
  feed.querySelectorAll('.profile-feed-post:not(.clickable-post)').forEach(el => {
    const p = config.posts[parseInt(el.getAttribute('data-postidx'), 10)];
    if (p.toast) el.addEventListener('click', () => showToast(p.toast));
  });
}

/* ---------------- 抉择点页 ---------------- */
// config: { text, options: [{label, style, onSelect, goto}] }
function renderChoice(config) {
  const wrap = document.getElementById('choice-wrap');
  wrap.innerHTML = `
    <div class="choice-text">${config.text}</div>
    <div class="choice-btns">
      ${config.options.map((o, i) => `<div class="choice-btn ${o.style || ''}" data-optidx="${i}">${o.label}</div>`).join('')}
    </div>
  `;
  wrap.querySelectorAll('[data-optidx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-optidx'));
      const opt = config.options[idx];
      if (opt.onSelect) opt.onSelect();
      goToNode(opt.goto);
    });
  });
}

/* ---------------- 纯文字过场页 ---------------- */
// config: { text, buttonLabel, goto }
function renderNarrative(config) {
  const wrap = document.getElementById('narrative-wrap');
  wrap.innerHTML = `
    <div class="narrative-text">${config.text}</div>
    <div class="narrative-continue-btn" data-goto="${config.goto}">${config.buttonLabel || HT('continueBtn')}</div>
  `;
}

/* ---------------- OASIS app：登录验证页 ----------------
   config: {
     promptText, validUsername(string或返回string的函数), validBirthday('YYYY-MM-DD'),
     onSuccess(成功后跳转的nodeId), backTarget
   }
   验证逻辑做了宽松处理：用户名忽略大小写/首尾空格；生日支持多种常见输入格式
   （MM/DD/YYYY、YYYY-MM-DD等），只要月日年三个数字都对得上就算通过 —— 
   这是个剧情机制，不是真实安全场景，不应该让玩家因为格式细节卡关。
------------------------------------------------------------- */
function parseBirthdayLoose(input) {
  // 从任意常见日期格式字符串中提取出 {y, m, d} 三个数字，提取不到返回null
  const nums = (input.match(/\d+/g) || []).map(n => parseInt(n, 10));
  if (nums.length < 3) return null;
  // 找出哪个数字最像年份（>=1900）
  const yearIdx = nums.findIndex(n => n >= 1900);
  if (yearIdx === -1) return null;
  const y = nums[yearIdx];
  const rest = nums.filter((_, i) => i !== yearIdx);
  if (rest.length < 2) return null;
  // 剩下两个数字哪个更可能是月份（<=12）放在前面，但月/日格式本身有歧义，
  // 这里采取宽松策略：只要这两个数字（不分顺序）能匹配目标月日，就算通过
  return { y, nums2: rest.slice(0, 2) };
}
function birthdayMatches(input, validBirthday) {
  const target = validBirthday.split('-').map(n => parseInt(n, 10)); // [Y, M, D]
  const parsed = parseBirthdayLoose(input);
  if (!parsed) return false;
  if (parsed.y !== target[0]) return false;
  const targetMD = [target[1], target[2]].sort((a, b) => a - b).join(',');
  const inputMD = [...parsed.nums2].sort((a, b) => a - b).join(',');
  return targetMD === inputMD;
}

function renderOasisLogin(config) {
  document.getElementById('document-back-btn').setAttribute('data-goto', config.backTarget);
  const wrap = document.getElementById('document-wrap');
  wrap.scrollTop = 0;
  wrap.innerHTML = `
    <div class="oasis-login-wrap">
      <div class="oasis-login-logo">OASIS</div>
      <div class="oasis-login-prompt">${config.promptText || HT('oasisLoginDefaultPrompt')}</div>
      <div class="oasis-login-field">
        <label>${HT('yourName')}</label>
        <input type="text" id="oasis-login-username" autocomplete="off">
      </div>
      <div class="oasis-login-field">
        <label>${HT('dateOfBirth')}</label>
        <input type="text" id="oasis-login-birthday" placeholder="MM/DD/YYYY" autocomplete="off">
      </div>
      <div class="oasis-login-systemnote">${HT('oasisSystemNote')}</div>
      <div class="oasis-login-error" id="oasis-login-error"></div>
      <div class="oasis-login-btn" id="oasis-login-submit">${HT('logIn')}</div>
    </div>
  `;

  // identities: [{ validUsername, validBirthday, onMatch }]，按顺序匹配第一个符合的身份
  // 向后兼容：仍支持旧的单身份写法 validUsername/validBirthday/onSuccess
  const identities = config.identities || [{
    validUsername: config.validUsername,
    validBirthday: config.validBirthday,
    onMatch: () => goToNode(config.onSuccess)
  }];

  function attemptLogin() {
    const usernameInput = document.getElementById('oasis-login-username').value.trim().toLowerCase();
    const birthdayInput = document.getElementById('oasis-login-birthday').value.trim();
    const errorEl = document.getElementById('oasis-login-error');

    if (!usernameInput || !birthdayInput) {
      errorEl.textContent = HT('fillBothFields');
      return;
    }
    const matched = identities.find(idn => {
      const validUsername = (typeof idn.validUsername === 'function' ? idn.validUsername() : idn.validUsername || '').trim().toLowerCase();
      return usernameInput === validUsername && birthdayMatches(birthdayInput, idn.validBirthday);
    });
    if (matched) {
      errorEl.textContent = '';
      matched.onMatch();
    } else {
      errorEl.textContent = HT('errorTryAgain');
    }
  }

  document.getElementById('oasis-login-submit').addEventListener('click', attemptLogin);
  document.getElementById('oasis-login-birthday').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });
}

/* ---------------- 登录Debra账号时的多阶段验证弹层 ---------------- */
function runDebraVerificationModal(onComplete) {
  const modal = document.createElement('div');
  modal.className = 'oasis-stress-modal';
  modal.innerHTML = `
    <div class="oasis-stress-modal-box verify-box">
      <div class="verify-lines" id="verify-lines"></div>
      <div class="verify-spinner hide" id="verify-spinner"></div>
      <div class="verify-final hide" id="verify-final">${HT('accessApproved')}<span>${HT('authorizedByDebra')}</span></div>
    </div>
  `;
  document.body.appendChild(modal);

  const lines = [
    HT('verifyLine1'),
    HT('verifyLine2'),
    HT('verifyLine3'),
    HT('verifyLine4')
  ];
  const linesEl = document.getElementById('verify-lines');
  let i = 0;
  function showNextLine() {
    if (i < lines.length) {
      const p = document.createElement('div');
      p.className = 'verify-line';
      p.textContent = lines[i];
      linesEl.appendChild(p);
      i++;
      setTimeout(showNextLine, 1100);
    } else {
      document.getElementById('verify-spinner').classList.remove('hide');
      setTimeout(() => {
        document.getElementById('verify-spinner').classList.add('hide');
        document.getElementById('verify-final').classList.remove('hide');
        setTimeout(() => {
          modal.remove();
          onComplete();
        }, 1400);
      }, 3000);
    }
  }
  showNextLine();
}

/* ---------------- OASIS app：主面板 ----------------
   config: {
     backTarget,
     status: { sync, uplinkDevice, nextCalibration },
     stabilityIndex: 0-100,
     interventionLog: [{time, text}],
     deepLogs: [{time, flagged(bool), warningTip(可选,只有flagged的条目需要)}],
     stressLevel: 文案如 'High (Class A++)',
     stressTest: { question, answer(number), correctFeedback, wrongFeedback }
   }
   设计目的：数据驱动，以后查看debs等其他人的oasis数据时，传入不同config即可复用整套UI，
   不需要重新写面板结构。
------------------------------------------------------------- */
function ringSvg(value) {
  // value: 0-100，简单的环形进度图，用stroke-dasharray实现
  const r = 36, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return `
    <svg class="oasis-ring" viewBox="0 0 84 84">
      <circle cx="42" cy="42" r="${r}" fill="none" stroke="var(--ios-gray-bg)" stroke-width="7"/>
      <circle cx="42" cy="42" r="${r}" fill="none" stroke="#34C759" stroke-width="7"
        stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round"
        transform="rotate(-90 42 42)"/>
    </svg>`;
}
function waveSvg() {
  // 简单的折线波形图，模拟神经频率数据；中间穿插一段超出45Hz/低于35Hz的红色异常区间（"被自动修正"）
  const points = [40, 42, 38, 41, 39, 47, 33, 40, 42, 39, 41, 38, 40];
  const w = 280, h = 70, step = w / (points.length - 1);
  const scaleY = v => h - ((v - 25) / 30) * h; // 25-55Hz映射到画布高度
  const pathPoints = points.map((v, i) => `${i * step},${scaleY(v)}`).join(' ');
  const normalLineY1 = scaleY(45), normalLineY2 = scaleY(35);
  return `
    <svg class="oasis-wave-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <line x1="0" y1="${normalLineY1}" x2="${w}" y2="${normalLineY1}" stroke="rgba(255,59,48,0.25)" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="0" y1="${normalLineY2}" x2="${w}" y2="${normalLineY2}" stroke="rgba(255,59,48,0.25)" stroke-width="1" stroke-dasharray="3,3"/>
      <polyline points="${pathPoints}" fill="none" stroke="#34C759" stroke-width="2"/>
    </svg>`;
}

function renderOasisDashboard(config) {
  document.getElementById('document-back-btn').setAttribute('data-goto', config.backTarget);
  const wrap = document.getElementById('document-wrap');
  wrap.scrollTop = 0;

  const interventionLogHtml = config.interventionLog.map(l => `
    <div class="oasis-log-item"><span class="oasis-log-time">[${l.time}]</span><span class="oasis-log-text">${l.text}</span></div>
  `).join('');

  const deepLogsHtml = config.deepLogs.map(l => `
    <div class="oasis-deeplog-row ${l.flagged ? 'flagged' : ''} ${l.flagged && config.flaggedRowGoto ? 'clickable' : ''}" ${l.flagged && config.flaggedRowGoto ? `data-goto-log="${config.flaggedRowGoto}"` : ''}>
      <span>${l.time}</span>
      ${l.flagged
        ? (config.flaggedRowGoto
            ? `<span class="oasis-deeplog-fail-label">${l.statusLabel || HT('failedLabel')}</span>`
            : `<span class="oasis-deeplog-warn-icon">⚠<span class="tip">${l.warningTip}</span></span>`)
        : '<span></span>'}
    </div>
  `).join('');

  const stressSectionHtml = config.hideStressTest ? '' : `
    <div class="oasis-section">
      <div class="oasis-section-title">${HT('stressResilienceTest')}</div>
      <div class="oasis-stress-row">
        <span style="font-size:12.5px; color:var(--ios-text-secondary);">${HT('currentResilience')}</span>
        <span class="oasis-stress-badge">${config.stressLevel}</span>
      </div>
      <div class="oasis-stress-btn" id="oasis-stress-btn">${HT('initiateStressTest')}</div>
    </div>
  `;

  wrap.innerHTML = `
    <div class="oasis-dash-header">
      <div class="oasis-dash-logo">OASIS</div>
      <div class="oasis-status-row"><span><span class="oasis-status-dot"></span>${HT('statusLabel')}</span><span class="v active">${HT('activeSyncPrefix')}${config.status.sync}</span></div>
      <div class="oasis-status-row"><span>${HT('nextCalibration')}</span><span class="v">${config.status.nextCalibration}</span></div>
    </div>

    ${config.viewingName ? `<div class="oasis-viewing-banner">${HT('viewingPrefix')}${config.viewingName}</div>` : ''}

    <div class="oasis-section">
      <div class="oasis-section-title">${HT('emotionalStabilityIndex')}</div>
      <div class="oasis-ring-wrap">
        ${ringSvg(config.stabilityIndex)}
        <div><div class="oasis-ring-num">${config.stabilityIndex}/100</div><div class="oasis-ring-label">${config.ringLabel || HT('currentlyStable')}</div></div>
      </div>
    </div>

    <div class="oasis-section">
      <div class="oasis-section-title">${HT('automatedInterventionLog')}</div>
      ${interventionLogHtml}
    </div>

    <div class="oasis-section">
      <div class="oasis-section-title">${HT('neuroFreqPlotter')}</div>
      <div class="oasis-wave-box">${waveSvg()}</div>
      <div class="oasis-deeplogs-toggle" id="oasis-deeplogs-toggle">${HT('viewDetailedData')}</div>
      <div class="oasis-deeplogs-list hide" id="oasis-deeplogs-list">${deepLogsHtml}</div>
    </div>

    ${stressSectionHtml}

    <div class="oasis-section oasis-footer-section">
      ${config.hideTerms ? '' : `<div class="oasis-terms-link" id="oasis-terms-link">${HT('ourTerms')}</div>`}
      <div class="oasis-signout-btn" id="oasis-signout-btn">${HT('signOut')}</div>
    </div>
  `;

  if (!config.hideTerms) {
    document.getElementById('oasis-terms-link').addEventListener('click', () => goToNode('pil_agreement'));
  }
  document.getElementById('oasis-signout-btn').addEventListener('click', () => {
    setState({ oasisSession: 'none' });
    goToNode('oasis_app_login');
  });

  document.getElementById('oasis-deeplogs-toggle').addEventListener('click', () => {
    const list = document.getElementById('oasis-deeplogs-list');
    const isHidden = list.classList.contains('hide');
    list.classList.toggle('hide');
    document.getElementById('oasis-deeplogs-toggle').textContent = isHidden ? HT('hideDetailedData') : HT('viewDetailedData');
  });

  wrap.querySelectorAll('[data-goto-log]').forEach(el => {
    el.addEventListener('click', () => goToNode(el.getAttribute('data-goto-log')));
  });

  if (!config.hideStressTest) {
    document.getElementById('oasis-stress-btn').addEventListener('click', () => runStressTest(config.stressTest));
  }
}

/* 压力测试弹层交互：营造"努力思考时被强行注入平静感"的不安体验 */
function runStressTest(test) {
  const modal = document.createElement('div');
  modal.className = 'oasis-stress-modal';
  modal.innerHTML = `
    <div class="oasis-stress-modal-box">
      <div class="oasis-stress-hr" id="stress-hr-text">${HT('vagalMonitoring')}</div>
      <div class="oasis-stress-question">${test.question}</div>
      <div class="oasis-stress-answer-row">
        <input type="text" id="stress-answer-input" autocomplete="off">
        <div class="oasis-stress-submit" id="stress-submit-btn">${HT('submitBtn')}</div>
      </div>
      <div class="oasis-stress-status" id="stress-status-text"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const statusText = document.getElementById('stress-status-text');

  function closeModal() {
    modal.remove();
  }

  document.getElementById('stress-submit-btn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('stress-answer-input').value, 10);
    statusText.textContent = (val === test.answer) ? (test.correctFeedback || HT('correctFeedback')) : (test.wrongFeedback || HT('wrongFeedback'));
    setTimeout(closeModal, 1800);
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}


// sections 由调用方直接传入拼好的HTML字符串数组（因为每个官网区块结构差异较大，不强行抽象成统一数据格式）
function renderWebsite(config) {
  document.getElementById('website-back-btn').setAttribute('data-goto', config.backTarget);
  const wrap = document.getElementById('website-wrap');
  wrap.scrollTop = 0; // 每次进入页面从顶部开始，不残留上次滚动位置
  wrap.innerHTML = config.sections.join('');
}
// config: { label, title, text, showCheckpointReturn: 'A'|'B'|'C'|null, ending: id }
function renderEnding(config) {
  // 记录这个结局对应的checkpoint id，这样玩家从结局页跳到ending_collection之后，
  // 收藏页上也能提供同一个"返回上一个抉择点"的按钮，而不仅仅是结局页本身有这个功能
  setState({ lastEndingCheckpointReturn: config.showCheckpointReturn || null });
  const wrap = document.getElementById('ending-wrap');
  wrap.innerHTML = `
    <div class="ending-label">${config.label}</div>
    <div class="ending-title">${config.title}</div>
    <div class="ending-text">${config.text}</div>
    <div class="ending-btns">
      ${config.showCheckpointReturn ? `<div class="ending-btn" id="ending-cp-return">${HT('returnToPreviousChoice')}</div>` : ''}
      <div class="ending-btn" id="ending-collection">${HT('viewEndingCollection')}</div>
      <div class="ending-btn primary" id="ending-restart">${HT('restartGame')}</div>
    </div>
  `;
  if (config.showCheckpointReturn) {
    document.getElementById('ending-cp-return').addEventListener('click', () => {
      const target = restoreCheckpoint(config.showCheckpointReturn);
      if (target) goToNode(target);
    });
  }
  document.getElementById('ending-collection').addEventListener('click', () => goToNode('ending_collection'));
  document.getElementById('ending-restart').addEventListener('click', () => {
    resetGameState();
    goToNode('login');
  });
}

/* ---------------- 日历 app ----------------
   config: {
     backTarget,
     monthLabel: 'November 2032',
     year, month(0-indexed, 如11月=10),
     events: { 日期数字: [{type:'work'|'social'|'exam', label}] },
     birthdays: [{name, month(1-12), day}]
   }
   "今天"读取 state.currentGameDate（由renderDesktop每次渲染桌面时自动记录），
   用于高亮当前日期格子 + 计算生日倒计时基准。
------------------------------------------------------------- */
function parseGameDateToYMD(dateStr) {
  // 解析形如 'Nov 8, 2032' 的字符串为 {y, m(1-12), d}
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = dateStr.match(/([A-Za-z]+)\s+(\d+),\s*(\d+)/);
  if (!m) return null;
  const monthIdx = months.indexOf(m[1].slice(0, 3));
  if (monthIdx === -1) return null;
  return { y: parseInt(m[3], 10), m: monthIdx + 1, d: parseInt(m[2], 10) };
}
function daysUntilNextBirthday(today, bday) {
  // today: {y,m,d}；bday: {month, day}
  // 计算从today到下一次出现 bday.month/bday.day 这个日期还有多少天（今天正好是生日则返回0）
  const todayDate = new Date(today.y, today.m - 1, today.d);
  let nextBdayYear = today.y;
  let candidate = new Date(nextBdayYear, bday.month - 1, bday.day);
  if (candidate < todayDate) {
    nextBdayYear += 1;
    candidate = new Date(nextBdayYear, bday.month - 1, bday.day);
  }
  const diffMs = candidate - todayDate;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
function ageAtNextBirthday(today, bday) {
  const todayDate = new Date(today.y, today.m - 1, today.d);
  let nextBdayYear = today.y;
  let candidate = new Date(nextBdayYear, bday.month - 1, bday.day);
  if (candidate < todayDate) nextBdayYear += 1;
  return nextBdayYear - bday.birthYear;
}

function renderCalendar(config) {
  document.getElementById('calendar-back-btn').setAttribute('data-goto', config.backTarget);
  const wrap = document.getElementById('calendar-wrap');
  wrap.scrollTop = 0;

  const state = getState();
  const today = parseGameDateToYMD(state.currentGameDate) || { y: config.year, m: config.month + 1, d: 1 };

  // 生成月历网格
  const firstWeekday = new Date(config.year, config.month, 1).getDay(); // 0=周日
  const daysInMonth = new Date(config.year, config.month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null); // 月初前的空格
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => today.y === config.year && today.m === config.month + 1 && today.d === d;

  const cellsHtml = cells.map(d => {
    if (d === null) return `<div class="cal-cell empty"></div>`;
    const dayEvents = (config.events && config.events[d]) || [];
    const dotsHtml = dayEvents.map(e => `<span class="cal-tag-dot ${e.type}"></span>`).join('');
    return `
      <div class="cal-cell ${isToday(d) ? 'today' : ''}">
        <div class="cal-day-num">${d}</div>
        <div class="cal-tag-dots">${dotsHtml}</div>
      </div>`;
  }).join('');

  const weekdayLabels = HT('weekdayLabels');

  const bdayListHtml = config.birthdays.map(b => {
    const days = daysUntilNextBirthday(today, b);
    const age = ageAtNextBirthday(today, b);
    const dateLabel = new Date(2000, b.month - 1, b.day).toLocaleDateString(HT('bdayLocale'), { month: 'long', day: 'numeric' });
    return `
      <div class="cal-bday-card">
        <div>
          <div class="cal-bday-name">${b.name}</div>
          <div class="cal-bday-date">${dateLabel}</div>
        </div>
        <div class="cal-bday-countdown">
          <div class="cal-bday-days ${days <= 7 ? 'soon' : ''}">${days === 0 ? HT('today') : days}</div>
          ${days === 0 ? '' : `<div class="cal-bday-unit">${HT('daysLeft')}</div>`}
          <div class="cal-bday-age">${HT('turningAge')(age)}</div>
        </div>
      </div>`;
  }).join('');

  wrap.innerHTML = `
    <div class="cal-header">${config.monthLabel}</div>
    <div class="cal-weekday-row">${weekdayLabels.map(w => `<span>${w}</span>`).join('')}</div>
    <div class="cal-grid">${cellsHtml}</div>
    <div class="cal-legend">
      <div class="cal-legend-item"><span class="cal-tag-dot work"></span>${HT('legendWork')}</div>
      <div class="cal-legend-item"><span class="cal-tag-dot social"></span>${HT('legendFriends')}</div>
      <div class="cal-legend-item"><span class="cal-tag-dot exam"></span>${HT('legendExam')}</div>
    </div>
    <div class="cal-section-title">${HT('upcomingBirthdays')}</div>
    <div class="cal-bday-list">${bdayListHtml}</div>
  `;
}
