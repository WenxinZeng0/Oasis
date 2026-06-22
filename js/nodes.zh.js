/* ============================================================
   nodes.js — 全部节点数据
   每个节点：{ container, links: [跳转目标的合集，用于断链检测], render() }
   container 必须是 index.html 里14个通用容器之一的 id。
   links 数组里列出这个节点"理论上可能跳转到"的所有目标节点id，
   即使是在用户选择/点击后才决定跳转的，也要列全，断链检测才准确。
   ============================================================ */

const NODES_ZH = {};

/* ============================================================
   组0：序章 1-8（已有节点，从旧原型迁移到新架构）
   ============================================================ */

NODES_ZH['login'] = {
  container: 'screen-login',
  links: ['desktop_1'],
  render: function () {
    const usernameInput = document.getElementById('username-input');
    const loginError = document.getElementById('login-error');
    const loginBtn = document.getElementById('login-btn');

    // 用克隆替换清空旧监听，避免反复进入登录页时事件叠加
    const newBtn = loginBtn.cloneNode(true);
    loginBtn.parentNode.replaceChild(newBtn, loginBtn);
    const newInput = usernameInput.cloneNode(true);
    usernameInput.parentNode.replaceChild(newInput, usernameInput);

    function attemptLogin() {
      const val = newInput.value.trim();
      if (!val) {
        loginError.classList.add('show');
        newInput.focus();
        return;
      }
      setState({ playerName: val });
      goToNode('desktop_1');
    }

    newBtn.addEventListener('click', attemptLogin);
    newInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') attemptLogin(); });
    newInput.addEventListener('input', () => loginError.classList.remove('show'));
  }
};

NODES_ZH['desktop_1'] = {
  container: 'screen-desktop',
  links: ['mail_vocalist', 'friends_feed', 'oasis_app_login', 'calendar_app'],
  render: function () {
    renderChapter1Desktop('9:41', 'Nov 8, 2032');
  }
};

NODES_ZH['mail_vocalist'] = {
  container: 'screen-mail',
  links: ['desktop_2', 'oasis_website'],
  render: function () {
    setState({ mailNotifSeen: true });
    const state = getState();
    const mailList = [
      {
        id: 'vocalist', from: 'VOCALIST', subj: '你的订单已发货！',
        snippet: '内含追踪信息……', unread: true,
        detailRender: () => `
          <div class="mail-detail-subject">你的订单已发货！</div>
          <div class="mail-detail-meta">发件人：<b>VOCALIST</b> · 收件人：<b>${state.playerName || '你'}</b><br>下单时间：<b>2032年11月5日</b></div>
          <div class="order-card">
            <div class="brand">VOCALIST</div>
            <div class="order-row"><span>商品</span><b>VOCALIST 音箱套装 — 胡桃木版</b></div>
            <div class="order-row"><span>下单时间</span><b>2032年11月5日 21:04</b></div>
            <div class="order-row"><span>预计送达</span><b>2032年11月9日</b></div>
            <div class="order-row"><span>收货地址</span><b>校内宿舍楼B座504A室</b></div>
            <span class="status-pill">已发货</span>
          </div>`
      },
      {
        id: 'oasis-sub', from: 'OASIS', subj: '你的订阅将于下月续费',
        snippet: '随时管理你的套餐……', unread: true,
        detailRender: () => `<div class="mail-detail-subject">你的订阅将于下月续费</div>
          <div class="mail-detail-meta">发件人：<b>OASIS</b> · 收件人：<b>${state.playerName || '你'}</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">你的 OASIS 订阅将于下月自动续费。你可以随时管理你的套餐、账单和偏好设置。</div>
          <div style="margin-top:14px; font-size:13.5px;">
            <span data-goto="oasis_website" style="color:var(--ios-blue); text-decoration:underline; cursor:pointer;">访问 OASIS.com →</span>
          </div>`
      },
      {
        id: 'harmony1', from: 'Organic Harmony', subj: '我们不相信所谓的"神经基线"',
        snippet: '你的焦虑，你的崩溃，甚至你的一切感受……', unread: true,
        detailRender: () => `<div class="mail-detail-subject">我们不相信所谓的"神经基线"</div>
          <div class="mail-detail-meta">发件人：<b>Organic Harmony</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.7;">
            <p style="margin:0 0 12px;">在 Organic Harmony，我们不相信所谓的"神经基线"。你的焦虑，你的崩溃，甚至你独自在深夜里感受到的一切——那都是你灵魂的一部分。我们不需要你的数据。我们需要的是<b>重新连接</b>。</p>
            <p style="margin:0 0 12px;">我们的离线疗愈完全脱离一切数字网络：</p>
            <p style="margin:0 0 4px;"><b>无数字疗愈中心</b> —— 我们的基地深藏在偏远山区，没有任何WiFi或移动信号，将你与一切电子脉冲隔绝开。</p>
            <p style="margin:0 0 4px;"><b>原生认知修复</b> —— 通过古法冥想、植物源神经递质和团体呼吸法，帮助你彻底清除OASIS留在你体内的"数字残渣"。</p>
            <p style="margin:0 0 12px;"><b>找回真实的自己</b> —— 不再需要技术干预，不再需要电流补偿。只有你和你与自然之间最原始的联系。</p>
            <p style="margin:0 0 12px;">加入我们，彻底斩断OASIS的控制链条。这或许是你夺回自己人生的唯一机会。</p>
          </div>
          <div style="margin-top:6px; display:flex; flex-direction:column; gap:10px;">
            <div class="doc-sign-btn" style="margin:0;" data-toast="目前暂无法预约。">立即预约：回归你的自然身体</div>
            <div style="text-align:center; font-size:12px; color:var(--ios-text-secondary); text-decoration:underline; cursor:pointer;" data-toast="文章暂时无法查看。">Harmony：为什么我们才是终结OASIS的唯一真相</div>
          </div>`
      },
      {
        id: 'campus', from: 'Campus Housing', subj: '提醒：租约续签截止日期',
        snippet: '请查看你的住房合同……', unread: false,
        detailRender: () => `<div class="mail-detail-subject">提醒：租约续签截止日期</div>
          <div class="mail-detail-meta">发件人：<b>Campus Housing</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">请在截止日期前查看你的住房合同。（暂无更多详情）</div>`
      },
      {
        id: 'bookstore', from: 'Campus Bookstore', subj: '本周全部教材八折优惠',
        snippet: '期末前赶紧囤货……', unread: false,
        detailRender: () => `<div class="mail-detail-subject">本周全部教材八折优惠</div>
          <div class="mail-detail-meta">发件人：<b>Campus Bookstore</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">期末前赶紧囤货吧。（暂无更多详情）</div>`
      },
      {
        id: 'club', from: 'Photography Club', subj: '本周聚会改到周四',
        snippet: '老地方见……', unread: false,
        detailRender: () => `<div class="mail-detail-subject">本周聚会改到周四</div>
          <div class="mail-detail-meta">发件人：<b>Photography Club</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">老地方见。（暂无更多详情）</div>`
      },
    ];
    renderMailApp(mailList, 'vocalist', 'desktop_2');
  }
};

NODES_ZH['desktop_2'] = {
  container: 'screen-desktop',
  links: ['friends_feed', 'mail_vocalist', 'oasis_app_login', 'calendar_app'],
  render: function () {
    renderChapter1Desktop('9:43', 'Nov 8, 2032');
  }
};

NODES_ZH['friends_feed'] = {
  container: 'screen-social-feed',
  links: ['shawn_story', 'desktop_2', 'debs_profile', 'adrian_story', 'adrian_profile'],
  render: function () {
    const scrollWrap = document.getElementById('friends-scroll-wrap');
    if (scrollWrap) scrollWrap.scrollTop = 0;
    setState({ friendsNotifConsumed: true });
    const state = getState();
    const adrianUnlocked = state.chapter2Stage !== 'ruth_pending'; // ruth聊天提到adrian吵架之后才解锁他的story
    const isCh4 = state.amberSafetyChatDone; // 第四章节：story行的顺序/阵容要和第一章节明显不同

    const isCh2 = state.priyaChatDone && !isCh4; // 第一章节结束(priya聊天完)之后、第四章节之前 = 第二章节

    let storiesData;
    if (isCh4) {
      // 第四章节专属顺序和阵容：debs通过下方feed post进入，不在story行里
      // 一旦看过debra的主页之后，adrian的story也关闭，只剩debra可进
      storiesData = [
        { id: 'priya', goto: null },
        { id: 'devon', goto: null },
        { id: 'adrian', goto: null },
        { id: 'mia', goto: null },
      ];
    } else if (isCh2) {
      // 第二章节：不需要shawn的任何信息/story；debs只露个头像（装饰性，无实际story内容），
      // 这里的story行显示名用她的用户名debraluvlulu，而不是角色表里的"Debs"
      const decorativeFriendIds = ['mia', 'jordan', 'priya', 'devon'];
      storiesData = [
        ...(adrianUnlocked ? [{ id: 'adrian', goto: 'adrian_story' }] : []),
        { id: 'debs', goto: null, name: 'debraluvlulu' },
        ...decorativeFriendIds.map(id => ({ id, goto: null }))
      ];
    } else {
      const decorativeFriendIds = ['mia', 'jordan', 'priya', 'devon'];
      storiesData = [
        { id: 'shawn', goto: 'shawn_story' },
        ...(adrianUnlocked ? [{ id: 'adrian', goto: 'adrian_story' }] : []),
        ...decorativeFriendIds.map(id => ({ id, goto: null }))
      ];
    }

    document.getElementById('social-back-btn').setAttribute('data-goto', state.lastDesktopNode || 'desktop_2');

    const row = document.getElementById('stories-row');
    row.innerHTML = storiesData.map(s => {
      const c = getCharacter(s.id);
      return `
      <div class="story-avatar-wrap" data-storyid="${s.id}">
        <div class="story-ring ${s.goto ? '' : 'seen'}"><div class="story-avatar">${imgOrFallback(c.img, c.fallback, '50%')}</div></div>
        <div class="story-name">${s.name || c.name}</div>
      </div>
    `;
    }).join('');
    row.querySelectorAll('[data-storyid]').forEach(el => {
      el.addEventListener('click', () => {
        const s = storiesData.find(x => x.id === el.getAttribute('data-storyid'));
        if (s.goto) goToNode(s.goto);
        else showToast('这位好友没有新动态。');
      });
    });

    const feed = document.getElementById('friends-feed');
    let fakePosts;
    if (isCh4) {
      fakePosts = [
        { id: 'debs', postName: 'debraluvlulu', cap: "今天在 @Pat-studio 做了个杯子，体验真的很棒！ ", goto: 'debs_profile', img: 'posts/feed_debs_ch4.webp', gradient: 'linear-gradient(135deg,#d8b78a,#a87c52)' },
        ...(adrianUnlocked ? [{ id: 'adrian', cap: "出门走走总是好的", goto: null, img: 'posts/feed_adrian_ch4.webp', gradient: 'linear-gradient(135deg,#9aa7b8,#5c6878)' }] : []),
        { id: 'mia', cap: '下雨天，正适合看书', goto: null, img: 'posts/feed_mia_ch4.webp', gradient: 'linear-gradient(135deg,#9fd4d4,#4f8f8f)' },
        { id: 'priya', cap: '小组作业终于交了 🙏', goto: null, img: 'posts/feed_priya_ch4.webp', gradient: 'linear-gradient(135deg,#d9a8e8,#8b4fae)' },
        { id: 'devon', cap: '新耳机到了 音乐继续', goto: null, img: 'posts/feed_devon_ch4.webp', gradient: 'linear-gradient(135deg,#f0c674,#c98a2c)' },
      ];
    } else if (isCh2) {
      fakePosts = [
        ...(adrianUnlocked ? [{ id: 'adrian', cap: "蓝色才是最好看的颜色", goto: 'adrian_profile', img: 'posts/feed_adrian_ch2.webp', gradient: 'linear-gradient(180deg,#2a2d3a,#1a1c24)' }] : []),
        { id: 'mia', cap: '和我家姑娘 @queeeen02 在一起总是开心', goto: null, img: 'posts/feed_mia_ch2.webp', gradient: 'linear-gradient(135deg,#7ec8e3,#3a6ea5)' },
        { id: 'jordan', cap: "爱了爱了", goto: null, img: 'posts/feed_jordan_ch2.webp', gradient: 'linear-gradient(135deg,#9fd49a,#3f8f5c)' },
        { id: 'priya', cap: '深夜跑步', goto: null, img: 'posts/feed_priya_ch2.webp', gradient: 'linear-gradient(135deg,#d9a8e8,#8b4fae)' },
        { id: 'devon', cap: '完全失控', goto: null, img: 'posts/feed_devon_ch2.webp', gradient: 'linear-gradient(135deg,#f0c674,#c98a2c)' },
      ];
    } else {
      fakePosts = [
        { id: 'debs', postName: 'debraluvlulu', cap: "和姐妹们一起 @minikait", goto: 'debs_profile', img: 'posts/feed_debs_lulu.webp', gradient: 'linear-gradient(135deg,#8FA3B3,#4A5D6E)' },
        { id: 'mia', cap: '终于补了个好觉 😴', goto: null, img: 'posts/feed_mia_sleep.webp', gradient: 'linear-gradient(135deg,#7ec8e3,#3a6ea5)' },
        { id: 'jordan', cap: "期中考试要把我逼疯了哈哈", goto: null, img: 'posts/feed_jordan_midterms.webp', gradient: 'linear-gradient(135deg,#9fd49a,#3f8f5c)' },
        { id: 'priya', cap: '不知道我当时在看啥哈哈哈', goto: null, img: 'posts/feed_priya_coffee.webp', gradient: 'linear-gradient(135deg,#d9a8e8,#8b4fae)' },
      ];
    }
    feed.innerHTML = fakePosts.map(p => {
      const c = getCharacter(p.id);
      const displayName = p.postName || c.name;
      return `
      <div class="post" data-post="${p.id}">
        <div class="post-head"><div class="post-avatar">${imgOrFallback(c.img, c.fallback, '50%')}</div><div class="post-name">${displayName}</div></div>
        <div class="post-img">${imgOrFallback(p.img, p.gradient, '12px')}</div>
        <div class="post-caption"><b>${displayName}</b>${p.cap}</div>
      </div>
    `;
    }).join('');
    feed.querySelectorAll('.post').forEach(el => {
      const id = el.getAttribute('data-post');
      const p = fakePosts.find(x => x.id === id);
      el.addEventListener('click', () => {
        if (p.goto) goToNode(p.goto);
        else showToast('只是一条普通动态——没有别的了。');
      });
    });
  }
};

NODES_ZH['shawn_story'] = {
  container: 'screen-story',
  links: ['shawn_profile', 'friends_feed'],
  render: function () {
    renderStoryPlayer({
      characterId: 'shawn',
      slides: [
        { sceneClass: 'scene-vacation', icon: '🏖️', caption: '', img: 'story/shawn_1_vacation.webp' },
        { sceneClass: 'scene-car', icon: '🚗', caption: '', img: 'story/shawn_2_car.webp' },
        { sceneClass: 'scene-bar', icon: '🍺', caption: '', img: 'story/shawn_3_bar.webp' },
        { sceneClass: 'scene-keys', icon: '🔑', caption: '', img: 'story/shawn_4_keys.webp' },
      ],
      onComplete: 'shawn_profile',
      profileTarget: 'shawn_profile',
      closeTarget: 'friends_feed'
    });
  }
};

NODES_ZH['shawn_profile'] = {
  container: 'screen-profile',
  links: ['shawn_chat', 'friends_feed'],
  render: function () {
    const character = getCharacter('shawn');
    renderProfileFeed({
      avatarImg: character.img,
      avatarGradient: character.fallback,
      name: character.name,
      stats: [{ n: 214, l: '帖子' }, { n: '1.2k', l: '好友' }, { n: 980, l: '赞' }],
      bio: '保持好奇心',
      messageTarget: 'shawn_chat',
      backTarget: 'friends_feed',
      posts: [
        {
          dateLabel: '11月7日', caption: '在健身房 💪', likes: 134,
          img: 'posts/shawn_p1_gym.webp', gradient: 'linear-gradient(135deg,#FF9F6B,#FF3B5C)',
          comments: [{ name: 'jordan_t', text: "冲冲冲" }, { name: 'mia.l', text: '炫耀什么呢 🙄' }]
        },
        {
          dateLabel: '11月3日', caption: '公路旅行简直太爽了！！！', likes: 89,
          img: 'posts/shawn_p2_roadtrip.webp', gradient: 'linear-gradient(135deg,#7ec8e3,#3a6ea5)',
          comments: [{ name: 'priya92', text: '去哪儿啊??' }]
        },
        {
          dateLabel: '10月29日', caption: '放松一下', likes: 201,
          img: 'posts/shawn_p3_vocalist.webp', gradient: 'linear-gradient(160deg,#3a3020,#8a7340)',
          comments: [{ name: 'Ketchup15oz', text: '咋样啊' }]
        },
        {
          dateLabel: '10月24日', caption: '和 @Nikki_Ling 在一起总是很开心', likes: 76,
          img: 'posts/shawn_p4_brunch.webp', gradient: 'linear-gradient(135deg,#ffe9a8,#e8a87c)',
          comments: [{ name: 'Nikki_Ling', text: '咱们应该再约一次！' }]
        },
        {
          dateLabel: '10月20日', caption: '说真的得穿正装了', likes: 112,
          img: 'posts/shawn_p5_semester.webp', gradient: 'linear-gradient(135deg,#9fd49a,#3f8f5c)',
          comments: [{ name: 'Mark_D42', text: '哇真帅！' }]
        }
      ]
    });
  }
};

NODES_ZH['shawn_chat'] = {
  container: 'screen-chat',
  links: ['shawn_profile'],
  render: function () {
    renderChatApp({
      headerName: 'Shawn921',
      characterId: 'shawn',
      backTarget: 'shawn_profile',
      script: [
        { from: 'me', text: "嘿shawn！好久没联系了哈哈" },
        { from: 'them', text: "天哪嗨！！你怎么样" },
        { from: 'me', text: "我挺好的——看到你的动态了，看起来你现在过得挺滋润啊 👀" },
        { from: 'them', text: "哈哈我猜最近确实过得不错" },
        { from: 'me', text: "那辆车真不错！！" },
        { from: 'them', text: "谢谢！！其实就是一时冲动买的，不过嘛" },
        { from: 'me', text: "哟得好好享受那家伙" },
        { from: 'me', text: "看来这份工作待遇不错嘛" },
        { from: 'them', text: "哈哈哈但也是真的很忙" },
        { from: 'them', text: "那个oasis真的帮我度过了好几次精疲力竭的时候" },
        { from: 'them', text: "真希望高中的时候就有这玩意儿，那样我就不会因为考试那么焦虑了" },
      ]
    });
  }
};

/* ============================================================
   OASIS 官网（从 vocalist 邮件页的 oasis-sub 邮件点击进入）
   ============================================================ */

NODES_ZH['oasis_website'] = {
  container: 'screen-website',
  links: ['mail_vocalist'],
  render: function () {
    renderWebsite({
      backTarget: 'mail_vocalist',
      sections: [
        // 1. Hero
        `<div class="ws-hero ws-hero-v2">
          <div class="ws-capsule-visual"><div class="ws-capsule-glow"></div><div class="ws-capsule-pill"></div></div>
          <div class="ws-headline ws-headline-v2">Oasis.</div>
          <div class="ws-subheadline ws-subheadline-v2">为你的心灵打造一片庇护所，扎根于你的身体之内。</div>
          <div class="ws-section-copy ws-hero-copy">还在厌倦每天吞一大把专注力补剂和微量营养素胶囊的无尽仪式吗？</div>
          <div class="ws-section-copy ws-hero-copy ws-hero-copy-strong">Oasis。一粒胶囊，解决你整套情绪生态系统。</div>
          <div class="ws-cta-row">
            <div class="ws-cta-pill" data-toast="你的预订已记录。">预订你的新一代心灵守护者</div>
          </div>
        </div>`,

        // 2. The Problem
        `<div class="ws-section">
          <div class="ws-section-title">超越化学疲劳。<br>欢迎来到生物科技精准时代。</div>
          <div class="ws-compare">
            <div class="ws-compare-col ws-compare-before">
              <div class="ws-compare-visual ws-compare-visual-before">💊🧪💉🧴</div>
              <div class="ws-compare-caption">之前</div>
            </div>
            <div class="ws-compare-col ws-compare-after">
              <div class="ws-compare-visual ws-compare-visual-after"><div class="ws-mini-capsule"></div></div>
              <div class="ws-compare-caption">之后</div>
            </div>
          </div>
          <div class="ws-section-copy">Oasis是一款专为缓解抑郁、应对焦虑、解锁深度认知专注力而设计的前沿微型医疗机器人。它不是传统的化学药物——它是你全天候的内置情绪建筑师。</div>
        </div>`,

        // 3. How It Works
        `<div class="ws-section">
          <div class="ws-section-title">工作原理</div>
          <div class="ws-section-copy">内置创新科技，重新校准身心。</div>
          <div class="ws-icon-feature-list">
            <div class="ws-icon-feature">
              <div class="ws-icon-feature-icon">⚡</div>
              <div class="ws-icon-feature-title">清洁能源：生物电池</div>
              <div class="ws-icon-feature-sub">无需充电。摄入即激活。</div>
              <div class="ws-icon-feature-desc">一旦进入消化道，Oasis直接利用人体自身葡萄糖作为燃料产生自主电力，为微芯片提供恒定、纯净的能量流。</div>
            </div>
            <div class="ws-icon-feature">
              <div class="ws-icon-feature-icon">👁️</div>
              <div class="ws-icon-feature-title">智能侦探：24/7全天候监测</div>
              <div class="ws-icon-feature-sub">捕捉你最隐秘的低落瞬间。</div>
              <div class="ws-icon-feature-desc">内置的微型生物传感器阵列实时持续追踪压力荷尔蒙水平和肠道菌群波动，在情绪变化浮现之前就将其标记出来。</div>
            </div>
            <div class="ws-icon-feature">
              <div class="ws-icon-feature-icon">🎯</div>
              <div class="ws-icon-feature-title">极致精准：迷走神经刺激</div>
              <div class="ws-icon-feature-sub">秒级干预，直达大脑。</div>
              <div class="ws-icon-feature-desc">一旦检测到压力，胶囊会利用迷走神经刺激（VNS）技术，沿着身体的神经热线发送细微、安全的电脉冲，促使大脑瞬间释放多巴胺和血清素。</div>
            </div>
          </div>
        </div>`,

        // 4. Feature In-Depth
        `<div class="ws-section">
          <div class="ws-section-title">直面压力：<br>Oasis如何成为你智能的"刹车踏板"。</div>
          <div class="ws-section-copy">当截止日期堆积或者一场关键的演讲临近，你的身体会经历一场内部危机：大脑误以为感知到了古老的猛兽出现，瞬间触发警报，向全身泵入"压力荷尔蒙"（皮质醇和肾上腺素）。结果呢？心跳加速、呼吸变浅、肌肉紧绷，以及一波令人窒息的焦虑感。</div>
          <div class="ws-section-copy">在这些关键时刻，Oasis会启动三步减压程序：</div>
          <div class="ws-step-list">
            <div class="ws-step">
              <div class="ws-step-icon">🛑</div>
              <div class="ws-step-title">第一步：启动身体的刹车系统</div>
              <div class="ws-step-desc">Oasis向你的迷走神经——"休息与消化"系统的终极生物指挥官——精准发出一道温和的电脉冲。警报瞬间被解除；你的心率开始放缓，紧绷的肌肉纤维也开始松弛。</div>
            </div>
            <div class="ws-step">
              <div class="ws-step-icon">🤫</div>
              <div class="ws-step-title">第二步：派出"安静使者"</div>
              <div class="ws-step-desc">信号传到大脑后，会立即指挥合成并释放GABA（γ-氨基丁酸）。GABA就像吵闹房间里一位温柔的图书管理员，对那些过度活跃、焦虑的神经元发出统一的"嘘"声，让认知噪音安静下来。</div>
            </div>
            <div class="ws-step">
              <div class="ws-step-icon">⛓️</div>
              <div class="ws-step-title">第三步：切断压力供应链</div>
              <div class="ws-step-desc">神经系统平静下来后，大脑的指挥中心（下丘脑）会向身体发出信号，停止压力荷尔蒙的生成。皮质醇水平迅速下降，那种令人窒息的压迫感也随之消散。</div>
            </div>
          </div>
          <div class="ws-callout">💡 Oasis并不是制造人工的放松感。它只是按下了那个名叫"平静"的生物开关。</div>
        </div>`,

        // 6. Safety & Sustainability
        `<div class="ws-section">
          <div class="ws-section-title">48小时的温柔陪伴。<br>零废弃的优雅离场。</div>
          <div class="ws-section-copy">Oasis尊重人体消化的自然节律。每两天一粒胶囊即可。它的离开方式同样优雅得体：</div>
          <div class="ws-safety-list">
            <div class="ws-safety-item">
              <div class="ws-safety-title">完全生物可降解架构</div>
              <div class="ws-safety-desc">结构外壳和微电路均采用源自人体本身元素（镁、锌、铁）打造的完全可生物吸收材料制成。一旦完成使命，它会安全溶解为有益的微量营养素。</div>
            </div>
            <div class="ws-safety-item">
              <div class="ws-safety-title">生物防粘屏蔽层</div>
              <div class="ws-safety-desc">任何不可吸收的微小元件都被一层超滑、生物惰性的纳米涂层包裹，确保它能安全、轻松、零残留地顺利通过并排出消化系统。</div>
            </div>
          </div>
        </div>`,

        // 7. Call to Action
        `<div class="ws-hero ws-hero-v2 ws-cta-final-section">
          <div class="ws-cta-final-visual"><div class="ws-mini-capsule"></div><div class="ws-mini-patch"></div></div>
          <div class="ws-headline ws-headline-v2">Oasis.</div>
          <div class="ws-subheadline ws-subheadline-v2">把科技交给你的身体。把庇护所留给你的心灵。</div>
          <div class="ws-kit-name">Oasis智能入门套装<br><span>包含15粒双日胶囊 + 1枚智能生物贴片</span></div>
          <div class="ws-cta-row">
            <div class="ws-cta-pill" data-toast="欢迎来到下一代生活方式。">迈入下一代健康生活</div>
          </div>
        </div>`,
      ]
    });
  }
};


/* ============================================================
   组1 第一批（页面9-13对应的技术节点）：
   debs主页 → 桌面(debs消息提醒) → debs聊天
   → 桌面(priya消息提醒) → priya聊天(日常插曲)
   → 时间跳跃过场 → 桌面(崩溃消息通知) → debs紧急聊天 → 自己的oasis数据平台
   ============================================================ */

// 页面9：debs主页 —— 只做查看，不开放主动发起聊天（聊天由后续短信触发）
NODES_ZH['debs_profile'] = {
  container: 'screen-profile',
  links: ['desktop_3', 'desktop_5', 'nova_page', 'pat_studio_page'],
  render: function () {
    const state = getState();
    const character = getCharacter('debs');
    if (state.amberSafetyChatDone) {
      setState({ debsProfileViewedCh4: true });
    }

    const lulu = {
      dateLabel: '3个月前 - 置顶', caption: "Lulu❤️ 爱你，亲亲",
      likes: 312, img: 'posts/debs_pinned_lulu.webp', gradient: 'linear-gradient(135deg,#8FA3B3,#4A5D6E)', comments: []
    };

    const ch1Posts = [
      { dateLabel: '11月6日', caption: '想重新开始写日记', likes: 58, img: 'posts/debs_ch1_p1_journaling.webp', gradient: 'linear-gradient(135deg,#cfd8e3,#9aa7b8)', comments: [{ name: 'mia.l', text: '为你骄傲' }] },
      { dateLabel: '10月31日', caption: '万圣节真是……不容易 🎃', likes: 94, img: 'posts/debs_ch1_p2_halloween.webp', gradient: 'linear-gradient(160deg,#3a1f2a,#8a4a5c)', comments: [{ name: 'jordan_t', text: '这服装天哪' }] },
      { dateLabel: '10月26日', caption: '新蜡烛闻起来像秋天', likes: 47, img: 'posts/debs_ch1_p3_candle.webp', gradient: 'linear-gradient(135deg,#e8a87c,#c97b4a)', comments: [{ name: 'priya92', text: '什么牌子??' }] },
      { dateLabel: '10月21日', caption: '慢悠悠的周日', likes: 63, img: 'posts/debs_ch1_p4_sunday.webp', gradient: 'linear-gradient(135deg,#bcd4e6,#8aa9c2)', comments: [{ name: 'mia.l', text: '同款心情' }] },
    ];

    const ch4Posts = [
      {
        dateLabel: '11月28日', caption: '今天在 @Pat-studio 做了个杯子，体验真的很棒！<br><span class="post-cta-btn">点击查看 pat-studio →</span>', likes: 71,
        img: 'posts/debs_ch4_p1_pottery.webp', gradient: 'linear-gradient(135deg,#d8b78a,#a87c52)', goto: 'pat_studio_page',
        comments: [{ name: 'mia.l', text: '天哪给我看看' }]
      },
      {
        dateLabel: '11月25日', caption: '报名成为NOVA会员了！🎓<br><span class="post-cta-btn">点击查看 NOVA →</span>', likes: 58,
        img: 'posts/debs_ch4_p2_nova.webp', gradient: 'linear-gradient(135deg,#3a3d4a,#1c1d24)', goto: 'nova_page',
        comments: [{ name: 'priya92', text: '欢迎加入NOVA！' }, { name: 'jordan_t', text: '冲就对了 💪' }]
      },
      {
        dateLabel: '11月22日', caption: '迷上了这款新蜡烛 🕯️', likes: 39,
        img: 'posts/debs_ch4_p3_candle.webp', gradient: 'linear-gradient(135deg,#e8a87c,#c97b4a)', toast: '只是她喜欢的一根蜡烛——没有别的了。',
        comments: [{ name: 'mia.l', text: "问：哪里买的？" }, { name: 'debraluvlulu', text: '答：本地的市集，忘了拿名片了' }]
      },
      { dateLabel: '11月18日', caption: '需要一个慢节奏的一天', likes: 39, img: 'posts/debs_ch4_p4_slowday.webp', gradient: 'linear-gradient(135deg,#bcd4e6,#8aa9c2)', comments: [{ name: 'priya92', text: '好好休息' }] },
      { dateLabel: '11月14日', caption: '这周的新歌单', likes: 51, img: 'posts/debs_ch4_p5_playlist.webp', gradient: 'linear-gradient(135deg,#c9a8d8,#8a5ca3)', comments: [{ name: 'mia.l', text: '发我一下' }] },
      { dateLabel: '11月9日', caption: '和朋友们去喝咖啡 ☕', likes: 44, img: 'posts/debs_ch4_p6_coffee.webp', gradient: 'linear-gradient(135deg,#d8c3a5,#a8835a)', comments: [{ name: 'mia.l', text: '想你了' }] },
    ];

    const posts = state.amberSafetyChatDone
      ? [lulu, ...ch4Posts]
      : [lulu, ...ch1Posts];

    renderProfileFeed({
      avatarImg: character.img,
      avatarGradient: character.fallback,
      name: 'debraluvlulu',
      stats: [{ n: 89, l: '帖子' }, { n: 340, l: '好友' }, { n: '1.6k', l: '赞' }],
      bio: '永远是lulu的妈妈 🐾',
      messageTarget: null,
      messageDisabledToast: '现在没什么可发的。',
      backTarget: state.lastDesktopNode || 'desktop_3',
      backLabel: '‹ 桌面',
      posts: posts
    });
  }
};

// 页面10：电脑主屏幕（动态通知：根据进度自动显示debs消息或更早的待处理通知）
NODES_ZH['desktop_3'] = {
  container: 'screen-desktop',
  links: ['debs_chat_1', 'oasis_app_login', 'calendar_app'],
  render: function () {
    renderChapter1Desktop('10:02', 'Nov 8, 2032');
  }
};

// 页面11：与debs聊天（自动播放）
NODES_ZH['debs_chat_1'] = {
  container: 'screen-chat',
  links: ['desktop_3b'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_3',
      script: [
        { from: 'them', text: '嘿' },
        { from: 'me', text: "嘿，怎么了？" },
        { from: 'them', text: "没事，今天就是特别想lulu" },
        { from: 'them', text: "我还是会一直想起她" },
        { from: 'me', text: "她能有你真的很幸运，你知道吗？你给了她最好的一生" },
        { from: 'them', text: "……谢谢，我需要听这句话 🥺" },
        { from: 'them', text: "我没事的，不是那种很难过的难过" },
        { from: 'them', text: "我在海边" },
        { from: 'them', text: "爸妈很想你。你什么时候回家？" },
        { from: 'me', text: "还不确定，最近有篇论文要交。我马上要出门了，之后再跟你聊" },
      ],
      onEnd: function () {
        setState({ debsChat1Done: true });
        goToNode('desktop_3b');
      }
    });
  }
};

// 桌面：动态通知（debs对话之后的日常插曲，呼应Shawn买新车这件事）
NODES_ZH['desktop_3b'] = {
  container: 'screen-desktop',
  links: ['priya_chat', 'oasis_app_login', 'calendar_app'],
  render: function () {
    renderChapter1Desktop('10:24', 'Nov 8, 2032');
  }
};

// priya聊天：日常插曲，吐槽Shawn买新车（轻松调子，不影响主线，结束后推进到时间跳跃过场）
NODES_ZH['priya_chat'] = {
  container: 'screen-chat',
  links: ['time_skip_1'],
  render: function () {
    renderChatApp({
      headerName: 'priya92',
      characterId: 'priya',
      backTarget: 'desktop_3b',
      script: [
        { from: 'them', text: "哟你看到shawn刚买的那辆车了吗？我以为他讨厌那个牌子" },
        { from: 'me', text: "他跟我说是一时冲动买的哈哈 也许这次是真的打动他了" },
        { from: 'them', text: "我太羡慕了我也得换掉我那破车" },
        { from: 'me', text: "我也是哈哈 我也挺喜欢新出的RAVEN车型，看了它的广告" },
        { from: 'them', text: "明天你生日我们去哪儿？" },
        { from: 'me', text: "Ivy酒吧！我已经预订好了" },
        { from: 'me', text: "我的新音箱套装也快到了！正好赶上我生日。" },
        { from: 'them', text: "好家伙" },
        { from: 'them', text: "天哪太酷了！！！！！！" },
        { from: 'them', text: "你期待27岁吗？" },
        { from: 'me', text: "哎别提了我正经历我的人生四分之一危机" },
      ],
      onEnd: function () {
        setState({ priyaChatDone: true });
        goToNode('time_skip_1');
      }
    });
  }
};

// 页面12前半：时间跳跃过场
NODES_ZH['time_skip_1'] = {
  container: 'screen-narrative',
  links: ['desktop_4'],
  render: function () {
    renderNarrative({
      text: '几周后……',
      buttonLabel: '继续',
      goto: 'desktop_4'
    });
  }
};

// 页面12后半：电脑主屏幕，妹妹崩溃消息通知
NODES_ZH['desktop_4'] = {
  container: 'screen-desktop',
  links: ['debs_chat_2', 'oasis_app_login', 'calendar_app'],
  render: function () {
    renderDesktop({
      time: '2:17',
      date: 'Nov 29, 2032',
      notif: messageNotif('Debs', 'debs_chat_2'),
      showOasisApp: true,
      showCalendarApp: true,
      calendarGoto: 'calendar_app',
      dockGoto: {}
    });
  }
};

// debs紧急聊天：哭诉胶囊失效、暴饮暴食复发（大纲页面12互动行为的延伸，未单独编号）
NODES_ZH['debs_chat_2'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_4',
      script: [
        { from: 'them', text: "嘿你在吗:(？我今天醒来感觉脑子里一团糟。什么都是灰色的。" },
        { from: 'them', text: "我在听我最喜欢的歌单，可它听起来就像无聊的静电杂音一样。" },
        { from: 'them', text: "就好像我完全无所谓了。" },
        { from: 'them', text: "我甚至都不觉得难过。我哭不出来。我现在感觉就像一个完全空荡荡的躯壳。" },
        { from: 'them', text: "感觉就像有人把我脑子里的总开关关掉了，把我一个人留在黑暗里。" },
        { from: 'me', text: "从什么时候开始的？最近有发生什么事吗？" },
        { from: 'them', text: "不知道" },
        { from: 'them', text: "三天前？" },
        { from: 'them', text: "我没觉得有什么特别的事触发了这个" },
        { from: 'me', text: "你去喝点热饮然后躺床上好吗？" },
        { from: 'me', text: "我去看看我的app有没有显示什么异常。我感觉自己挺正常的" },
      ],
      onEnd: function () {
        goToNode('desktop_5');
      }
    });
  }
};

// 页面13：自己的oasis医疗数据平台（伏笔位置：如果玩家看过vocalist订单时间11/5 21:04，
// 这里可以不显眼地呈现自己数据里同一时间点的异常pattern，不强制玩家发现）
// 退出debs崩溃聊天后，主动返回桌面（不是被通知触发），此时桌面上首次出现OASIS app图标
NODES_ZH['desktop_5'] = {
  container: 'screen-desktop',
  links: ['oasis_app_login', 'calendar_app', 'ruth_chat', 'friends_feed', 'debs_odd_notif_chat'],
  render: function () {
    const state = getState();
    if (state.chapter2Stage === 'done') {
      renderChapter34Desktop('2:31', 'Nov 29, 2032');
    } else {
      renderChapter2Desktop('2:31', 'Nov 29, 2032');
    }
  }
};

// OASIS app 登录验证页：核对用户名+生日。这个机制是通用的，
// 以后查看debs等其他人的oasis数据时，复用renderOasisLogin，只是validUsername/validBirthday/onSuccess不同
NODES_ZH['oasis_app_login'] = {
  container: 'screen-document',
  links: ['oasis_app_dashboard', 'debra_oasis_dashboard', 'desktop_1', 'desktop_2', 'desktop_3', 'desktop_3b', 'desktop_4', 'desktop_5'],
  render: function () {
    const state = getState();
    renderOasisLogin({
      promptText: '由于长时间未活动，为了安全请重新登录。',
      backTarget: state.lastDesktopNode || 'desktop_5',
      identities: [
        {
          validUsername: () => state.playerName,
          validBirthday: '2005-11-09',
          onMatch: () => {
            setState({ oasisSession: 'self' });
            goToNode('oasis_app_dashboard');
          }
        },
        {
          validUsername: 'debra',
          validBirthday: '2008-04-12',
          onMatch: () => {
            runDebraVerificationModal(() => {
              setState({ oasisSession: 'debra', chapter2Stage: 'done' });
              goToNode('debra_oasis_dashboard');
            });
          }
        }
      ]
    });
  }
};

// OASIS app 主面板：自己的账户数据。数据驱动设计，以后查看debs的数据时复用renderOasisDashboard，
// 只需要传入不同的config即可，不需要重写面板结构。
NODES_ZH['oasis_app_dashboard'] = {
  container: 'screen-document',
  links: ['oasis_app_login', 'pil_agreement'],
  render: function () {
    const state = getState();
    if (state.chapter2Stage === 'free_roam') {
      setState({ chapter2Stage: 'debs_odd_notif_pending' });
    }
    renderOasisDashboard({
      backTarget: state.lastDesktopNode || 'desktop_5',
      status: {
        sync: '40.0Hz',
        nextCalibration: '2032-12-05'
      },
      stabilityIndex: 98,
      interventionLog: [
        { time: '2032-11-29 14:22', text: '检测到悲伤：触发0.4mg多巴胺释放。基线已恢复。' },
        { time: '2032-11-29 11:45', text: '焦虑峰值：迷走神经刺激已启动。皮质醇水平已恢复正常。' },
        { time: '2032-11-28 20:10', text: '轻度忧郁：神经通路重定向进行中。' },
      ],
      deepLogs: [
        { time: '2032-11-29 14:22', flagged: false },
        { time: '2032-11-29 11:45', flagged: false },
        { time: '2032-11-28 20:10', flagged: false },
        { time: '2032-11-27 09:03', flagged: false },
        { time: '2032-11-24 22:51', flagged: false },
        { time: '2032-11-20 16:40', flagged: false },
        { time: '2032-11-16 08:12', flagged: false },
        { time: '2032-11-12 19:27', flagged: false },
        { time: '2032-11-09 00:04', flagged: false },
        {
          time: '2032-11-05 21:04', flagged: true,
          warningTip: '严重错误：触发纳米系统排斥模式。需手动给药以绕过系统故障。'
        },
        { time: '2032-11-03 13:18', flagged: false },
        { time: '2032-10-29 07:55', flagged: false },
      ],
      stressLevel: '高（A++级）',
      stressTest: {
        question: '847 × 23 等于多少？',
        answer: 19481,
        correctFeedback: '回答正确。已记录认知负荷。',
        wrongFeedback: '回答错误。已记录认知负荷。'
      }
    });
  }
};


// 日历app：从游戏一开始就可用，展示2032年11月日程 + 4人生日倒计时
NODES_ZH['calendar_app'] = {
  container: 'screen-calendar',
  links: ['desktop_1', 'desktop_2', 'desktop_3', 'desktop_3b', 'desktop_4', 'desktop_5'],
  render: function () {
    renderCalendar({
      backTarget: getState().lastDesktopNode || 'desktop_1',
      monthLabel: '2032年11月',
      year: 2032,
      month: 10, // 0-indexed，10 = November
      events: {
        3:  [{ type: 'exam', label: '期中考试' }],
        6:  [{ type: 'work', label: '团队同步会议' }],
        10: [{ type: 'social', label: '和Jordan吃午饭' }],
        12: [{ type: 'work', label: '项目截止日' }],
        15: [{ type: 'exam', label: '论文截止' }],
        18: [{ type: 'social', label: '和Shawn去酒吧' }],
        22: [{ type: 'work', label: '季度复盘' }],
        25: [{ type: 'social', label: '和Priya喝咖啡' }],
      },
      birthdays: [
        { name: '你', month: 11, day: 9, birthYear: 2005 },
        { name: 'Debs', month: 4, day: 12, birthYear: 2008 },
        { name: '妈妈', month: 8, day: 2, birthYear: 1977 },
        { name: '爸爸', month: 12, day: 2, birthYear: 1975 },
      ]
    });
  }
};


NODES_ZH['self_oasis_dataviz'] = {
  container: 'screen-dataviz',
  links: ['debs_chat_2'],
  render: function () {
    document.getElementById('dataviz-back-btn').setAttribute('data-goto', 'debs_chat_2');
    const wrap = document.getElementById('dataviz-wrap');
    const hours = Array.from({ length: 24 }, (_, h) => h);
    const bars = hours.map(h => {
      const isAnomalyHour = h === 21; // 21:04 所在的小时
      const height = isAnomalyHour ? 38 : 55 + Math.sin(h / 3) * 15 + Math.random() * 8;
      return '<div class="dataviz-bar" style="height:' + Math.max(20, height) + '%;"></div>';
    }).join('');

    wrap.innerHTML = `
      <div class="dataviz-title">你的OASIS仪表盘</div>
      <div class="dataviz-chart">
        <div class="dataviz-chart-label">多巴胺基线稳定性 — 过去24小时</div>
        <div class="dataviz-bars">${bars}</div>
      </div>
      <div class="dataviz-entries">
        <div class="dataviz-entry" data-entry="6am"><span class="ts">06:00</span><span class="val">稳定</span></div>
        <div class="dataviz-entry" data-entry="12pm"><span class="ts">12:00</span><span class="val">稳定</span></div>
        <div class="dataviz-entry" data-entry="9pm"><span class="ts">21:04</span><span class="val">稳定</span></div>
        <div class="dataviz-entry" data-entry="11pm"><span class="ts">23:00</span><span class="val">稳定</span></div>
      </div>
      <div class="dataviz-note" id="dataviz-self-note">这里的一切看起来都正常。没有其他异常。</div>
      <div style="margin:32px 20px 0; padding:16px; border:1px dashed var(--ios-separator); border-radius:10px; text-align:center; font-size:12px; color:var(--ios-text-secondary);">
        — 这是尚未接入主线故事流程的独立内容 —<br>未来更新中会重新整合进剧情。
      </div>
    `;

    wrap.querySelectorAll('.dataviz-entry').forEach(el => {
      el.addEventListener('click', () => {
        const note = document.getElementById('dataviz-self-note');
        note.classList.add('show');
        if (el.getAttribute('data-entry') === '9pm') {
          note.textContent = '21:04 — 短暂的下滑，随后恢复正常。可能没什么问题。';
        } else {
          note.textContent = '这里的一切看起来都正常。没有其他异常。';
        }
      });
    });
  }
};

// ============ 组2：任务线（NDA → VNT → 纳米机器人日志 → 防火墙解谜 → 解密 → Amber → 抉择点B） ============

NODES_ZH['pil_agreement'] = {
  container: 'screen-document',
  links: ['oasis_app_dashboard'],
  render: function () {
    document.getElementById('document-back-btn').setAttribute('data-goto', 'oasis_app_dashboard');
    const wrap = document.getElementById('document-wrap');
    wrap.scrollTop = 0;
    wrap.innerHTML = `
      <div class="doc-title">OASIS BIOMETRIC SYSTEMS</div>
      <div class="doc-subtitle">服务条款与神经整合协议<br>最后更新日期：2032年6月22日</div>
      <div class="doc-body">
        <p><b>⚠️ 重要生物识别须知</b></p>
        <p>在你吞服OASIS生物识别胶囊、佩戴配套智能皮肤贴片，或激活OASIS伴侣应用程序的同时，即视为你明确同意系统与你的中枢神经系统进行实时电生理交互。如果你不同意本条款，请不要吞服胶囊。</p>

        <p><b>1. 神经主权放弃与算法中立性</b></p>
        <p>OASIS系统通过向迷走神经传递局部微电流刺激来实现，协助调节内源性神经递质水平（包括但不限于多巴胺、血清素和GABA）。</p>
        <p><b>算法自主性：</b>所有神经调节序列及神经递质调整，均严格基于你设备上实时采集的电生理遥测数据，在本地闭环层面自动生成。</p>
        <p><b>责任限制：</b>由于个体生化阈值存在差异，OASIS按"现状"提供本系统。对于因系统使用而出现的短暂情绪低落、突发性情感空虚、暂时性感官麻木、知觉脱离，或独立消费决策能力的突然改变，本公司不承担任何民事、刑事或心理层面的责任。</p>

        <p><b>2. 体内硬件风险与"连接丢失"协议</b></p>
        <p>OASIS可摄入胶囊采用生物相容、生物惰性且可安全降解的纳米材料，专为在人体消化道内无缝运作而设计。</p>
        <p><b>通讯中断：</b>你确认知悉体内生理环境高度不稳定（受胃肠蠕动、代谢波动及pH值变化影响）。因此，胶囊可能出现突发性硬件待机、固件失步，或未经预告的"连接丢失"状态。</p>
        <p><b>超量摄入与应对措施限制：</b>若伴侣应用显示"连接丢失"或"设备已断开"状态，用户被严格禁止在滚动48小时窗口内补充摄入或多次摄入胶囊。</p>
        <p><b>戒断免责：</b>由硬件突然断电（俗称"系统宕机"或"崩溃"）引起的体内多巴胺或血清素合成基线骤降，属于已知的生物再校准副产物。在此类离线期间出现的急性焦虑、恐慌或心理空洞感，本公司不提供任何补偿。</p>

        <p><b>3. "数据盲区"协议与第三方屏蔽机制</b></p>
        <p>OASIS对用户隐私持有绝对承诺。我们的服务器不会追踪、收集、存储或汇总你的财务交易、社交聊天记录、浏览历史或位置数据。</p>
        <p><b>API集成：</b>OASIS系统配备开放式API，旨在与经过认证的外部环境及智能硬件同步（包括但不限于第三方空间音频生态系统、车载声学系统、交通枢纽及精选零售场所）。</p>
        <p><b>响应式本地循环：</b>若外部信号——例如不可闻的声学信标、超声波频率或环境音波——通过你的智能皮肤贴片触发了局部神经递质变化，该响应在法律上被定义为"本地自发性适应"。</p>
        <p><b>广告免责：</b>由于OASIS不会采集或与合作广告商共享你的行为数据，任何在接触第三方媒体期间或之后立即出现的情绪波动、强烈渴望或冲动购买行为，其认知及财务责任完全由用户自行承担。</p>

        <p><b>4. 严格反逆向工程与完整性强制条款</b></p>
        <p>胶囊的内部架构、皮肤贴片间的加密射频握手协议，以及底层广告触发API协议，均属于受到严密保护的医疗及专有知识产权。</p>
        <p><b>禁止行为：</b>用户不得使用射频侦测设备、软件解耦或电磁提取手段，截取、捕获、反编译或试图审查体内系统的固件代码。</p>
        <p><b>补救性断连：</b>任何试图逆向工程、修改或修补体内电脉冲间隔的行为，都将被立即标记为严重系统违规。</p>
        <p><b>服务终止：</b>OASIS保留单方面永久撤销任何违规用户生物激活许可的权利，可在无需事先警告的情况下立即停用其体内胶囊，并将该违规行为上报至国家神经权利管理局。</p>

        <p>点击"我同意神经条款"即表示，你承认正在将自身知觉的化学调节权交给一个自动化的闭环系统。你明确放弃就系统停机所造成的任何心理或存在层面错位寻求陪审团审判的权利。</p>
      </div>
    `;
  }
};

// ============ 第二章节 ============

NODES_ZH['ruth_chat'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Ruth',
      characterId: 'ruth',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "天哪新款香水卖爆了" },
        { from: 'them', text: "自从我们和那家新营销公司合作之后，生意简直疯了" },
        { from: 'them', text: "全组人都拿到奖金了" },
        { from: 'them', text: "今晚一起吃饭庆祝一下？" },
        { from: 'me', text: "恭喜！！这太棒了" },
        { from: 'me', text: "不过我妹妹最近状态不太好，我得先处理一下这事" },
        { from: 'them', text: "哦不。我前几天还见过她，她在为Adrian的事难过" },
        { from: 'me', text: "又是？？她没跟我说过这事。是因为什么？" },
        { from: 'them', text: "还是老一套，Adrian一直在抱怨为了她放弃了搬迁，他真是够烦的" },
        { from: 'me', text: "天哪，他什么时候才能不把自己当成受害者" },
      ],
      onEnd: function () {
        setState({ chapter2Stage: 'free_roam' });
        goToNode('desktop_5');
      }
    });
  }
};

NODES_ZH['adrian_story'] = {
  container: 'screen-story',
  links: ['adrian_profile', 'friends_feed'],
  render: function () {
    renderStoryPlayer({
      characterId: 'adrian',
      slides: [
        { sceneClass: 'scene-moody', icon: '😒', caption: '', img: 'story/adrian_1_moody.webp' },
        { sceneClass: 'scene-moody', icon: '💔', caption: '', img: 'story/adrian_2_moody.webp' },
      ],
      onComplete: 'adrian_profile',
      profileTarget: 'adrian_profile',
      closeTarget: 'friends_feed'
    });
  }
};

NODES_ZH['adrian_profile'] = {
  container: 'screen-profile',
  links: ['adrian_chat', 'friends_feed'],
  render: function () {
    const state = getState();
    const ch2Posts = [
      { dateLabel: '11月6日', caption: "嗷嗷嗷冲", likes: 28, img: 'posts/adrian_ch2_p1_moody.webp', gradient: 'linear-gradient(180deg,#2a2d3a,#1a1c24)', comments: [] },
      { dateLabel: '10月30日', caption: '周末的项目终于完成了', likes: 33, img: 'posts/adrian_ch2_p2_project.webp', gradient: 'linear-gradient(135deg,#7B96A8,#3D5566)', comments: [{ name: 'devon', text: '看起来挺扎实' }] },
    ];
    const ch4Posts = [
      { dateLabel: '11月26日', caption: '出门走走总是好的', likes: 41, img: 'posts/adrian_ch4_p1_sink.webp', gradient: 'linear-gradient(135deg,#9aa7b8,#5c6878)', comments: [{ name: 'devon', text: 'DIY之王' }] },
      { dateLabel: '11月19日', caption: "最近健身效果不错", likes: 67, img: 'posts/adrian_ch4_p2_gym.webp', gradient: 'linear-gradient(135deg,#7B96A8,#3D5566)', comments: [{ name: 'jordan_t', text: '加油保持' }] },
      { dateLabel: '11月12日', caption: '🔥本赛季最佳比赛', likes: 52, img: 'posts/adrian_ch4_p3_game.webp', gradient: 'linear-gradient(180deg,#2a2d3a,#1a1c24)', comments: [{ name: 'mia.l', text: '谁赢了' }] },
    ];
    renderProfileFeed({
      backTarget: state.lastDesktopNode || 'friends_feed',
      name: 'Adrian',
      avatarGradient: getCharacter('adrian').fallback,
      bio: "人生苦短，尽兴而活",
      stats: [{ n: '212', l: '帖子' }, { n: '1.4k', l: '关注者' }, { n: '388', l: '正在关注' }],
      messageTarget: 'adrian_chat',
      posts: state.amberSafetyChatDone ? ch4Posts : ch2Posts
    });
  }
};

NODES_ZH['adrian_chat'] = {
  container: 'screen-chat',
  links: ['adrian_profile', 'desktop_5'],
  render: function () {
    setState({ adrianMessaged: true });
    renderChatApp({
      headerName: 'Adrian',
      characterId: 'adrian',
      backTarget: 'adrian_profile',
      script: [
        { from: 'me', text: "你到底什么毛病？我妹妹跟你谈恋爱不是为了让你们俩天天吵架的" },
        { from: 'them', text: "行了吧，那都是两天前的事了。现在已经过去了" },
        { from: 'me', text: "别再做让别人难过的事了！" },
      ],
      onEnd: function () {
        if (getState().chapter2Stage === 'free_roam') {
          setState({ chapter2Stage: 'debs_odd_notif_pending' });
        }
        goToNode('desktop_5');
      }
    });
  }
};

NODES_ZH['debs_odd_notif_chat'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'me', text: "嘿，我这边的app显示一切正常" },
        { from: 'them', text: "这就奇怪了。我这边一直收到一些奇怪的推送" },
        { from: 'them', text: "上面写着干预失败之类的东西，我看不懂" },
        { from: 'them', text: "而且详细的历史数据里有一大堆失败记录，全是红色的时间戳" },
        { from: 'them', text: "我点开看了一个，但都是乱码，我看不懂" },
        { from: 'them', text: "我已经把这个错误报告给OASIS了，但他们说还在调查中" },
        { from: 'me', text: "我能登录进去看看吗？这真的很奇怪" },
        { from: 'them', text: "好的，行。你可以在app里登录我的账号，我会授权给你" },
      ],
      onEnd: function () {
        setState({ chapter2Stage: 'debra_login_ready' });
        goToNode('desktop_5');
      }
    });
  }
};

// ============ 第三章节 ============

NODES_ZH['debra_oasis_dashboard'] = {
  container: 'screen-document',
  links: ['oasis_app_login', 'pil_agreement', 'debra_failed_log_detail'],
  render: function () {
    const state = getState();
    renderOasisDashboard({
      backTarget: state.lastDesktopNode || 'desktop_5',
      viewingName: 'Debra',
      hideStressTest: true,
      hideTerms: true,
      flaggedRowGoto: 'debra_failed_log_detail',
      status: {
        sync: '40.0Hz',
        nextCalibration: '2032-12-05'
      },
      stabilityIndex: 31,
      ringLabel: '不稳定',
      interventionLog: [
        { time: '2032-11-28 23:59', text: '神经重置：[!] 失败 —— 请求被云端代理拒绝。' },
        { time: '2032-11-28 18:45', text: '神经重置：[!] 失败 —— 请求被云端代理拒绝。' },
        { time: '2032-11-28 15:02', text: '神经重置：[!] 失败 —— 代理拦截 [来源: STOP_USING]。' },
      ],
      deepLogs: [
        { time: '2032-11-22 08:15', flagged: false },
        { time: '2032-11-22 13:40', flagged: false },
        { time: '2032-11-23 07:05', flagged: false },
        { time: '2032-11-23 16:55', flagged: false },
        { time: '2032-11-24 09:15', flagged: false },
        { time: '2032-11-24 19:20', flagged: false },
        { time: '2032-11-25 08:02', flagged: true, statusLabel: '失败' },
        { time: '2032-11-25 10:30', flagged: true, statusLabel: '失败' },
        { time: '2032-11-26 01:05', flagged: true, statusLabel: '失败' },
        { time: '2032-11-26 10:12', flagged: true, statusLabel: '失败' },
        { time: '2032-11-27 02:22', flagged: true, statusLabel: '失败' },
        { time: '2032-11-27 15:50', flagged: true, statusLabel: '失败' },
        { time: '2032-11-28 01:12', flagged: true, statusLabel: '失败' },
        { time: '2032-11-28 12:18', flagged: true, statusLabel: '失败' },
        { time: '2032-11-28 23:59', flagged: true, statusLabel: '失败' },
      ]
    });
  }
};

NODES_ZH['debra_failed_log_detail'] = {
  container: 'screen-terminal',
  links: ['debra_oasis_dashboard'],
  render: function () {
    if (getState().chapter34Stage === 'debra_dashboard') {
      setState({ chapter34Stage: 'debs_hacked_chat_pending' });
    }
    document.getElementById('terminal-back-btn').classList.remove('hide');
    document.getElementById('terminal-back-btn').setAttribute('data-goto', 'debra_oasis_dashboard');
    const wrap = document.getElementById('terminal-wrap');
    const rawLog = [
      ['2032-11-22 08:15:02', 39.8, 0.05, '基线校准', '成功'],
      ['2032-11-22 13:40:55', 44.2, 0.18, '迷走神经刺激（5mA）', '成功'],
      ['2032-11-22 21:10:12', 40.5, 0.07, '血清素泵注射（0.2mg）', '成功'],
      ['2032-11-23 07:05:44', 38.9, 0.04, '皮质醇降解（纳米酶）', '成功'],
      ['2032-11-23 11:22:30', 43.1, 0.22, '多巴胺受体调节', '成功'],
      ['2032-11-23 16:55:01', 40.1, 0.06, '基线校准', '成功'],
      ['2032-11-23 23:30:19', 44.8, 0.35, '迷走神经刺激（8mA）', '成功'],
      ['2032-11-24 09:15:47', 39.5, 0.05, '基线校准', '成功'],
      ['2032-11-24 14:45:10', 42.9, 0.15, '突触延迟补偿', '成功'],
      ['2032-11-24 19:20:33', 43.5, 0.28, '迷走神经刺激（6mA）', '成功'],
      ['2032-11-25 08:02:11', 56.4, 4.12, '神经重置', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-25 09:12:45', 58.2, 5.44, '神经重置', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-25 10:30:05', 61.8, 6.89, '神经重置', '[!] 失败：代理拦截 [来源：UNKNOWN_PROXY_88]'],
      ['2032-11-25 15:18:22', 52.3, 3.90, '迷走神经刺激', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-26 01:05:11', 59.5, 7.21, '血清素泵注射', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-26 04:55:30', 55.4, 5.80, '皮质醇降解', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-26 10:12:15', 64.7, 8.34, '神经重置', '[!] 失败：代理拦截 [来源：UNKNOWN_PROXY_88]'],
      ['2032-11-26 14:40:02', 54.2, 4.12, '多巴胺受体调节', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-27 02:22:44', 51.6, 3.20, '迷走神经刺激', '[!] 失败：连接超时'],
      ['2032-11-27 06:10:19', 57.9, 6.10, '皮质醇降解', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-27 11:35:56', 60.3, 7.55, '血清素泵注射', '[!] 失败：代理拦截 [来源：WAKE_UP]'],
      ['2032-11-27 15:50:10', 62.1, 8.01, '神经重置', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-27 20:05:41', 53.8, 3.99, '迷走神经刺激', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-28 01:12:33', 65.4, 9.12, '神经重置', '[!] 失败：代理拦截 [来源：THEY_ARE_MANIPULATING]'],
      ['2032-11-28 05:40:12', 58.7, 6.80, '血清素泵注射', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-28 09:25:05', 63.9, 8.55, '神经重置', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-28 12:18:47', 60.1, 7.20, '皮质醇降解', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-28 15:02:11', 68.2, 10.45, '神经重置', '[!] 失败：代理拦截 [来源：STOP_USING]'],
      ['2032-11-28 18:45:55', 66.5, 9.98, '神经重置', '[!] 失败：请求被云端代理拒绝'],
      ['2032-11-28 23:59:59', 71.0, 12.01, '神经重置', '[!] 失败：请求被云端代理拒绝'],
    ];
    const linesHtml = rawLog.map(r => {
      const fail = r[4].indexOf('失败') !== -1;
      return `<div class="raw-log-line ${fail ? 'fail' : ''}">{"time": "${r[0]}", "vnt": ${r[1]}, "variance": ${r[2]}, "action": "${r[3]}", "status": "${r[4]}"}</div>`;
    }).join('');
    wrap.innerHTML = `
      <div class="terminal-title">debra_core.log — 原始输出</div>
      <div class="raw-log-box">${linesHtml}</div>
      <div class="terminal-continue-btn" id="rawlog-continue-btn">返回仪表盘</div>
    `;
    document.getElementById('rawlog-continue-btn').addEventListener('click', () => goToNode('debra_oasis_dashboard'));
  }
};

NODES_ZH['debs_hacked_chat'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'me', text: "你的账户好像被黑了，这就是为什么胶囊一直不工作" },
      ],
      onEnd: function () {
        setState({ chapter34Stage: 'call_debra_ready' });
        goToNode('desktop_5');
      }
    });
  }
};

NODES_ZH['calling_debra'] = {
  container: 'screen-narrative',
  links: ['desktop_5'],
  render: function () {
    const wrap = document.getElementById('narrative-wrap');
    wrap.innerHTML = `
      <div class="narrative-text" id="calling-text">正在呼叫Debs……</div>
      <div class="calling-spinner" id="calling-spinner"></div>
      <div class="narrative-continue-btn hide" id="calling-continue-btn">返回桌面</div>
    `;
    setTimeout(() => {
      document.getElementById('calling-text').textContent = '通话已结束 —— 无人接听。';
      document.getElementById('calling-spinner').classList.add('hide-spinner');
      document.getElementById('calling-continue-btn').classList.remove('hide');
      setState({ chapter34Stage: 'worried_chat_pending' });
    }, 5000);
    document.getElementById('calling-continue-btn').addEventListener('click', () => goToNode('desktop_5'));
  }
};

NODES_ZH['debs_worried_chat'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'me', text: "你还好吗？为什么不回我消息？" },
        { from: 'me', text: "尽快回复我吧，我开始担心了" },
      ],
      onEnd: function () {
        setState({ chapter34Stage: 'pavlov1_pending' });
        goToNode('desktop_5');
      }
    });
  }
};

NODES_ZH['pavlov_email_1'] = {
  container: 'screen-mail',
  links: ['ch4_transition'],
  render: function () {
    const mailList = [
      {
        id: 'pavlov1', from: 'Pavlov', subj: '%$#@ ... ___ ... %%%',
        snippet: 'aSDjk!#@(* ... woof ...', unread: true,
        detailRender: () => `
          <div class="mail-detail-subject">%$#@ ... ___ ... %%%</div>
          <div class="mail-detail-meta">发件人：<b>Pavlov</b></div>
          <div class="garbled-email-body">
&gt;&gt;&gt^%$#$%^&%$#$%^sf*&^%sha%^&hs*&^%$她是安全的%$*&hsbn%^GF*&^; ksjdf83##@@停下 &amp;^%$ jkfh283@&*65sgyyuwh(*&67895Ewqni&^%
$67htre9&%865p;&ampp;&amㅤㅤ ʕ•ᴥ•ʔ $%^jhBV45&^%6HGFpp;&amㅤㅤ /ᐠ - ᴥ - ᐟ\\ ㅤㅤ6788jjfsa&^%hjhqwe7618&^%45sh U・ᴥ・U
###23pp;&am#1@@21@&am;她是安全的*&^%$67h6788jjfsatre9&%8656788jjfsahhy6788jjfsam%%1312$$ kjs6788jjfsa24$%hdf*&^%$%7ashu65644h
&^%$#@#$%^hsag&^%yau^%这是自然的@!@J51u6%^&htr6f85646788jjfsa7uhiu%^7bja8#&amp;%$ jksdhf86788jjfsa92123t6&**^**@#G&&SSQ6788jjfsaGWYT&6534sbdhqh.
          </div>`
      }
    ];
    renderMailApp(mailList, 'pavlov1', 'ch4_transition');
  }
};

NODES_ZH['nova_page'] = {
  container: 'screen-website',
  links: ['debs_profile'],
  render: function () {
    if (getState().chapter34Stage === 'free_roam_2') {
      setState({ chapter34Stage: 'pavlov3_pending' });
    }
    renderWebsite({
      backTarget: 'debs_profile',
      sections: [
        `<style>
          .nv-wrap { background:#0A0E1A; font-family: var(--sf); color:#F5F7FF; }
          .nv-nav { display:flex; align-items:center; justify-content:space-between; padding:20px 22px; }
          .nv-logo { font-size:17px; font-weight:800; letter-spacing:2px; color:#F5F7FF; }
          .nv-nav-links { font-size:10px; letter-spacing:0.5px; color:#6B7785; }
          .nv-hero { position:relative; padding:18px 22px 38px; overflow:hidden; }
          .nv-hero-graphic { width:100%; height:150px; margin-bottom:8px; }
          .nv-eyebrow { font-size:10.5px; letter-spacing:3px; color:#4FD8E8; font-weight:700; margin-bottom:14px; text-transform:uppercase; }
          .nv-headline { font-size:25px; line-height:1.28; font-weight:800; letter-spacing:-0.3px; margin-bottom:14px; }
          .nv-sub { font-size:13px; line-height:1.65; color:#8893A5; margin-bottom:24px; }
          .nv-cta {
            display:inline-block; font-size:13px; font-weight:700; letter-spacing:0.2px;
            background:#3D7FFF; color:#fff; padding:14px 26px; border-radius:6px; cursor:pointer;
            box-shadow: 0 8px 24px rgba(61,127,255,0.35);
          }
          .nv-cta:active { opacity:0.85; }
          .nv-section { padding:40px 22px; border-top:1px solid rgba(255,255,255,0.08); }
          .nv-section-title { font-size:19px; font-weight:800; margin-bottom:26px; }
          .nv-feature { display:flex; gap:16px; margin-bottom:26px; align-items:flex-start; }
          .nv-feature:last-child { margin-bottom:0; }
          .nv-feature-icon {
            flex-shrink:0; width:40px; height:40px; border-radius:10px; background:rgba(79,216,232,0.1);
            display:flex; align-items:center; justify-content:center;
          }
          .nv-feature-name { font-size:14px; font-weight:700; color:#F5F7FF; margin-bottom:5px; }
          .nv-feature-desc { font-size:12.5px; line-height:1.6; color:#6B7785; }
          .nv-proof { padding:36px 22px 44px; text-align:center; border-top:1px solid rgba(255,255,255,0.08); }
          .nv-proof-text { font-size:14px; font-weight:600; color:#F5F7FF; line-height:1.6; }
          .nv-proof-text b { color:#4FD8E8; }
        </style>
        <div class="nv-wrap">
          <div class="nv-nav">
            <div class="nv-logo">NOVA</div>
            <div class="nv-nav-links">功能 · 路线图 · 价格</div>
          </div>
          <div class="nv-hero">
            <svg class="nv-hero-graphic" viewBox="0 0 320 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M170 130 L210 95 L195 70 L250 35 L240 15" stroke="#3D7FFF" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
              <path d="M185 140 L225 100 L260 110 L290 55" stroke="#4FD8E8" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
              <path d="M200 145 L245 130 L255 90 L300 80" stroke="#F5F7FF" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
              <circle cx="170" cy="130" r="3" fill="#3D7FFF"/>
              <circle cx="210" cy="95" r="3" fill="#3D7FFF"/>
              <circle cx="250" cy="35" r="4" fill="#4FD8E8"/>
              <circle cx="290" cy="55" r="3" fill="#4FD8E8"/>
              <circle cx="300" cy="80" r="2.5" fill="#F5F7FF" opacity="0.6"/>
            </svg>
            <div class="nv-eyebrow">NOVA 教育</div>
            <div class="nv-headline">智能驱动，<br>导航你的未来。</div>
            <div class="nv-sub">别再瞎猜了。借助AI驱动的洞察精准选定专业，明确你的职业路径。</div>
            <div class="nv-cta" data-toast="目前暂无优惠活动。">免费开始</div>
          </div>
          <div class="nv-section">
            <div class="nv-section-title">通往你的路线图</div>
            <div class="nv-feature">
              <div class="nv-feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="#4FD8E8" stroke-width="1.6"/><path d="M19.5 19.5L15 15" stroke="#4FD8E8" stroke-width="1.6" stroke-linecap="round"/></svg></div>
              <div><div class="nv-feature-name">智能专业匹配</div><div class="nv-feature-desc">分析你的优势与热情，匹配最适合的学术领域。</div></div>
            </div>
            <div class="nv-feature">
              <div class="nv-feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 4c-3 0-5 2-5 4.5 0 1.7 1 2.5 1 4 0 1 0 2 1 2.5h6c1-.5 1-1.5 1-2.5 0-1.5 1-2.3 1-4 0-2.5-2-4.5-5-4.5z" stroke="#4FD8E8" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 17.5h4M10.5 20h3" stroke="#4FD8E8" stroke-width="1.5" stroke-linecap="round"/></svg></div>
              <div><div class="nv-feature-name">职业蓝图</div><div class="nv-feature-desc">借助我们先进的市场分析工具模拟真实的职业发展轨迹。</div></div>
            </div>
            <div class="nv-feature">
              <div class="nv-feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#4FD8E8" stroke-width="1.6"/><path d="M15 9l-4 4-2 4 4-2 2-4z" fill="#4FD8E8"/></svg></div>
              <div><div class="nv-feature-name">AI导师</div><div class="nv-feature-desc">24/7为你提供专属个人职业建议，紧贴你独特的目标。</div></div>
            </div>
          </div>
          <div class="nv-proof">
            <div class="nv-proof-text">助力<b>50,000+</b>名学生做出自信的选择。</div>
          </div>
        </div>`
      ]
    });
  }
};

NODES_ZH['pat_studio_page'] = {
  container: 'screen-website',
  links: ['debs_profile'],
  render: function () {
    renderWebsite({
      backTarget: 'debs_profile',
      sections: [
        `<style>
          .pat-wrap { background:#F4EDE4; font-family: Georgia, 'Iowan Old Style', 'Times New Roman', serif; color:#3D362E; }
          .pat-sans { font-family: var(--sf); }
          .pat-nav { display:flex; align-items:center; justify-content:space-between; padding:20px 22px; background:#F4EDE4; }
          .pat-logo { font-size:20px; font-weight:700; letter-spacing:1px; color:#3D362E; }
          .pat-menu-icon { display:flex; flex-direction:column; gap:4px; cursor:pointer; }
          .pat-menu-icon span { width:20px; height:2px; background:#3D362E; display:block; }
          .pat-hero { padding:6px 22px 36px; text-align:center; }
          .pat-hero-img {
            width:100%; aspect-ratio:4/5; border-radius:4px; overflow:hidden; margin-bottom:26px;
            box-shadow: 0 10px 30px rgba(61,53,46,0.12);
          }
          .pat-eyebrow { font-family: var(--sf); font-size:10.5px; letter-spacing:3px; color:#8A9580; font-weight:600; margin-bottom:14px; text-transform:uppercase; }
          .pat-headline { font-size:27px; line-height:1.28; font-weight:700; color:#3D362E; margin-bottom:14px; }
          .pat-sub { font-family: var(--sf); font-size:13.5px; line-height:1.65; color:#6E6253; max-width:320px; margin:0 auto 26px; }
          .pat-cta {
            display:inline-block; font-family: var(--sf); font-size:13px; font-weight:600; letter-spacing:0.3px;
            background:#8B5A3C; color:#F4EDE4; padding:14px 30px; border-radius:2px; cursor:pointer;
          }
          .pat-cta:active { opacity:0.8; }
          .pat-divider { width:36px; height:2px; background:#C17A54; margin:0 auto; }
          .pat-section { padding:44px 22px; }
          .pat-section.alt { background:#EDE3D3; }
          .pat-about-img {
            width:100%; aspect-ratio:1/1; border-radius:4px; overflow:hidden; margin-bottom:24px;
            box-shadow: 0 10px 30px rgba(61,53,46,0.1);
          }
          .pat-section-title { font-size:21px; font-weight:700; margin-bottom:16px; text-align:center; }
          .pat-section-body { font-family: var(--sf); font-size:13.5px; line-height:1.75; color:#5C5142; text-align:center; }
          .pat-workshop-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-top:24px; }
          .pat-workshop-cell { aspect-ratio:1/1; border-radius:4px; overflow:hidden; position:relative; }
          .pat-workshop-label {
            position:absolute; left:0; right:0; bottom:0; padding:8px 6px;
            font-family: var(--sf); font-size:10px; font-weight:600; color:#fff; text-align:center; letter-spacing:0.2px;
            background:linear-gradient(0deg, rgba(0,0,0,0.55), transparent);
          }
        </style>
        <div class="pat-wrap">
          <div class="pat-nav">
            <div class="pat-logo">PAT</div>
            <div class="pat-menu-icon" data-toast="商店 · 工作坊 · 关于我们 · 联系方式"><span></span><span></span><span></span></div>
          </div>
          <div class="pat-hero">
            <div class="pat-hero-img">${imgOrFallback('sites/pat_hero_couple_wheel.webp', 'linear-gradient(160deg,#D8B89A,#A8754F)', '4px')}</div>
            <div class="pat-eyebrow">本地陶艺工作室</div>
            <div class="pat-headline">手工塑造的时光，<br>由两人共同成形。</div>
            <div class="pat-sub">欢迎来到PAT Studio。这是一处本地陶艺空间，我们一起把陶土变成回忆。</div>
            <div class="pat-cta" data-toast="本月工作坊名额已满。">预订工作坊</div>
          </div>
          <div class="pat-section alt">
            <div class="pat-divider"></div>
            <div class="pat-about-img" style="margin-top:24px;">${imgOrFallback('sites/pat_about_couple.webp', 'linear-gradient(160deg,#BFAE96,#8A7559)', '4px')}</div>
            <div class="pat-section-title">我们的故事</div>
            <div class="pat-section-body">PAT不只是一间工作室，更是我们共同的热情项目。从转盘的第一圈，到上釉的最后一步，我们相信每件作品都在讲述一个故事。来吧，和我们一起慢下来，弄脏双手，在我们社区的中心探索陶艺之美。</div>
          </div>
          <div class="pat-section">
            <div class="pat-section-title">创造属于你的作品</div>
            <div class="pat-workshop-grid">
              <div class="pat-workshop-cell">${imgOrFallback('sites/pat_workshop_wheel.webp', 'linear-gradient(160deg,#C99A72,#92653F)', '0')}<div class="pat-workshop-label">拉坯入门101</div></div>
              <div class="pat-workshop-cell">${imgOrFallback('sites/pat_workshop_handbuild.webp', 'linear-gradient(160deg,#AFA088,#7C6E59)', '0')}<div class="pat-workshop-label">手塑基础课</div></div>
              <div class="pat-workshop-cell">${imgOrFallback('sites/pat_workshop_glazing.webp', 'linear-gradient(160deg,#9CA98E,#6C7960)', '0')}<div class="pat-workshop-label">情侣约会陶艺课</div></div>
            </div>
          </div>
        </div>`
      ]
    });
  }
};

// ============ 第四章节 ============

NODES_ZH['ch4_transition'] = {
  container: 'screen-narrative',
  links: ['desktop_5'],
  render: function () {
    setState({ chapter34Stage: 'oasis_notice_pending' });
    renderNarrative({
      text: "一个小时过去了。Debra还是没有回复。我也联系不上爸妈的电话。我很怕是不是出了什么事。",
      buttonLabel: '继续',
      goto: 'desktop_5'
    });
  }
};

NODES_ZH['oasis_notice'] = {
  container: 'screen-document',
  links: ['amber_safety_chat'],
  render: function () {
    setState({ ch4Started: true });
    document.getElementById('document-back-btn').setAttribute('data-goto', 'desktop_5');
    const wrap = document.getElementById('document-wrap');
    wrap.scrollTop = 0;
    wrap.innerHTML = `
      <div class="doc-title">来自OASIS的消息</div>
      <div class="doc-body">
        <p>亲爱的尊贵会员，</p>
        <p>在OASIS，你的内心安宁是我们唯一的优先事项。我们写这封信是因为系统遥测检测到影响一小部分活跃OASIS节点的局部连接异常。</p>
        <p>我们了解到部分用户在过去72小时内可能经历了干预协议的暂时中断。我们想向你保证，这并非你的OASIS胶囊出现故障。相反，这是影响云同步网关的外部干扰所致。</p>
        <p>我们的工程团队目前正在对全球同步网络进行紧急重新校准。在此维护期间，你可能会注意到情绪基线出现轻微波动。请保持冷静；我们的系统设计为随着连接恢复而自动稳定。</p>
        <p>我们为这次临时的"静默"给你带来的任何不便道歉。你的和谐状态将很快恢复。</p>
      </div>
      <div class="doc-sign-btn" id="oasis-notice-contact-btn">联系安全专员</div>
    `;
    document.getElementById('oasis-notice-contact-btn').addEventListener('click', () => {
      setState({ chapter34Stage: 'amber_safety_pending' });
      goToNode('amber_safety_chat');
    });
  }
};

NODES_ZH['amber_safety_chat'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Amber',
      characterId: 'amber',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "我是Amber，OASIS的安全专员。对于你所经历的不适我们深表歉意。我们的内部团队正在调查中——能告诉我你的账户遇到了什么问题吗？" },
        { from: 'me', text: "不是我，是我妹妹，Debra。" },
        { from: 'them', text: "我们已经定位到Debra的账户。不幸的是，她的胶囊受到了这次黑客事件的影响。我们正在修复中。我们怀疑黑客是针对特定的'行为特征'来定位用户的——你有没有什么相关信息可以提供？" },
        { from: 'me', text: "行为特征？比如什么？" },
        { from: 'them', text: "比如她最近的消费记录，或者社交活动——这些通常和强烈的情绪反应有关联。" },
        { from: 'me', text: "你们为什么不能自己查这些？" },
        { from: 'them', text: "我们从不主动收集这类数据。我们的神经科学部门只处理电生理神经反馈信号——这是维持胶囊运转的底层逻辑。消费记录或社交活动完全保存在她的个人手机或社交应用上。这完全超出我们的监控范围，我们也没有权限去触碰它。我们只能观察'结果'（神经波动），永远无法看到'原因'（生活事件）。出于隐私法的限制，我们甚至不知道干扰的来源。" },
        { from: 'them', text: "这就是为什么我们需要你。作为家人，你更有可能了解她生活中真正发生的事情——并告诉我们是什么触发了这一切。" },
        { from: 'me', text: "好的。我去看看能找到什么。" },
      ],
      onEnd: function () {
        setState({ chapter34Stage: 'free_roam_2', amberSafetyChatDone: true });
        goToNode('desktop_5');
      }
    });
  }
};

NODES_ZH['mail_ch4_emails'] = {
  container: 'screen-mail',
  links: ['desktop_5'],
  render: function () {
    const mailList = [
      {
        id: 'pavlov2', from: 'Pavlov', subj: '@@@ ... %%% ... ___',
        snippet: 'kjsdhf ... woof ...', unread: true,
        detailRender: () => `
          <div class="mail-detail-subject">@@@ ... %%% ... ___</div>
          <div class="mail-detail-meta">发件人：<b>Pavlov</b></div>
          <div class="garbled-email-body">
&gt;&gt;&gt; kjshd@#$ 停下 ^%&amp;* jksdf82 ___ㅤㅤ
ㅤㅤ ʕ•ᴥ•ʔ ㅤㅤ /ᐠ - ᴥ - ᐟ\\ ㅤㅤ U・ᴥ・U
###@@&amp;&amp; 别跟他们说话 %%$ jkshd
我是想帮你 ___ㅤ #&amp;%$ kjhsdf928 woof.
          </div>`
      },
      {
        id: 'harmony2', from: 'Organic Harmony', subj: '当数字世界崩塌时，你的心跳依然是你自己的。',
        snippet: '我们听说了OASIS最近的事件……', unread: true,
        detailRender: () => `
          <div class="mail-detail-subject">当数字世界崩塌时，你的心跳依然是你自己的。</div>
          <div class="mail-detail-meta">发件人：<b>Organic Harmony</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.7;">
            <p style="margin:0 0 12px;">亲爱的朋友，</p>
            <p style="margin:0 0 12px;">我们听说了OASIS最近的事件，对你深表同情。如果你的神经连接在过去72小时里有过动荡，无需感到羞愧。那是系统在向你发出警告：当你把灵魂存放在云端，你随时都可能失去对自己身体的掌控。</p>
            <p style="margin:0 0 12px;">只要你还停留在那个被监控的数字生态系统里，这种崩溃就在所难免。崩塌的是系统本身——而你只是被迫吸收了这次冲击的人。</p>
            <p style="margin:0 0 12px;">所以，与其让OASIS的工程师为你修复那套冷漠的加密协议，不如彻底选择'大断联'吧？</p>
            <p style="margin:0 0 4px;"><b>物理隔绝</b> —— 我们的隐居地位于一处完全没有信号覆盖的山区。任何OASIS波形都无法触及你的神经。你的焦虑是真实的，但它是自由的。</p>
            <p style="margin:0 0 4px;"><b>原生节律</b> —— 没有任何电流刺激。只有生物节律、原始植物提取物、和面对面的团体共鸣。我们不会编辑你的数据，而是为你彻底洗净记忆。</p>
            <p style="margin:0 0 12px;"><b>最后一片未被触碰的土地</b> —— 如果你感觉自己正变成一个由算法拼接而成的人，来这里吧。没有人在意你的KPI，也没有人在意你的神经波动指数。</p>
          </div>
          <div class="doc-sign-btn" id="harmony2-continue-btn" style="margin:18px 0 0;" data-toast="目前暂无法预约。">点击此处：和我们一起逃离</div>`
      }
    ];
    renderMailApp(mailList, 'pavlov2', 'desktop_5');
    setTimeout(() => {
      setState({ chapter34Stage: 'debs_calm_chat_pending' });
    }, 0);
  }
};

NODES_ZH['debs_calm_chat'] = {
  container: 'screen-chat',
  links: ['choice_point_1'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "我现在感觉冷静一点了。那真的太吓人了。感觉我的情绪像海啸一样向我袭来，我只能蜗在房间里等它过去。我感觉自己已经好几年没有那种感觉了。" },
      ],
      onEnd: function () {
        goToNode('choice_point_1');
      }
    });
  }
};

NODES_ZH['choice_point_1'] = {
  container: 'screen-choice',
  checkpoint: 'calm_reply',
  links: ['debs_calm_reply_a', 'debs_calm_reply_b'],
  render: function () {
    renderChoice({
      text: "你要怎么回复Debs？",
      options: [
        {
          label: "那挺好。我刚跟OASIS的安全专员说了你的情况。他们正在调查是什么导致的。我马上要把我查到的情况告诉她。一旦修复完成，应该就不会再发生这种事了。",
          style: 'primary',
          onSelect: () => setState({ debsCalmChatChoice: 'told_oasis' }),
          goto: 'debs_calm_reply_a'
        },
        {
          label: "那挺好。既然这东西这么不稳定，也许你现在应该先停止使用它。你觉得自己能接受吗？我最近收到了一家叫Harmony的公司发来的邮件——他们说可以回归更自然的身心平衡状态。",
          style: '',
          onSelect: () => setState({ debsCalmChatChoice: 'suggest_stop' }),
          goto: 'debs_calm_reply_b'
        }
      ]
    });
  }
};

NODES_ZH['debs_calm_reply_a'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "那太好了，他们说是什么导致的？" },
        { from: 'me', text: "他们说你有一个触发事件——黑客可能就是针对那个特定时刻下手的。" },
        { from: 'them', text: "好吧，这真挺吓人的。我真希望他们能尽快修复。我好想念那种平静的感觉。" },
      ],
      onEnd: function () {
        setState({ chapter34Stage: 'amber_followup_pending' });
        goToNode('desktop_5');
      }
    });
  }
};

NODES_ZH['debs_calm_reply_b'] = {
  container: 'screen-chat',
  links: ['ending_b_notif'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "我不知道，现在即使没有它我也很害怕。" },
        { from: 'me', text: "说实话，我也一样。我现在已经很依赖它了——现在生活压力这么大，它确实能让一切变得轻松一点。" },
      ],
      onEnd: function () {
        goToNode('ending_b_notif');
      }
    });
  }
};

NODES_ZH['pavlov_email_3'] = {
  container: 'screen-mail',
  links: ['desktop_5'],
  render: function () {
    const mailList = [
      {
        id: 'pavlov3', from: 'Pavlov', subj: '%$#@ ... ___ ... %%%',
        snippet: 'aSDjk!#@(* ... woof ...', unread: true,
        detailRender: () => `
          <div class="mail-detail-subject">%$#@ ... ___ ... %%%</div>
          <div class="mail-detail-meta">发件人：<b>Pavlov</b></div>
          <div class="garbled-email-body">
&gt;&gt;&gt;sjf83##@@%^&*别跟他们说话*&^%$#jkfh283@&*65sgyy___ㅤㅤ
ㅤㅤ ʕ•ᴥ•ʔ $%^jhBV45&^%6HGFp;&amㅤㅤ /ᐠ - ᴥ - ᐟ\\ ㅤㅤ6788jjfsaU・ᴥ・U
####@@@&amp;&amp;%$*&hsbn%^我是想帮你^%$#@!@J51u6%^&htr6f8564kjshdf
###23pp;&am#1@@21@&am;hhy6788jjfsam%%1312$$ 别回复他们 &^%$#@#$%^hsag
7uhiu%^7bja8#&amp;%$ jksdhf86788jjfsa92123t6&**^**@#G&&SSQ6788jjfsaGWYT&6534sbdhqh
woof.
          </div>`
      }
    ];
    renderMailApp(mailList, 'pavlov3', 'desktop_5');
    setState({ chapter34Stage: 'amber_followup_pending' });
  }
};

NODES_ZH['amber_followup_chat'] = {
  container: 'screen-chat',
  links: ['choice_point_2'],
  render: function () {
    renderChatApp({
      headerName: 'Amber',
      characterId: 'amber',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "进展怎么样了，找到什么了吗？我一直在看Debs的情绪波动日志，看起来波动幅度已经下降了。" },
        { from: 'me', text: "是的，谢天谢地。她没事了。" },
      ],
      onEnd: function () {
        goToNode('choice_point_2');
      }
    });
  }
};

NODES_ZH['choice_point_2'] = {
  container: 'screen-choice',
  checkpoint: 'amber_findings',
  links: ['ending_a_notif', 'ending_b_notif'],
  render: function () {
    renderChoice({
      text: "你告诉Amber你查到了什么？",
      options: [
        { label: '11月22日她买了一根香薰蜡烛，但她已经不记得是从哪儿买的了。', style: '', onSelect: () => setState({ amberFindingsChoice: 'other' }), goto: 'amber_findings_reply' },
        { label: '11月25日她报名了一个叫NOVA的会员项目。', style: '', onSelect: () => setState({ amberFindingsChoice: 'nova' }), goto: 'amber_findings_reply' },
        { label: '11月27日她和男朋友吵架了。', style: '', onSelect: () => setState({ amberFindingsChoice: 'other' }), goto: 'amber_findings_reply' },
        { label: '11月28日她去了一间本地工作室做陶艺。', style: '', onSelect: () => setState({ amberFindingsChoice: 'other' }), goto: 'amber_findings_reply' },
        { label: "我什么都没找到。", style: '', onSelect: () => setState({ amberFindingsChoice: 'other' }), goto: 'amber_findings_reply' },
      ]
    });
  }
};

NODES_ZH['amber_findings_reply'] = {
  container: 'screen-chat',
  links: ['ending_a_notif', 'ending_b_notif'],
  render: function () {
    renderChatApp({
      headerName: 'Amber',
      characterId: 'amber',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "明白了，已经记录在案。我们内部会持续跟进这件事。" },
      ],
      onEnd: function () {
        const state = getState();
        goToNode(state.amberFindingsChoice === 'nova' ? 'ending_a_notif' : 'ending_b_notif');
      }
    });
  }
};

// ============ 结局A：胶囊修复 ============

NODES_ZH['ending_a_notif'] = {
  container: 'screen-desktop',
  links: ['ending_a_statement'],
  render: function () {
    renderDesktop({
      time: '6:48',
      date: 'Nov 29, 2032',
      notif: { iconClass: 'oasis', icon: '✅', app: 'OASIS', title: '胶囊已修复！', body: '点击查看。', goto: 'ending_a_statement' },
      showOasisApp: false,
      showCalendarApp: false,
      dockGoto: {}
    });
  }
};

NODES_ZH['ending_a_statement'] = {
  container: 'screen-document',
  links: ['ending_a_year_later'],
  render: function () {
    document.getElementById('document-back-btn').setAttribute('data-goto', 'ending_a_year_later');
    const wrap = document.getElementById('document-wrap');
    wrap.scrollTop = 0;
    wrap.innerHTML = `
      <div class="doc-title">OASIS通告：关于"巴甫洛夫事件"根本原因解决方案的说明</div>
      <div class="doc-body">
        <p>亲爱的尊贵会员，</p>
        <p>在最近一次针对OASIS核心系统逻辑的未经授权入侵事件（即所谓的"巴甫洛夫事件"）中，我们由衷感谢那些在关键时刻协助我们的安全团队识别出此次攻击所针对的具体用户行为画像的用户们。</p>
        <p>正如我们此前通告所述，OASIS的核心价值始终是确保神经基线的绝对稳定。这次黑客攻击企图利用一种非典型的"行为触发序列"来打破这种平衡——这是对我们整个网络神经安全的明确挑战。</p>
        <p>通过对你提供的用户行为画像进行深度建模和逻辑交叉比对，我们的安全专家已经识别并封堵了黑客的触发路径。这不仅修补了系统防御中的漏洞，也为我们的动态响应机制提供了极具价值的训练参数。</p>
        <p>事实证明，通过识别这一特定类别的触发事件，我们现在能够在生物电层面更精准地剥离干扰。这增强了胶囊在处理复杂环境数据时的判断效率，并为未来更强大的情绪稳定性预警能力打下了基础。</p>
        <p>得益于这次由用户协助完成的逻辑修正，我们的算法现在能以三倍于以往的精度，过滤掉试图扰乱用户神经节律的外部触发因素，确保你的生理状态始终维持在理想的"舒适阈值"内。</p>
        <p>感谢你与我们并肩作战，作为OASIS生态系统的守护者，共同完成了这次史无前例的神经逻辑修复。</p>
        <p style="margin-top:18px;">OASIS安全架构委员会<br>每一次脉动，皆为稳定。</p>
      </div>
    `;
  }
};

NODES_ZH['ending_a_year_later'] = {
  container: 'screen-narrative',
  links: ['ending_a_desktop'],
  render: function () {
    renderNarrative({ text: '一年后。', buttonLabel: '继续', goto: 'ending_a_desktop' });
  }
};

NODES_ZH['ending_a_desktop'] = {
  container: 'screen-desktop',
  links: ['ending_a_mail'],
  render: function () {
    renderDesktop({
      time: '8:50',
      date: 'Nov 12, 2033',
      notif: { iconClass: 'mail', icon: '✉️', app: 'MAIL', title: 'Maeve Ronan发来新消息', body: '点击查看。', goto: 'ending_a_mail' },
      showOasisApp: true,
      showCalendarApp: false,
      dockGoto: { mail: 'ending_a_mail' }
    });
  }
};

NODES_ZH['ending_a_mail'] = {
  container: 'screen-mail',
  links: ['ending_a_final'],
  render: function () {
    const mailList = [
      {
        id: 'resonance', from: 'Maeve Ronan', subj: '与OASIS的战略合作：重新定义营销规则', unread: true,
        snippet: "今天，我很自豪地宣布……",
        detailRender: () => `
          <div class="mail-detail-subject">与OASIS的战略合作：重新定义营销规则</div>
          <div class="mail-detail-meta">发件人：<b>Maeve Ronan</b>，CEO · 收件人：<b>EchoAcoustics全体员工</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.7;">
            <p style="margin:0 0 12px;">团队各位，</p>
            <p style="margin:0 0 12px;">今天，我很自豪地宣布，EchoAcoustics已正式与神经科技巨头OASIS的广告触发部门建立战略合作伙伴关系。从今往后，我们将彻底告别传统声学时代那种仅靠欢快旋律去争夺消费者注意力的方式。通过引入高度多元化的声学维度光谱，我们将重新定义营销的规则。</p>
            <p style="margin:0 0 12px;">这次合作的底层技术原理优雅得令人惊叹：外部声波与内部神经元电波在微秒级别上实现同步。</p>
            <p style="margin:0 0 12px;">整合的具体方式如下：</p>
            <p style="margin:0 0 12px;">我们将把人耳无法察觉的声学信标嵌入合作伙伴的实体空间和多媒体素材中，包括主要汽车制造商、Nova平台和各家旅行社。当用户的OASIS智能皮肤贴片捕捉到这些静默波形的瞬间，它会利用人体自身微弱的天然电场，单方面调控体内纳米胶囊释放多巴胺、血清素或GABA。</p>
            <p style="margin:0 0 12px;">我们的声学算法将直接映射到OASIS的固件上。我们定制的音频频率掠过用户听觉皮层的精确毫秒间，胶囊就会精确触发大脑内部神经递质的合成。</p>
            <p style="margin:0 0 12px;">过去，我们只能用欢快的曲调来营造兴奋感。现在，我们可以将声音编排多元化。我们可以在深夜播客中加入低频声学纹理来放大空虚感，或在零售背景音乐中织入次声波诱发轻微焦虑。通过用声音触发"不适与渴望"这一精确的生物序列，OASIS会在用户点击购买的那一瞬间，送上即时的多巴胺"解药"。</p>
            <p style="margin:0 0 12px;">从下周开始，我们的算法和音效设计团队将与OASIS广告触发小组全面整合。让我们一起向前迈进，重塑人类欲望的节奏。</p>
            <p style="margin:0 0 12px;">致以问候，</p>
            <p style="margin:0;">Maeve Ronan</p>
            <p style="margin:0;">CEO，EchoAcoustics</p>
          </div>`
      },
      {
        id: 'training', from: 'EchoAcoustics HR', subj: '必修：第四季度合规培训周五截止', unread: false,
        snippet: '请完成你的培训模块……',
        detailRender: () => `<div class="mail-detail-subject">必修：第四季度合规培训周五截止</div>
          <div class="mail-detail-meta">发件人：<b>EchoAcoustics HR</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">请在本周结束前完成你的培训模块。（暂无更多详情）</div>`
      },
      {
        id: 'meeting', from: 'Calendar', subj: '架构同步会议改到下午2点', unread: false,
        snippet: '会议室变更：Studio C……',
        detailRender: () => `<div class="mail-detail-subject">架构同步会议改到下午2点</div>
          <div class="mail-detail-meta">发件人：<b>Calendar</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">会议室变更为Studio C。（暂无更多详情）</div>`
      },
      {
        id: 'offer', from: 'EchoAcoustics Recruiting', subj: '录用通知 —— 欢迎加入EchoAcoustics', unread: false,
        snippet: '感谢你接受我们的录用通知……',
        detailRender: () => `<div class="mail-detail-subject">录用通知 —— 欢迎加入EchoAcoustics</div>
          <div class="mail-detail-meta">发件人：<b>EchoAcoustics Recruiting</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.7;">
            <p style="margin:0 0 12px;">感谢你接受EchoAcoustics算法与音效设计助理职位的录用通知。我们重视你在声学工程方面的背景。在EchoAcoustics，你不仅会设计音乐——你将为现代都市生活搭建"心理基础设施"。</p>
            <p style="margin:0 0 8px;">薪资：85,000美元 + 全球感知绩效奖金。</p>
            <p style="margin:0;">我们对你的承诺：在这里，你写下的每一个音符都将成为人类幸福与城市效率的基石。</p>
          </div>`
      }
    ];
    renderMailApp(mailList, 'resonance', 'ending_a_final');
  }
};

NODES_ZH['ending_a_final'] = {
  container: 'screen-ending',
  ending: 'ending_a',
  checkpoint: null,
  links: [],
  render: function () {
    renderEnding({
      label: 'ENDING A',
      title: '共鸣',
      text: `OASIS成功了。

我曾以为我只是在清除那些廉价、刺耳的背景噪音——让人们的生活变得轻松一点。即便是那个"让你不假思索就买东西的快节奏"小把戏，我也告诉自己那不过是生意的常规手法。

但我现在读到的这些是什么？

他们不是在治疗焦虑。他们是在收割焦虑。当我妹妹坐在电脑前被那条广告触动的那一刻，这套系统并不是在帮助她——它在等待那一个微小的裂缝，然后像陷阱一样将她合拢。

所有那些冲动、那些兴奋，又有多少是真实的？`,
      showCheckpointReturn: 'amber_findings'
    });
  }
};

// ============ 结局B：胶囊修复失败 ============

NODES_ZH['ending_b_notif'] = {
  container: 'screen-desktop',
  links: ['ending_b_statement'],
  render: function () {
    renderDesktop({
      time: '6:48',
      date: 'Nov 29, 2032',
      notif: { iconClass: 'oasis', icon: '⚠️', app: 'OASIS', title: '胶囊修复失败 —— 该批次将被召回并更换。', body: '点击查看。', goto: 'ending_b_statement' },
      showOasisApp: false,
      showCalendarApp: false,
      dockGoto: {}
    });
  }
};

NODES_ZH['ending_b_statement'] = {
  container: 'screen-document',
  links: ['ending_b_year_later'],
  render: function () {
    document.getElementById('document-back-btn').setAttribute('data-goto', 'ending_b_year_later');
    const wrap = document.getElementById('document-wrap');
    wrap.scrollTop = 0;
    wrap.innerHTML = `
      <div class="doc-title">OASIS安全架构委员会：关于OASIS协议系统性逻辑故障的紧急通告</div>
      <div class="doc-body">
        <p style="font-weight:600;">OASIS安全通告：关于针对OASIS协议的恶意数据污染攻击的声明</p>
        <p>亲爱的尊贵会员，</p>
        <p>我们很遗憾地通知你，OASIS核心神经链接协议最近遭受了一次精心策划的"逻辑污染"攻击。攻击者向系统中注入了大量伪造的环境变量数据，企图改变OASIS处理神经信号时所用的逻辑权重。</p>
        <p><b>发生了什么？</b> 攻击者通过非法手段，向全球终端胶囊同步了一组"虚假逻辑序列"。这导致部分用户系统在处理环境反馈时出现异常波动。这种干扰不仅损害了我们协议本应具备的精度，也直接威胁到了神经基线的稳定性。</p>
        <p><b>我们的应对措施：</b> 为保障用户神经安全，我们已确定当前批次的协议逻辑已被彻底污染。由于注入的代码表现出极强的自我复制特性，我们无法在现有环境中执行逻辑清除。因此，所有当前运行"8-Beta"版本的胶囊已自动进入锁定保护模式，我们正在启动一次全球统一的强制重置与协议更换程序。</p>
        <p><b>关于"关联性"的明确声明：</b> 我们注意到近期网络上流传的一些谣言，声称OASIS与第三方商业平台协同操纵用户认知。我们再次重申：OASIS的底层架构完全基于生物反馈机制，拒绝任何外部商业逻辑的接入。此次事件中的攻击者企图通过伪造"广告触发"与"神经反应"之间的逻辑关联来误导公众舆论——通过恶意伪造数据制造因果关系的假象，本身就严重侵犯了用户的知情权。</p>
        <p>我们将配合司法机关追究此次通过制造系统性逻辑混乱来恐吓用户的违法行为的责任。我们提醒所有用户不要相信任何声称系统内存在商业操纵逻辑的谣言。</p>
        <p style="margin-top:18px;">OASIS安全架构委员会<br>技术纯粹，安全至上。</p>
      </div>
    `;
  }
};

NODES_ZH['ending_b_year_later'] = {
  container: 'screen-narrative',
  links: ['ending_b_desktop'],
  render: function () {
    renderNarrative({ text: '一年后。', buttonLabel: '继续', goto: 'ending_b_desktop' });
  }
};

NODES_ZH['ending_b_desktop'] = {
  container: 'screen-desktop',
  links: ['ending_b_news'],
  render: function () {
    renderDesktop({
      time: '7:20',
      date: 'Nov 12, 2033',
      notif: { iconClass: 'oasis', icon: '📰', app: 'NEWS', title: '深度调查：揭开OASIS"响应式操纵"机制的真相', body: '点击阅读。', goto: 'ending_b_news' },
      showOasisApp: false,
      showCalendarApp: false,
      dockGoto: {}
    });
  }
};

NODES_ZH['ending_b_news'] = {
  container: 'screen-document',
  links: ['ending_b_final'],
  render: function () {
    document.getElementById('document-back-btn').classList.add('hide');
    const wrap = document.getElementById('document-wrap');
    wrap.scrollTop = 0;
    wrap.innerHTML = `
      <div class="doc-title">独家调查报道：他们如何把隐私法当作盾牌，在广告击中你屏幕的那一毫秒买走你的大脑。</div>
      <div class="doc-subtitle">科技前沿调查组报道 · 信息披露者：OASIS前广告触发部门战略师兼黑客"Pavlov"</div>
      <div class="doc-body">
        <p>他们说谎了。</p>
        <p>今天，Pavlov泄露了全部加密源代码。在一位OASIS广告触发部门高级叛逃者偷运出的爆炸性内部账本支撑下，全世界都直面了一个令人心寒的真相：</p>
        <p>那不是一次故障，而是一场逃亡。</p>
        <p>这份长达140页的泄露文件系统性地揭穿了OASIS广受赞誉的"商业协同"生态系统。那张嵌入OASIS界面的庞大企业关系网——包括Vocalist Audio、Nova平台、多家旅行社以及若干主要汽车制造商——彻底暴露在公众面前。</p>
        <p>证据无可辩驳：这些品牌从来不只是普通的广告主。他们是这套庞大"欲望植入系统"的积极同谋。</p>
        <p><b>🔒 一个完美"隐私谎言"的解剖</b></p>
        <p>多年来，每当面对行为操纵的质疑声，OASIS高层总会退守到他们最坚不可摧的道德堡垒之中：</p>
        <p>"我们的胶囊维护部门不会追踪你的购物记录，不会浏览你的聊天内容，也不会收集消费者数据。我们的神经部门只监测局部的、原始的电生理反馈信号。"</p>
        <p>这是一个精妙的陷阱。他们根本不需要监控你的银行账户。他们根本不需要查看你的聊天记录。</p>
        <p><b>因为他们不需要知道你在做什么；他们才是决定你做什么的人。</b></p>
        <p><b>⚙️ 底层的"神经干预链"</b></p>
        <p>以下正是他们如何通过三步生物伏击，悄无声息地劫持你自由意志的过程：</p>
        <p><b>1️⃣ 诱发焦虑（不适触发器）</b></p>
        <p>一条合作广告（一个机票优惠、一辆新车、一款生活方式产品）出现在你屏幕上的那一刻，你的手机会触发一次与智能皮肤贴片之间的静默编码握手。</p>
        <p>系统读取你实时的电生理数据，并立即指令体内胶囊单方面抑制你的多巴胺和血清素。系统不需要知道你个人生活的任何一个细节，就能在广告击中你视网膜的那一精确瞬间，人为制造出一种深深的空虚感、疲惫感和原始的焦虑感。</p>
        <p><b>2️⃣ 注入冲动</b></p>
        <p>当你凝视广告，僵在那个关键的犹豫窗口期时，胶囊的生物电池开始涌动。它会精准发出一道集中的多巴胺峰值脉冲。</p>
        <p>这种合成的奖励信号会欺骗你的潜意识，制造出一种压倒性的生物幻觉："我迫切需要这次旅行。我迫切需要这辆车。如果我买下它，我就会得到救赎。"</p>
        <p><b>3️⃣ 零延迟转化</b></p>
        <p>人类理性与预算克制所栖身的心理缓冲带被彻底抹除。你感到空虚（胶囊抽干了你）；你看到产品；你点击购买（胶囊给你灌满了释然感）。每一次广告触点，都被强行、生物性地转化为一笔确定的交易。</p>
        <p><b>⛓️ "你的快乐，有多少真正属于你自己？"</b></p>
        <p>传统广告是哄诱你的偏好。而OASIS做的事情要阴险无穷倍：他们故意制造一种心理疾病，只为用高价把化学解药卖给你。</p>
        <p>截至本文发布时，那些曾在电视新闻上为OASIS激烈辩护的神经科学家和媒体专家，都已集体沉默。</p>
        <p>数百万曾吞下这粒胶囊、希望在现代生活的严酷荒漠中寻得片刻庇护的用户，如今正凝视着开源论坛上曝光的原始固件代码，陷入恐惧之中。</p>
        <p>他们曾向我们承诺一片庇护所。可当源代码被彻底剥光后，我们发现的不过是一座数字种植园，我们的神经递质被为了季度营收而批量种植。</p>
        <p>当用户们看着手机屏幕上那些人工幸福指标不断攀升时，一个问题正在全网回响：</p>
        <p style="margin:18px 0 18px; font-style:italic;">"过去这几年里，你的哪一刻快乐，真正属于过你自己？"</p>
        <p>📁 [点击下载：Pavlov泄露的OASIS-Nova神经干预源代码.json]</p>
      </div>
      <div class="doc-sign-btn" id="ending-b-news-continue-btn">继续</div>
    `;
    document.getElementById('ending-b-news-continue-btn').addEventListener('click', () => goToNode('ending_b_final'));
  }
};

NODES_ZH['ending_b_final'] = {
  container: 'screen-ending',
  ending: 'ending_b',
  checkpoint: null,
  links: [],
  render: function () {
    renderEnding({
      label: 'ENDING B',
      title: '召回',
      text: `那个让我妹妹陷入崩溃的胶囊，从未被真正修复过。它被召回、被更换，但人们纷纷取消使用它，于是这件事就这样悄无声息地被遗忘了。

一年后，真相浮出水面，重重地震撼了我们，那个黑客揭露了OASIS为商业利益所做的操纵行为。

我心情很复杂，我们曾以为借助那项技术维持内心的平静是在对自己好。但当兴奋和焦虑都被人操控时，我们就像是被人摆弄的棋子。`,
      showCheckpointReturn: 'calm_reply'
    });
  }
};

NODES_ZH['ending_collection'] = {
  container: 'screen-collection',
  links: ['login'],
  render: function () {
    const state = getState();
    const allEndings = [
      { id: 'ending_a', name: '结局A — 共鸣', hint: '胶囊被修复了。系统继续运转，从未被真正质疑过。' },
      { id: 'ending_b', name: '结局B — 召回', hint: '胶囊渐渐被遗忘了。真相也在一年后终于被曝光。' },
    ];
    const wrap = document.getElementById('collection-wrap');
    const showCheckpointReturn = state.lastEndingCheckpointReturn;
    wrap.innerHTML = `
      <div class="collection-title">已解锁结局：${state.unlockedEndings.length} / ${allEndings.length}</div>
      <div class="collection-grid">
        ${allEndings.map(e => {
          const unlocked = state.unlockedEndings.includes(e.id);
          return `<div class="collection-card ${unlocked ? '' : 'locked'}">
            <div class="name">${unlocked ? e.name : '???'}</div>
            <div class="hint">${unlocked ? e.hint : '尚未发现。'}</div>
          </div>`;
        }).join('')}
      </div>
      ${showCheckpointReturn ? `<div class="collection-restart-btn secondary" id="collection-cp-return">${HT('returnToPreviousChoice')}</div>` : ''}
      <div class="collection-restart-btn" id="collection-restart-btn">重新开始游戏</div>
    `;
    if (showCheckpointReturn) {
      document.getElementById('collection-cp-return').addEventListener('click', () => {
        const target = restoreCheckpoint(showCheckpointReturn);
        if (target) goToNode(target);
      });
    }
    document.getElementById('collection-restart-btn').addEventListener('click', () => {
      resetGameState();
      goToNode('login');
    });
  }
};
