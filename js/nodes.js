/* ============================================================
   nodes.js — 全部节点数据
   每个节点：{ container, links: [跳转目标的合集，用于断链检测], render() }
   container 必须是 index.html 里14个通用容器之一的 id。
   links 数组里列出这个节点"理论上可能跳转到"的所有目标节点id，
   即使是在用户选择/点击后才决定跳转的，也要列全，断链检测才准确。
   ============================================================ */

const NODES_EN = {};

/* ============================================================
   组0：序章 1-8（已有节点，从旧原型迁移到新架构）
   ============================================================ */

NODES_EN['login'] = {
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

NODES_EN['desktop_1'] = {
  container: 'screen-desktop',
  links: ['mail_vocalist', 'friends_feed', 'oasis_app_login', 'calendar_app'],
  render: function () {
    renderChapter1Desktop('9:41', 'Nov 8, 2032');
  }
};

NODES_EN['mail_vocalist'] = {
  container: 'screen-mail',
  links: ['desktop_2', 'oasis_website'],
  render: function () {
    setState({ mailNotifSeen: true });
    const state = getState();
    const mailList = [
      {
        id: 'vocalist', from: 'VOCALIST', subj: 'Your order has shipped!',
        snippet: 'Tracking info inside...', unread: true,
        detailRender: () => `
          <div class="mail-detail-subject">Your order has shipped!</div>
          <div class="mail-detail-meta">From: <b>VOCALIST</b> · To: <b>${state.playerName || 'you'}</b><br>Order placed: <b>Nov 5, 2032</b></div>
          <div class="order-card">
            <div class="brand">VOCALIST</div>
            <div class="order-row"><span>Item</span><b>VOCALIST Speakers Set — Walnut Edition</b></div>
            <div class="order-row"><span>Order date</span><b>November 5, 2032, 21:04</b></div>
            <div class="order-row"><span>Estimated delivery</span><b>November 9, 2032</b></div>
            <div class="order-row"><span>Shipping to</span><b>Campus Residence Hall B Room 504A</b></div>
            <span class="status-pill">SHIPPED</span>
          </div>`
      },
      {
        id: 'oasis-sub', from: 'OASIS', subj: 'Your subscription renews next month',
        snippet: 'Manage your plan anytime...', unread: true,
        detailRender: () => `<div class="mail-detail-subject">Your subscription renews next month</div>
          <div class="mail-detail-meta">From: <b>OASIS</b> · To: <b>${state.playerName || 'you'}</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">Your OASIS subscription will renew automatically next month. Manage your plan, billing, and preferences anytime.</div>
          <div style="margin-top:14px; font-size:13.5px;">
            <span data-goto="oasis_website" style="color:var(--ios-blue); text-decoration:underline; cursor:pointer;">Visit OASIS.com →</span>
          </div>`
      },
      {
        id: 'harmony1', from: 'Organic Harmony', subj: 'We don’t believe in “neural baselines”',
        snippet: 'Your anxiety, your breakdowns, even what you feel...', unread: true,
        detailRender: () => `<div class="mail-detail-subject">We don't believe in "neural baselines"</div>
          <div class="mail-detail-meta">From: <b>Organic Harmony</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.7;">
            <p style="margin:0 0 12px;">At Organic Harmony, we don't believe in "neural baselines." Your anxiety, your breakdowns, even everything you feel alone at night — that's part of your soul. We don't need your data. We need <b>Reconnection</b>.</p>
            <p style="margin:0 0 12px;">Our Offline Therapy completely avoids every digital network:</p>
            <p style="margin:0 0 4px;"><b>Digital-Free Healing Center</b> — our base sits deep in remote mountains, with no WiFi or cellular signal of any kind, shielding you from every electronic pulse.</p>
            <p style="margin:0 0 4px;"><b>Native Cognitive Restoration</b> — through ancient meditation, plant-derived neurotransmitters, and group breathwork, we help you fully clear away the "digital residue" OASIS left behind.</p>
            <p style="margin:0 0 12px;"><b>Reclaim What's Real</b> — no more technological intervention, no more electrical compensation. Just you and your raw connection to nature.</p>
            <p style="margin:0 0 12px;">Join us, and sever OASIS's control chain for good. This may be your only chance to take your life back.</p>
          </div>
          <div style="margin-top:6px; display:flex; flex-direction:column; gap:10px;">
            <div class="doc-sign-btn" style="margin:0;" data-toast="Booking unavailable right now.">Book Now: Return to Your Natural Body</div>
            <div style="text-align:center; font-size:12px; color:var(--ios-text-secondary); text-decoration:underline; cursor:pointer;" data-toast="Article unavailable right now.">Harmony: Why We're the Only True End to OASIS</div>
          </div>`
      },
      {
        id: 'campus', from: 'Campus Housing', subj: 'Reminder: lease renewal deadline',
        snippet: 'Please review your housing...', unread: false,
        detailRender: () => `<div class="mail-detail-subject">Reminder: lease renewal deadline</div>
          <div class="mail-detail-meta">From: <b>Campus Housing</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">Please review your housing contract before the deadline. (no further detail)</div>`
      },
      {
        id: 'bookstore', from: 'Campus Bookstore', subj: '20% off all textbooks this week',
        snippet: 'Stock up before finals...', unread: false,
        detailRender: () => `<div class="mail-detail-subject">20% off all textbooks this week</div>
          <div class="mail-detail-meta">From: <b>Campus Bookstore</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">Stock up before finals. (no further detail)</div>`
      },
      {
        id: 'club', from: 'Photography Club', subj: "This week's meeting moved to Thursday",
        snippet: 'See you at the usual spot...', unread: false,
        detailRender: () => `<div class="mail-detail-subject">This week's meeting moved to Thursday</div>
          <div class="mail-detail-meta">From: <b>Photography Club</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">See you at the usual spot. (no further detail)</div>`
      },
    ];
    renderMailApp(mailList, 'vocalist', 'desktop_2');
  }
};

NODES_EN['desktop_2'] = {
  container: 'screen-desktop',
  links: ['friends_feed', 'mail_vocalist', 'oasis_app_login', 'calendar_app'],
  render: function () {
    renderChapter1Desktop('9:43', 'Nov 8, 2032');
  }
};

NODES_EN['friends_feed'] = {
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
        else showToast('No new story from this friend.');
      });
    });

    const feed = document.getElementById('friends-feed');
    let fakePosts;
    if (isCh4) {
      fakePosts = [
        { id: 'debs', postName: 'debraluvlulu', cap: "made a mug at @Pat-studio today, such a good experience! ", goto: 'debs_profile', img: 'posts/feed_debs_ch4.webp', gradient: 'linear-gradient(135deg,#d8b78a,#a87c52)' },
        ...(adrianUnlocked ? [{ id: 'adrian', cap: "Always good to be outside", goto: null, img: 'posts/feed_adrian_ch4.webp', gradient: 'linear-gradient(135deg,#9aa7b8,#5c6878)' }] : []),
        { id: 'mia', cap: 'Rainy day, perfect for reading', goto: null, img: 'posts/feed_mia_ch4.webp', gradient: 'linear-gradient(135deg,#9fd4d4,#4f8f8f)' },
        { id: 'priya', cap: 'Group project finally submitted 🙏', goto: null, img: 'posts/feed_priya_ch4.webp', gradient: 'linear-gradient(135deg,#d9a8e8,#8b4fae)' },
        { id: 'devon', cap: 'New headphones came in MUSIC ON', goto: null, img: 'posts/feed_devon_ch4.webp', gradient: 'linear-gradient(135deg,#f0c674,#c98a2c)' },
      ];
    } else if (isCh2) {
      fakePosts = [
        ...(adrianUnlocked ? [{ id: 'adrian', cap: "Blue is the best color", goto: 'adrian_profile', img: 'posts/feed_adrian_ch2.webp', gradient: 'linear-gradient(180deg,#2a2d3a,#1a1c24)' }] : []),
        { id: 'mia', cap: 'Always fun w my gal @queeeen02', goto: null, img: 'posts/feed_mia_ch2.webp', gradient: 'linear-gradient(135deg,#7ec8e3,#3a6ea5)' },
        { id: 'jordan', cap: "Luvingggg", goto: null, img: 'posts/feed_jordan_ch2.webp', gradient: 'linear-gradient(135deg,#9fd49a,#3f8f5c)' },
        { id: 'priya', cap: 'late night run', goto: null, img: 'posts/feed_priya_ch2.webp', gradient: 'linear-gradient(135deg,#d9a8e8,#8b4fae)' },
        { id: 'devon', cap: 'Unhinged', goto: null, img: 'posts/feed_devon_ch2.webp', gradient: 'linear-gradient(135deg,#f0c674,#c98a2c)' },
      ];
    } else {
      fakePosts = [
        { id: 'debs', postName: 'debraluvlulu', cap: "w girls @minikait", goto: 'debs_profile', img: 'posts/feed_debs_lulu.webp', gradient: 'linear-gradient(135deg,#8FA3B3,#4A5D6E)' },
        { id: 'mia', cap: 'Finally caught up on sleep 😴', goto: null, img: 'posts/feed_mia_sleep.webp', gradient: 'linear-gradient(135deg,#7ec8e3,#3a6ea5)' },
        { id: 'jordan', cap: "Midterms are kicking my ass lol", goto: null, img: 'posts/feed_jordan_midterms.webp', gradient: 'linear-gradient(135deg,#9fd49a,#3f8f5c)' },
        { id: 'priya', cap: 'Idk what I was looking at lmao', goto: null, img: 'posts/feed_priya_coffee.webp', gradient: 'linear-gradient(135deg,#d9a8e8,#8b4fae)' },
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
        else showToast('Just a regular post — nothing more here.');
      });
    });
  }
};

NODES_EN['shawn_story'] = {
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

NODES_EN['shawn_profile'] = {
  container: 'screen-profile',
  links: ['shawn_chat', 'friends_feed'],
  render: function () {
    const character = getCharacter('shawn');
    renderProfileFeed({
      avatarImg: character.img,
      avatarGradient: character.fallback,
      name: character.name,
      stats: [{ n: 214, l: 'Posts' }, { n: '1.2k', l: 'Friends' }, { n: 980, l: 'Likes' }],
      bio: 'Stay Curious',
      messageTarget: 'shawn_chat',
      backTarget: 'friends_feed',
      posts: [
        {
          dateLabel: 'Nov 7', caption: 'At the gym 💪', likes: 134,
          img: 'posts/shawn_p1_gym.webp', gradient: 'linear-gradient(135deg,#FF9F6B,#FF3B5C)',
          comments: [{ name: 'jordan_t', text: "let's gooo" }, { name: 'mia.l', text: 'show off 🙄' }]
        },
        {
          dateLabel: 'Nov 3', caption: 'Road trip is the best!!!', likes: 89,
          img: 'posts/shawn_p2_roadtrip.webp', gradient: 'linear-gradient(135deg,#7ec8e3,#3a6ea5)',
          comments: [{ name: 'priya92', text: 'where to??' }]
        },
        {
          dateLabel: 'Oct 29', caption: 'Chilling', likes: 201,
          img: 'posts/shawn_p3_vocalist.webp', gradient: 'linear-gradient(160deg,#3a3020,#8a7340)',
          comments: [{ name: 'Ketchup15oz', text: 'What up' }]
        },
        {
          dateLabel: 'Oct 24', caption: 'Always fun with @Nikki_Ling', likes: 76,
          img: 'posts/shawn_p4_brunch.webp', gradient: 'linear-gradient(135deg,#ffe9a8,#e8a87c)',
          comments: [{ name: 'Nikki_Ling', text: 'We should do it again soon!' }]
        },
        {
          dateLabel: 'Oct 20', caption: 'Suit up fr', likes: 112,
          img: 'posts/shawn_p5_semester.webp', gradient: 'linear-gradient(135deg,#9fd49a,#3f8f5c)',
          comments: [{ name: 'Mark_D42', text: 'Dang lookin sharp!' }]
        }
      ]
    });
  }
};

NODES_EN['shawn_chat'] = {
  container: 'screen-chat',
  links: ['shawn_profile'],
  render: function () {
    renderChatApp({
      headerName: 'Shawn921',
      characterId: 'shawn',
      backTarget: 'shawn_profile',
      script: [
        { from: 'me', text: "hey shawn! it's been so long lol" },
        { from: 'them', text: "omg hi!! how are you" },
        { from: 'me', text: "i'm good — saw your story, looks like you're living the life now 👀" },
        { from: 'them', text: "haha i guess things have been good lately" },
        { from: 'me', text: "nice ride there!!" },
        { from: 'them', text: "thank you!! It was really an impluse purchase but hey" },
        { from: 'me', text: "yo gotta enjoy that bad boi" },
        { from: 'me', text: "the job paid you well i see i see" },
        { from: 'them', text: "lmaooo but it gets really busy too" },
        { from: 'them', text: "that oasis really helped me get through the burn outs" },
        { from: 'them', text: "wish this existed back in highschool so i wasn't so stressed abt tests" },
      ]
    });
  }
};

/* ============================================================
   OASIS 官网（从 vocalist 邮件页的 oasis-sub 邮件点击进入）
   ============================================================ */

NODES_EN['oasis_website'] = {
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
          <div class="ws-subheadline ws-subheadline-v2">A sanctuary for your mind, built within your body.</div>
          <div class="ws-section-copy ws-hero-copy">Tired of the endless daily ritual of swallowing handfuls of focus supplements and micronutrient pills?</div>
          <div class="ws-section-copy ws-hero-copy ws-hero-copy-strong">Oasis. One single capsule, your entire emotional ecosystem resolved.</div>
          <div class="ws-cta-row">
            <div class="ws-cta-pill" data-toast="Your reservation has been noted.">Reserve Your Next-Gen Mind Guardian</div>
          </div>
        </div>`,

        // 2. The Problem
        `<div class="ws-section">
          <div class="ws-section-title">Beyond Chemical Fatigue.<br>Welcome to Bio-Tech Precision.</div>
          <div class="ws-compare">
            <div class="ws-compare-col ws-compare-before">
              <div class="ws-compare-visual ws-compare-visual-before">💊🧪💉🧴</div>
              <div class="ws-compare-caption">Before</div>
            </div>
            <div class="ws-compare-col ws-compare-after">
              <div class="ws-compare-visual ws-compare-visual-after"><div class="ws-mini-capsule"></div></div>
              <div class="ws-compare-caption">After</div>
            </div>
          </div>
          <div class="ws-section-copy">Oasis is a visionary micro-medical robot engineered specifically to alleviate depression, target anxiety, and unlock profound cognitive focus. It is not a traditional chemical drug—it is your 24/7, onboard emotional architect.</div>
        </div>`,

        // 3. How It Works
        `<div class="ws-section">
          <div class="ws-section-title">How It Works</div>
          <div class="ws-section-copy">Onboard innovations, recalibrating mind and body.</div>
          <div class="ws-icon-feature-list">
            <div class="ws-icon-feature">
              <div class="ws-icon-feature-icon">⚡</div>
              <div class="ws-icon-feature-title">Clean Energy: Bio-Battery</div>
              <div class="ws-icon-feature-sub">No charging required. Ingest to activate.</div>
              <div class="ws-icon-feature-desc">Once inside the GI tract, Oasis directly utilizes the body's own glucose as fuel to generate autonomous power, ensuring a constant, pure energy stream for the micro-chip.</div>
            </div>
            <div class="ws-icon-feature">
              <div class="ws-icon-feature-icon">👁️</div>
              <div class="ws-icon-feature-title">The Smart Detective: 24/7 Monitoring</div>
              <div class="ws-icon-feature-sub">Sensing your quietest lows.</div>
              <div class="ws-icon-feature-desc">An onboard array of micro-biosensors continuously tracks stress hormone levels and gut microbiome fluctuations in real-time, flagging emotional shifts before they surface.</div>
            </div>
            <div class="ws-icon-feature">
              <div class="ws-icon-feature-icon">🎯</div>
              <div class="ws-icon-feature-title">Pure Precision: Vagus Nerve Stimulation</div>
              <div class="ws-icon-feature-sub">Second-level intervention, straight to the brain.</div>
              <div class="ws-icon-feature-desc">The moment distress is detected, the capsule uses Vagus Nerve Stimulation (VNS) to send subtle, safe electrical impulses up your body's neural hotline, prompting the brain to instantly release dopamine and serotonin.</div>
            </div>
          </div>
        </div>`,

        // 4. Feature In-Depth
        `<div class="ws-section">
          <div class="ws-section-title">Confronting Stress:<br>How Oasis Acts as Your Intelligent Break Pedal.</div>
          <div class="ws-section-copy">When deadlines stack up or a critical presentation looms, your body undergoes an internal crisis: your brain mistakenly senses an ancient predator, instantly triggering the alarm to flood your system with "stress hormones" (cortisol and adrenaline). The result? A racing heart, shallow breath, tense muscles, and a suffocating wave of anxiety.</div>
          <div class="ws-section-copy">In these critical moments, Oasis initiates a three-step decompression protocol:</div>
          <div class="ws-step-list">
            <div class="ws-step">
              <div class="ws-step-icon">🛑</div>
              <div class="ws-step-title">Step 1: Engaging the Body's Brakes</div>
              <div class="ws-step-desc">Oasis fires a precisely calibrated, gentle electrical pulse directly to your vagus nerve—the ultimate biological commander of "rest and digest." The alarm is instantly neutralized; your heart rate slows, and tight muscle fibers begin to ease.</div>
            </div>
            <div class="ws-step">
              <div class="ws-step-icon">🤫</div>
              <div class="ws-step-title">Step 2: Deploying the "Quiet Messenger"</div>
              <div class="ws-step-desc">As the signal reaches the brain, it commands the immediate synthesis and deployment of GABA (gamma-aminobutyric acid). Acting like a gentle librarian in a noisy room, GABA motions a universal "shh" to hyper-active, anxious neurons, silencing cognitive noise.</div>
            </div>
            <div class="ws-step">
              <div class="ws-step-icon">⛓️</div>
              <div class="ws-step-title">Step 3: Cutting the Stress Supply Chain</div>
              <div class="ws-step-desc">With the nervous system pacified, the brain's command center (the hypothalamus) signals the body to halt stress hormone production. Cortisol drops rapidly, and the suffocating weight vanishes.</div>
            </div>
          </div>
          <div class="ws-callout">💡 Oasis doesn't manufacture artificial relaxation. It simply presses the biological switch called "Calm."</div>
        </div>`,

        // 6. Safety & Sustainability
        `<div class="ws-section">
          <div class="ws-section-title">48 hours of gentle companionship.<br>A zero-waste departure.</div>
          <div class="ws-section-copy">Oasis respects the natural cadence of human digestion. One capsule every two days is all it takes. Its departure is just as elegant as its arrival:</div>
          <div class="ws-safety-list">
            <div class="ws-safety-item">
              <div class="ws-safety-title">Fully Bio-Degradable Architecture</div>
              <div class="ws-safety-desc">The structural chassis and micro-circuitry are crafted from fully bio-resorbable materials engineered from elements native to the body—magnesium, zinc, and iron. Once its mission ends, it safely dissolves into beneficial micronutrients.</div>
            </div>
            <div class="ws-safety-item">
              <div class="ws-safety-title">Bio-Nonstick Shielding</div>
              <div class="ws-safety-desc">Any unresorbable micro-elements are jacketed in an ultra-slick, bio-inert nano-coating, ensuring it glides through and exits the digestive system safely, effortlessly, and with zero residual waste.</div>
            </div>
          </div>
        </div>`,

        // 7. Call to Action
        `<div class="ws-hero ws-hero-v2 ws-cta-final-section">
          <div class="ws-cta-final-visual"><div class="ws-mini-capsule"></div><div class="ws-mini-patch"></div></div>
          <div class="ws-headline ws-headline-v2">Oasis.</div>
          <div class="ws-subheadline ws-subheadline-v2">Leave the tech to your body. Leave the sanctuary to your mind.</div>
          <div class="ws-kit-name">Oasis Smart Starter Kit<br><span>Includes 15 two-day capsules + 1 Smart Bio-Patch</span></div>
          <div class="ws-cta-row">
            <div class="ws-cta-pill" data-toast="Welcome to the next generation.">Step Into the Next Generation of Well-Being</div>
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
NODES_EN['debs_profile'] = {
  container: 'screen-profile',
  links: ['desktop_3', 'desktop_5', 'nova_page', 'pat_studio_page'],
  render: function () {
    const state = getState();
    const character = getCharacter('debs');
    if (state.amberSafetyChatDone) {
      setState({ debsProfileViewedCh4: true });
    }

    const lulu = {
      dateLabel: '3 months ago - Pinned', caption: "Lulu❤️ Love&kisses",
      likes: 312, img: 'posts/debs_pinned_lulu.webp', gradient: 'linear-gradient(135deg,#8FA3B3,#4A5D6E)', comments: []
    };

    const ch1Posts = [
      { dateLabel: 'Nov 6', caption: 'trying to get back into journaling', likes: 58, img: 'posts/debs_ch1_p1_journaling.webp', gradient: 'linear-gradient(135deg,#cfd8e3,#9aa7b8)', comments: [{ name: 'mia.l', text: 'proud of you' }] },
      { dateLabel: 'Oct 31', caption: 'halloween was... a lot 🎃', likes: 94, img: 'posts/debs_ch1_p2_halloween.webp', gradient: 'linear-gradient(160deg,#3a1f2a,#8a4a5c)', comments: [{ name: 'jordan_t', text: 'the costume omg' }] },
      { dateLabel: 'Oct 26', caption: 'new candle smells like fall', likes: 47, img: 'posts/debs_ch1_p3_candle.webp', gradient: 'linear-gradient(135deg,#e8a87c,#c97b4a)', comments: [{ name: 'priya92', text: 'name??' }] },
      { dateLabel: 'Oct 21', caption: 'slow sunday', likes: 63, img: 'posts/debs_ch1_p4_sunday.webp', gradient: 'linear-gradient(135deg,#bcd4e6,#8aa9c2)', comments: [{ name: 'mia.l', text: 'same energy' }] },
    ];

    const ch4Posts = [
      {
        dateLabel: 'Nov 28', caption: 'made a mug at @Pat-studio today, such a good experience! <br><span class="post-cta-btn">Click to check out pat-studio →</span>', likes: 71,
        img: 'posts/debs_ch4_p1_pottery.webp', gradient: 'linear-gradient(135deg,#d8b78a,#a87c52)', goto: 'pat_studio_page',
        comments: [{ name: 'mia.l', text: 'omg show me' }]
      },
      {
        dateLabel: 'Nov 25', caption: 'signed up to be NOVA! 🎓<br><span class="post-cta-btn">Click to check out NOVA →</span>', likes: 58,
        img: 'posts/debs_ch4_p2_nova.webp', gradient: 'linear-gradient(135deg,#3a3d4a,#1c1d24)', goto: 'nova_page',
        comments: [{ name: 'priya92', text: 'welcome to join NOVA!' }, { name: 'jordan_t', text: 'you go gurl 💪' }]
      },
      {
        dateLabel: 'Nov 22', caption: 'obsessed with this new candle 🕯️', likes: 39,
        img: 'posts/debs_ch4_p3_candle.webp', gradient: 'linear-gradient(135deg,#e8a87c,#c97b4a)', toast: 'Just a candle she liked — nothing more here.',
        comments: [{ name: 'mia.l', text: "q: where's it from?" }, { name: 'debraluvlulu', text: 'a: local market, forgot to grab a card' }]
      },
      { dateLabel: 'Nov 18', caption: 'needed a slow day', likes: 39, img: 'posts/debs_ch4_p4_slowday.webp', gradient: 'linear-gradient(135deg,#bcd4e6,#8aa9c2)', comments: [{ name: 'priya92', text: 'rest up' }] },
      { dateLabel: 'Nov 14', caption: 'new playlist for the week', likes: 51, img: 'posts/debs_ch4_p5_playlist.webp', gradient: 'linear-gradient(135deg,#c9a8d8,#8a5ca3)', comments: [{ name: 'mia.l', text: 'sending me this' }] },
      { dateLabel: 'Nov 9', caption: 'coffee run with friends ☕', likes: 44, img: 'posts/debs_ch4_p6_coffee.webp', gradient: 'linear-gradient(135deg,#d8c3a5,#a8835a)', comments: [{ name: 'mia.l', text: 'miss you' }] },
    ];

    const posts = state.amberSafetyChatDone
      ? [lulu, ...ch4Posts]
      : [lulu, ...ch1Posts];

    renderProfileFeed({
      avatarImg: character.img,
      avatarGradient: character.fallback,
      name: 'debraluvlulu',
      stats: [{ n: 89, l: 'Posts' }, { n: 340, l: 'Friends' }, { n: '1.6k', l: 'Likes' }],
      bio: 'lulu\'s mom forever 🐾',
      messageTarget: null,
      messageDisabledToast: 'Nothing to send right now.',
      backTarget: state.lastDesktopNode || 'desktop_3',
      backLabel: '‹ Desktop',
      posts: posts
    });
  }
};

// 页面10：电脑主屏幕（动态通知：根据进度自动显示debs消息或更早的待处理通知）
NODES_EN['desktop_3'] = {
  container: 'screen-desktop',
  links: ['debs_chat_1', 'oasis_app_login', 'calendar_app'],
  render: function () {
    renderChapter1Desktop('10:02', 'Nov 8, 2032');
  }
};

// 页面11：与debs聊天（自动播放）
NODES_EN['debs_chat_1'] = {
  container: 'screen-chat',
  links: ['desktop_3b'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_3',
      script: [
        { from: 'them', text: 'hey' },
        { from: 'me', text: "hey what's up?" },
        { from: 'them', text: "nothing, just missing lulu today" },
        { from: 'them', text: "i still think about her all the time" },
        { from: 'me', text: "she was so lucky to have you, you know that right? you gave her the best life" },
        { from: 'them', text: "...thank you. i needed that 🥺" },
        { from: 'them', text: "I'm okay though, not like sad sad" },
        { from: 'them', text: "I'm at the beach" },
        { from: 'them', text: "mom and dad miss you. when are you coming home?" },
        { from: 'me', text: "not sure yet, i have an essay due soon. gonna head out soon i'll catch up with you after" },
      ],
      onEnd: function () {
        setState({ debsChat1Done: true });
        goToNode('desktop_3b');
      }
    });
  }
};

// 桌面：动态通知（debs对话之后的日常插曲，呼应Shawn买新车这件事）
NODES_EN['desktop_3b'] = {
  container: 'screen-desktop',
  links: ['priya_chat', 'oasis_app_login', 'calendar_app'],
  render: function () {
    renderChapter1Desktop('10:24', 'Nov 8, 2032');
  }
};

// priya聊天：日常插曲，吐槽Shawn买新车（轻松调子，不影响主线，结束后推进到时间跳跃过场）
NODES_EN['priya_chat'] = {
  container: 'screen-chat',
  links: ['time_skip_1'],
  render: function () {
    renderChatApp({
      headerName: 'priya92',
      characterId: 'priya',
      backTarget: 'desktop_3b',
      script: [
        { from: 'them', text: "YO did you see the car shawn just got? I thought he hated that brand" },
        { from: 'me', text: "he told me it was an impulse purchase lol maybe it really hit him differently" },
        { from: 'them', text: "i'm so jealous i need to replace my shitbox" },
        { from: 'me', text: "same here haha i do like the new RAVEN model I saw it's ad" },
        { from: 'them', text: "where are we going for your bd tomorrow?" },
        { from: 'me', text: "Ivy's pub! I have made reservations" },
        { from: 'me', text: "and my new speaker set is on it's way! Right on my bd." },
        { from: 'them', text: "betttt" },
        { from: 'them', text: "shit that's so cool!!!!!!!" },
        { from: 'them', text: "Are you excited to turn 27?" },
        { from: 'me', text: "Ugh no don't mention it I am having my quarter life crisis" },
      ],
      onEnd: function () {
        setState({ priyaChatDone: true });
        goToNode('time_skip_1');
      }
    });
  }
};

// 页面12前半：时间跳跃过场
NODES_EN['time_skip_1'] = {
  container: 'screen-narrative',
  links: ['desktop_4'],
  render: function () {
    renderNarrative({
      text: 'A few weeks later…',
      buttonLabel: 'Continue',
      goto: 'desktop_4'
    });
  }
};

// 页面12后半：电脑主屏幕，妹妹崩溃消息通知
NODES_EN['desktop_4'] = {
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
NODES_EN['debs_chat_2'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_4',
      script: [
        { from: 'them', text: "hey you there:(? there must be sth wrong with my OASIS capsule" },
        { from: 'them', text: "I woke up today and my brain just feels like absolute trash." },
        { from: 'them', text: "I was listening to my favorite playlist and it literally just sounded like boring static." },
        { from: 'them', text: "Like I couldn't care less." },
        { from: 'them', text: "I'm not even sad. I can't cry. I'm just a completely hollow shell right now." },
        { from: 'them', text: "It feels like someone just turned off the master switch in my head and left me in the dark." },
        { from: 'me', text: "Since when? Anything happened recently?" },
        { from: 'them', text: "Idk" },
        { from: 'them', text: "three days ago?" },
        { from: 'them', text: "I don't feel like anything specific triggered me" },
        { from: 'me', text: "you get some hot beverage and stay in bed okay?" },
        { from: 'me', text: "let me check my app if anything shows up. I feel okay" },
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
NODES_EN['desktop_5'] = {
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
NODES_EN['oasis_app_login'] = {
  container: 'screen-document',
  links: ['oasis_app_dashboard', 'debra_oasis_dashboard', 'desktop_1', 'desktop_2', 'desktop_3', 'desktop_3b', 'desktop_4', 'desktop_5'],
  render: function () {
    const state = getState();
    renderOasisLogin({
      promptText: 'Due to long inactivity, please log in again for safety.',
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
NODES_EN['oasis_app_dashboard'] = {
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
        { time: '2032-11-29 14:22', text: 'Sadness Detected: Triggered 0.4mg Dopamine release. Baseline restored.' },
        { time: '2032-11-29 11:45', text: 'Anxiety Spike: Vagus nerve stimulation activated. Cortisol normalized.' },
        { time: '2032-11-28 20:10', text: 'Minor Melancholy: Neural pathway re-routing in progress.' },
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
          warningTip: 'CRITICAL ERROR: Nano-system rejection pattern triggered. Manual dose required to bypass system failure.'
        },
        { time: '2032-11-03 13:18', flagged: false },
        { time: '2032-10-29 07:55', flagged: false },
      ],
      stressLevel: 'High (Class A++)',
      stressTest: {
        question: 'What is 847 × 23?',
        answer: 19481,
        correctFeedback: 'Correct. Cognitive load registered.',
        wrongFeedback: 'Incorrect. Cognitive load registered.'
      }
    });
  }
};


// 日历app：从游戏一开始就可用，展示2032年11月日程 + 4人生日倒计时
NODES_EN['calendar_app'] = {
  container: 'screen-calendar',
  links: ['desktop_1', 'desktop_2', 'desktop_3', 'desktop_3b', 'desktop_4', 'desktop_5'],
  render: function () {
    renderCalendar({
      backTarget: getState().lastDesktopNode || 'desktop_1',
      monthLabel: 'November 2032',
      year: 2032,
      month: 10, // 0-indexed，10 = November
      events: {
        3:  [{ type: 'exam', label: 'Midterm' }],
        6:  [{ type: 'work', label: 'Team sync' }],
        10: [{ type: 'social', label: 'Lunch with Jordan' }],
        12: [{ type: 'work', label: 'Project deadline' }],
        15: [{ type: 'exam', label: 'Essay due' }],
        18: [{ type: 'social', label: 'Bar night with Shawn' }],
        22: [{ type: 'work', label: 'Quarterly review' }],
        25: [{ type: 'social', label: 'Coffee with Priya' }],
      },
      birthdays: [
        { name: 'You', month: 11, day: 9, birthYear: 2005 },
        { name: 'Debs', month: 4, day: 12, birthYear: 2008 },
        { name: 'Mom', month: 8, day: 2, birthYear: 1977 },
        { name: 'Dad', month: 12, day: 2, birthYear: 1975 },
      ]
    });
  }
};


NODES_EN['self_oasis_dataviz'] = {
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
      <div class="dataviz-title">Your OASIS Dashboard</div>
      <div class="dataviz-chart">
        <div class="dataviz-chart-label">DOPAMINE BASELINE STABILITY — LAST 24H</div>
        <div class="dataviz-bars">${bars}</div>
      </div>
      <div class="dataviz-entries">
        <div class="dataviz-entry" data-entry="6am"><span class="ts">06:00</span><span class="val">Stable</span></div>
        <div class="dataviz-entry" data-entry="12pm"><span class="ts">12:00</span><span class="val">Stable</span></div>
        <div class="dataviz-entry" data-entry="9pm"><span class="ts">21:04</span><span class="val">Stable</span></div>
        <div class="dataviz-entry" data-entry="11pm"><span class="ts">23:00</span><span class="val">Stable</span></div>
      </div>
      <div class="dataviz-note" id="dataviz-self-note">Everything here looks normal. Nothing else to see.</div>
      <div style="margin:32px 20px 0; padding:16px; border:1px dashed var(--ios-separator); border-radius:10px; text-align:center; font-size:12px; color:var(--ios-text-secondary);">
        — This is standalone content not yet wired into the main story flow —<br>It will be reintegrated in a future update.
      </div>
    `;

    wrap.querySelectorAll('.dataviz-entry').forEach(el => {
      el.addEventListener('click', () => {
        const note = document.getElementById('dataviz-self-note');
        note.classList.add('show');
        if (el.getAttribute('data-entry') === '9pm') {
          note.textContent = '21:04 — a brief dip, then back to normal. Probably nothing.';
        } else {
          note.textContent = 'Everything here looks normal. Nothing else to see.';
        }
      });
    });
  }
};

// ============ 组2：任务线（NDA → VNT → 纳米机器人日志 → 防火墙解谜 → 解密 → Amber → 抉择点B） ============

NODES_EN['pil_agreement'] = {
  container: 'screen-document',
  links: ['oasis_app_dashboard'],
  render: function () {
    document.getElementById('document-back-btn').setAttribute('data-goto', 'oasis_app_dashboard');
    const wrap = document.getElementById('document-wrap');
    wrap.scrollTop = 0;
    wrap.innerHTML = `
      <div class="doc-title">OASIS BIOMETRIC SYSTEMS</div>
      <div class="doc-subtitle">TERMS OF SERVICE &amp; NEURAL INTEGRATION AGREEMENT<br>Last Updated: June 22, 2032</div>
      <div class="doc-body">
        <p><b>⚠️ IMPORTANT BIOMETRIC NOTICE</b></p>
        <p>BY INGESTING THE OASIS BIOMETRIC CAPSULE, AFFIXING THE INTEGRATED SMART SKIN PATCH, OR ACTIVATING THE OASIS COMPANION APPLICATION, YOU ARE PROVIDING EXPRESS CONSENT TO THE REAL-TIME ELECTROPHYSIOLOGICAL INTERACTION WITH YOUR CENTRAL NERVOUS SYSTEM. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT SWALLOW THE CAPSULE.</p>

        <p><b>1. WAIVER OF NEURAL SOVEREIGNTY &amp; ALGORITHMIC NEUTRALITY</b></p>
        <p>The OASIS System functions by delivering localized, micro-current electrical stimulation to the vagus nerve to assist in modulating endogenous neurotransmitter levels (including, but not limited to, dopamine, serotonin, and GABA).</p>
        <p><b>Algorithmic Autonomy:</b> All neural modulation sequences and neurotransmitter adjustments are generated strictly on a local, closed-loop level by your device, based on your real-time electrophysiological telemetry.</p>
        <p><b>Limitation of Liability:</b> Because chemical thresholds vary by individual biology, OASIS provides the system on an "as-is" basis. The Company shall bear no civil, criminal, or psychological liability for temporary mood drops, sudden episodes of emotional emptiness, transient sensory numbness, perceptual detachment, or sudden alterations in independent consumer decision-making.</p>

        <p><b>2. IN-BODY HARDWARE RISK &amp; "CONNECTION LOST" PROTOCOLS</b></p>
        <p>The OASIS Ingestible Capsule utilizes biocompatible, bio-inert, and safely degradable nanomaterials designed to operate seamlessly within the human digestive tract.</p>
        <p><b>Communication Interruption:</b> You acknowledge that the internal biological environment is highly volatile (subject to gastrointestinal motility, metabolic fluctuations, and pH variances). Consequently, the capsule may experience sudden hardware standby, firmware desynchronization, or unannounced "Connection Lost" states.</p>
        <p><b>Overdose &amp; Countermeasure Restriction:</b> In the event that the Companion App displays a "Connection Lost" or "Device Disconnected" status, the user is strictly prohibited from ingesting supplementary/multiple capsules within a rolling 48-hour window.</p>
        <p><b>Withdrawal Indemnification:</b> Any sudden baseline drop in internal dopamine or serotonin synthesis due to sudden hardware power-down (colloquially referred to as a "system blackout" or "crash") is a recognized byproduct of biological recalibration. The Company offers no compensation for acute anxiety, panic, or psychological hollow shells during these offline periods.</p>

        <p><b>3. THE "DATA BLINDSPOT" PROTOCOL &amp; THIRD-PARTY SHIELD</b></p>
        <p>OASIS maintains an absolute commitment to user privacy. Our servers do not track, collect, store, or aggregate your financial transactions, social chat logs, browsing histories, or location data.</p>
        <p><b>API Integration:</b> The OASIS System features an open-field API designed to synchronize with authenticated external environments and smart hardware (including, but not limited to, third-party spatial audio ecosystems, automotive acoustics, transport hubs, and curated retail spaces).</p>
        <p><b>Responsive Local Loops:</b> If an external signal—such as an inaudible acoustic beacon, ultrasonic frequency, or environmental audio wave—triggers a localized neurotransmitter shift via your smart skin patch, this response is legally classified as a "Local Autogenous Adaptation."</p>
        <p><b>Advertising Indemnity:</b> Because OASIS does not harvest or share your behavioral data with partnered advertisers, any sudden emotional spikes, acute cravings, or immediate impulse purchases occurring during or immediately following exposure to third-party media are the sole cognitive and financial responsibility of the user.</p>

        <p><b>4. STRICT ANTI-REVERSE ENGINEERING &amp; INTEGRITY ENFORCEMENT</b></p>
        <p>The architecture of the capsule, the encrypted radio-frequency handshakes between the skin patch, and the underlying ad-triggering API protocols constitute heavily guarded medical and proprietary intellectual property.</p>
        <p><b>Prohibited Actions:</b> Users shall not intercept, capture, decompile, or attempt to audit the firmware code of the in-body system using radio-frequency sniffers, software decoupling, or electromagnetic extraction.</p>
        <p><b>Remedial Disconnection:</b> Any attempt to reverse-engineer, modify, or patch the internal electrical discharge intervals will be flagged instantly as a Severe System Infraction.</p>
        <p><b>Termination of Service:</b> OASIS reserves the unilateral right to permanently revoke the biological activation license of any non-compliant user, immediately disabling the in-body capsule without prior warning, and to report the violation to the National Bureau of Neurorights.</p>

        <p>By clicking "I AGREE TO THE NEURAL TERMS," you acknowledge that you are handing the chemical modulation keys of your perception to an automated, closed-loop system. You explicitly waive the right to a jury trial for any psychological or existential displacement resulting from system downtime.</p>
      </div>
    `;
  }
};

// ============ 第二章节 ============

NODES_EN['ruth_chat'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Ruth',
      characterId: 'ruth',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "omg the new perfume is SELLING OUT" },
        { from: 'them', text: "ever since we partnered with that new marketing agency business has been insane" },
        { from: 'them', text: "the whole team just got bonuses" },
        { from: 'them', text: "dinner tonight to celebrate?" },
        { from: 'me', text: "congrats!! that's amazing" },
        { from: 'me', text: "my sister hasn't been well lately though, i need to deal with that first" },
        { from: 'them', text: "oh no. I just met her a couple days ago she was upset about Adrian" },
        { from: 'me', text: "AGAIN?? she didn't tell me about it. what was it about?" },
        { from: 'them', text: "Same old shit Adrian keeps complaining about giving up that relocation for her he's such an ass" },
        { from: 'me', text: "god, when is he gonna stop making himself a victim" },
      ],
      onEnd: function () {
        setState({ chapter2Stage: 'free_roam' });
        goToNode('desktop_5');
      }
    });
  }
};

NODES_EN['adrian_story'] = {
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

NODES_EN['adrian_profile'] = {
  container: 'screen-profile',
  links: ['adrian_chat', 'friends_feed'],
  render: function () {
    const state = getState();
    const ch2Posts = [
      { dateLabel: 'Nov 6', caption: "VROOOOM YOOOO", likes: 28, img: 'posts/adrian_ch2_p1_moody.webp', gradient: 'linear-gradient(180deg,#2a2d3a,#1a1c24)', comments: [] },
      { dateLabel: 'Oct 30', caption: 'weekend project finally done', likes: 33, img: 'posts/adrian_ch2_p2_project.webp', gradient: 'linear-gradient(135deg,#7B96A8,#3D5566)', comments: [{ name: 'devon', text: 'looks solid' }] },
    ];
    const ch4Posts = [
      { dateLabel: 'Nov 26', caption: 'Always good to be outside', likes: 41, img: 'posts/adrian_ch4_p1_sink.webp', gradient: 'linear-gradient(135deg,#9aa7b8,#5c6878)', comments: [{ name: 'devon', text: 'the diy king' }] },
      { dateLabel: 'Nov 19', caption: "gym's been good lately", likes: 67, img: 'posts/adrian_ch4_p2_gym.webp', gradient: 'linear-gradient(135deg,#7B96A8,#3D5566)', comments: [{ name: 'jordan_t', text: 'keep it up' }] },
      { dateLabel: 'Nov 12', caption: '🔥BEST game this season', likes: 52, img: 'posts/adrian_ch4_p3_game.webp', gradient: 'linear-gradient(180deg,#2a2d3a,#1a1c24)', comments: [{ name: 'mia.l', text: 'who won' }] },
    ];
    renderProfileFeed({
      backTarget: state.lastDesktopNode || 'friends_feed',
      name: 'Adrian',
      avatarGradient: getCharacter('adrian').fallback,
      bio: "YOLO",
      stats: [{ n: '212', l: 'Posts' }, { n: '1.4k', l: 'Followers' }, { n: '388', l: 'Following' }],
      messageTarget: 'adrian_chat',
      posts: state.amberSafetyChatDone ? ch4Posts : ch2Posts
    });
  }
};

NODES_EN['adrian_chat'] = {
  container: 'screen-chat',
  links: ['adrian_profile', 'desktop_5'],
  render: function () {
    setState({ adrianMessaged: true });
    renderChatApp({
      headerName: 'Adrian',
      characterId: 'adrian',
      backTarget: 'adrian_profile',
      script: [
        { from: 'me', text: "what's your deal? my sister isn't dating you so you two can fight all the time" },
        { from: 'them', text: "come on, that was two days ago. it's over now" },
        { from: 'me', text: "stop doing things that make people upset!" },
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

NODES_EN['debs_odd_notif_chat'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'me', text: "hey, my app shows everything's normal on my end" },
        { from: 'them', text: "that's so weird. mine keeps getting these strange pushes" },
        { from: 'them', text: "it says things like intervention failed i don't understand" },
        { from: 'them', text: "and the detailed historical data has a ton of fails, all in red timestamps" },
        { from: 'them', text: "I clicked into one and it's just garbled code, I can't read it" },
        { from: 'them', text: "I already reported the error to OASIS but they say it's still under investigation" },
        { from: 'me', text: "I can log in and take a look? that's weird" },
        { from: 'them', text: "yeah, okay. You can log into my account on the app and I will authorize you" },
      ],
      onEnd: function () {
        setState({ chapter2Stage: 'debra_login_ready' });
        goToNode('desktop_5');
      }
    });
  }
};

// ============ 第三章节 ============

NODES_EN['debra_oasis_dashboard'] = {
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
      ringLabel: 'Unstable',
      interventionLog: [
        { time: '2032-11-28 23:59', text: 'Neural Reset: [!] FAILED — Request denied by Cloud Proxy.' },
        { time: '2032-11-28 18:45', text: 'Neural Reset: [!] FAILED — Request denied by Cloud Proxy.' },
        { time: '2032-11-28 15:02', text: 'Neural Reset: [!] FAILED — Proxy Interception [SRC: STOP_USING].' },
      ],
      deepLogs: [
        { time: '2032-11-22 08:15', flagged: false },
        { time: '2032-11-22 13:40', flagged: false },
        { time: '2032-11-23 07:05', flagged: false },
        { time: '2032-11-23 16:55', flagged: false },
        { time: '2032-11-24 09:15', flagged: false },
        { time: '2032-11-24 19:20', flagged: false },
        { time: '2032-11-25 08:02', flagged: true, statusLabel: 'FAILED' },
        { time: '2032-11-25 10:30', flagged: true, statusLabel: 'FAILED' },
        { time: '2032-11-26 01:05', flagged: true, statusLabel: 'FAILED' },
        { time: '2032-11-26 10:12', flagged: true, statusLabel: 'FAILED' },
        { time: '2032-11-27 02:22', flagged: true, statusLabel: 'FAILED' },
        { time: '2032-11-27 15:50', flagged: true, statusLabel: 'FAILED' },
        { time: '2032-11-28 01:12', flagged: true, statusLabel: 'FAILED' },
        { time: '2032-11-28 12:18', flagged: true, statusLabel: 'FAILED' },
        { time: '2032-11-28 23:59', flagged: true, statusLabel: 'FAILED' },
      ]
    });
  }
};

NODES_EN['debra_failed_log_detail'] = {
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
      ['2032-11-22 08:15:02', 39.8, 0.05, 'Baseline Calibration', 'SUCCESS'],
      ['2032-11-22 13:40:55', 44.2, 0.18, 'Vagal Nerve Stimulation (5mA)', 'SUCCESS'],
      ['2032-11-22 21:10:12', 40.5, 0.07, 'Serotonin Pump Injection (0.2mg)', 'SUCCESS'],
      ['2032-11-23 07:05:44', 38.9, 0.04, 'Cortisol Degradation (Nano-Enzyme)', 'SUCCESS'],
      ['2032-11-23 11:22:30', 43.1, 0.22, 'Dopamine Receptor Modulation', 'SUCCESS'],
      ['2032-11-23 16:55:01', 40.1, 0.06, 'Baseline Calibration', 'SUCCESS'],
      ['2032-11-23 23:30:19', 44.8, 0.35, 'Vagal Nerve Stimulation (8mA)', 'SUCCESS'],
      ['2032-11-24 09:15:47', 39.5, 0.05, 'Baseline Calibration', 'SUCCESS'],
      ['2032-11-24 14:45:10', 42.9, 0.15, 'Synaptic Delay Compensation', 'SUCCESS'],
      ['2032-11-24 19:20:33', 43.5, 0.28, 'Vagal Nerve Stimulation (6mA)', 'SUCCESS'],
      ['2032-11-25 08:02:11', 56.4, 4.12, 'Neural Reset', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-25 09:12:45', 58.2, 5.44, 'Neural Reset', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-25 10:30:05', 61.8, 6.89, 'Neural Reset', '[!] FAILED: Proxy Interception [SRC: UNKNOWN_PROXY_88]'],
      ['2032-11-25 15:18:22', 52.3, 3.90, 'Vagal Nerve Stimulation', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-26 01:05:11', 59.5, 7.21, 'Serotonin Pump Injection', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-26 04:55:30', 55.4, 5.80, 'Cortisol Degradation', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-26 10:12:15', 64.7, 8.34, 'Neural Reset', '[!] FAILED: Proxy Interception [SRC: UNKNOWN_PROXY_88]'],
      ['2032-11-26 14:40:02', 54.2, 4.12, 'Dopamine Receptor Modulation', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-27 02:22:44', 51.6, 3.20, 'Vagal Nerve Stimulation', '[!] FAILED: Connection Timeout'],
      ['2032-11-27 06:10:19', 57.9, 6.10, 'Cortisol Degradation', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-27 11:35:56', 60.3, 7.55, 'Serotonin Pump Injection', '[!] FAILED: Proxy Interception [SRC: WAKE_UP]'],
      ['2032-11-27 15:50:10', 62.1, 8.01, 'Neural Reset', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-27 20:05:41', 53.8, 3.99, 'Vagal Nerve Stimulation', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-28 01:12:33', 65.4, 9.12, 'Neural Reset', '[!] FAILED: Proxy Interception [SRC: THEY_ARE_MANIPULATING]'],
      ['2032-11-28 05:40:12', 58.7, 6.80, 'Serotonin Pump Injection', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-28 09:25:05', 63.9, 8.55, 'Neural Reset', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-28 12:18:47', 60.1, 7.20, 'Cortisol Degradation', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-28 15:02:11', 68.2, 10.45, 'Neural Reset', '[!] FAILED: Proxy Interception [SRC: STOP_USING]'],
      ['2032-11-28 18:45:55', 66.5, 9.98, 'Neural Reset', '[!] FAILED: Request denied by Cloud Proxy'],
      ['2032-11-28 23:59:59', 71.0, 12.01, 'Neural Reset', '[!] FAILED: Request denied by Cloud Proxy'],
    ];
    const linesHtml = rawLog.map(r => {
      const fail = r[4].indexOf('FAILED') !== -1;
      return `<div class="raw-log-line ${fail ? 'fail' : ''}">{"time": "${r[0]}", "vnt": ${r[1]}, "variance": ${r[2]}, "action": "${r[3]}", "status": "${r[4]}"}</div>`;
    }).join('');
    wrap.innerHTML = `
      <div class="terminal-title">debra_core.log — raw output</div>
      <div class="raw-log-box">${linesHtml}</div>
      <div class="terminal-continue-btn" id="rawlog-continue-btn">Back to Dashboard</div>
    `;
    document.getElementById('rawlog-continue-btn').addEventListener('click', () => goToNode('debra_oasis_dashboard'));
  }
};

NODES_EN['debs_hacked_chat'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'me', text: "your account looks like it's been hacked, that's why the capsule isn't working" },
      ],
      onEnd: function () {
        setState({ chapter34Stage: 'call_debra_ready' });
        goToNode('desktop_5');
      }
    });
  }
};

NODES_EN['calling_debra'] = {
  container: 'screen-narrative',
  links: ['desktop_5'],
  render: function () {
    const wrap = document.getElementById('narrative-wrap');
    wrap.innerHTML = `
      <div class="narrative-text" id="calling-text">Calling Debs…</div>
      <div class="calling-spinner" id="calling-spinner"></div>
      <div class="narrative-continue-btn hide" id="calling-continue-btn">Back to Desktop</div>
    `;
    setTimeout(() => {
      document.getElementById('calling-text').textContent = 'Call ended — no answer.';
      document.getElementById('calling-spinner').classList.add('hide-spinner');
      document.getElementById('calling-continue-btn').classList.remove('hide');
      setState({ chapter34Stage: 'worried_chat_pending' });
    }, 5000);
    document.getElementById('calling-continue-btn').addEventListener('click', () => goToNode('desktop_5'));
  }
};

NODES_EN['debs_worried_chat'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'me', text: "are you okay? why aren't you answering?" },
        { from: 'me', text: "please reply soon, i'm starting to worry" },
      ],
      onEnd: function () {
        setState({ chapter34Stage: 'pavlov1_pending' });
        goToNode('desktop_5');
      }
    });
  }
};

NODES_EN['pavlov_email_1'] = {
  container: 'screen-mail',
  links: ['ch4_transition'],
  render: function () {
    const mailList = [
      {
        id: 'pavlov1', from: 'Pavlov', subj: '%$#@ ... ___ ... %%%',
        snippet: 'aSDjk!#@(* ... woof ...', unread: true,
        detailRender: () => `
          <div class="mail-detail-subject">%$#@ ... ___ ... %%%</div>
          <div class="mail-detail-meta">From: <b>Pavlov</b></div>
          <div class="garbled-email-body">
&gt;&gt;&gt^%$#$%^&%$#$%^sf*&^%sha%^&hs*&^%$SHE IS SAFE%$*&hsbn%^GF*&^; ksjdf83##@@STOP &amp;^%$ jkfh283@&*65sgyyuwh(*&67895Ewqni&^%
$67htre9&%865p;&ampp;&amㅤㅤ ʕ•ᴥ•ʔ $%^jhBV45&^%6HGFpp;&amㅤㅤ /ᐠ - ᴥ - ᐟ\\ ㅤㅤ6788jjfsa&^%hjhqwe7618&^%45sh U・ᴥ・U
###23pp;&am#1@@21@&am;SHE IS SAFE*&^%$67h6788jjfsatre9&%8656788jjfsahhy6788jjfsam%%1312$$ kjs6788jjfsa24$%hdf*&^%$%7ashu65644h
&^%$#@#$%^hsag&^%yau^%THIS IS NATURAL@!@J51u6%^&htr6f85646788jjfsa7uhiu%^7bja8#&amp;%$ jksdhf86788jjfsa92123t6&**^**@#G&&SSQ6788jjfsaGWYT&6534sbdhqh.
          </div>`
      }
    ];
    renderMailApp(mailList, 'pavlov1', 'ch4_transition');
  }
};

NODES_EN['nova_page'] = {
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
            <div class="nv-nav-links">FEATURES · ROADMAP · PRICING</div>
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
            <div class="nv-eyebrow">NOVA Education</div>
            <div class="nv-headline">Navigating Your Future,<br>Powered by Intelligence.</div>
            <div class="nv-sub">Stop guessing. Use AI-driven insights to master your school major selection and define your career path with precision.</div>
            <div class="nv-cta" data-toast="Promotion unavailable right now.">Get Started for Free</div>
          </div>
          <div class="nv-section">
            <div class="nv-section-title">The Roadmap to You</div>
            <div class="nv-feature">
              <div class="nv-feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="#4FD8E8" stroke-width="1.6"/><path d="M19.5 19.5L15 15" stroke="#4FD8E8" stroke-width="1.6" stroke-linecap="round"/></svg></div>
              <div><div class="nv-feature-name">Smart Major Selection</div><div class="nv-feature-desc">Analyze your strengths and passion to match with the perfect academic field.</div></div>
            </div>
            <div class="nv-feature">
              <div class="nv-feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 4c-3 0-5 2-5 4.5 0 1.7 1 2.5 1 4 0 1 0 2 1 2.5h6c1-.5 1-1.5 1-2.5 0-1.5 1-2.3 1-4 0-2.5-2-4.5-5-4.5z" stroke="#4FD8E8" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 17.5h4M10.5 20h3" stroke="#4FD8E8" stroke-width="1.5" stroke-linecap="round"/></svg></div>
              <div><div class="nv-feature-name">Career Blueprint</div><div class="nv-feature-desc">Simulate real-world career trajectories with our advanced market analytics.</div></div>
            </div>
            <div class="nv-feature">
              <div class="nv-feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#4FD8E8" stroke-width="1.6"/><path d="M15 9l-4 4-2 4 4-2 2-4z" fill="#4FD8E8"/></svg></div>
              <div><div class="nv-feature-name">AI Mentorship</div><div class="nv-feature-desc">24/7 personal career advice tailored specifically to your unique goals.</div></div>
            </div>
          </div>
          <div class="nv-proof">
            <div class="nv-proof-text">Empowering <b>50,000+</b> students to make confident choices.</div>
          </div>
        </div>`
      ]
    });
  }
};

NODES_EN['pat_studio_page'] = {
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
            <div class="pat-menu-icon" data-toast="Shop · Workshops · About Us · Contact"><span></span><span></span><span></span></div>
          </div>
          <div class="pat-hero">
            <div class="pat-hero-img">${imgOrFallback('sites/pat_hero_couple_wheel.webp', 'linear-gradient(160deg,#D8B89A,#A8754F)', '4px')}</div>
            <div class="pat-eyebrow">Local Pottery Studio</div>
            <div class="pat-headline">Handcrafted Moments,<br>Shaped by Two.</div>
            <div class="pat-sub">Welcome to PAT Studio. A local pottery space where we turn clay into memories, together.</div>
            <div class="pat-cta" data-toast="Workshops are fully booked this month.">Book a Workshop</div>
          </div>
          <div class="pat-section alt">
            <div class="pat-divider"></div>
            <div class="pat-about-img" style="margin-top:24px;">${imgOrFallback('sites/pat_about_couple.webp', 'linear-gradient(160deg,#BFAE96,#8A7559)', '4px')}</div>
            <div class="pat-section-title">Our Story</div>
            <div class="pat-section-body">PAT isn't just a studio; it's our shared passion project. From the first turn of the wheel to the final glaze, we believe every piece tells a story. Join us to slow down, get your hands dirty, and discover the art of pottery in the heart of our community.</div>
          </div>
          <div class="pat-section">
            <div class="pat-section-title">Create Your Own</div>
            <div class="pat-workshop-grid">
              <div class="pat-workshop-cell">${imgOrFallback('sites/pat_workshop_wheel.webp', 'linear-gradient(160deg,#C99A72,#92653F)', '0')}<div class="pat-workshop-label">Wheel Throwing 101</div></div>
              <div class="pat-workshop-cell">${imgOrFallback('sites/pat_workshop_handbuild.webp', 'linear-gradient(160deg,#AFA088,#7C6E59)', '0')}<div class="pat-workshop-label">Hand-building Basics</div></div>
              <div class="pat-workshop-cell">${imgOrFallback('sites/pat_workshop_glazing.webp', 'linear-gradient(160deg,#9CA98E,#6C7960)', '0')}<div class="pat-workshop-label">Date Night Pottery</div></div>
            </div>
          </div>
        </div>`
      ]
    });
  }
};

// ============ 第四章节 ============

NODES_EN['ch4_transition'] = {
  container: 'screen-narrative',
  links: ['desktop_5'],
  render: function () {
    setState({ chapter34Stage: 'oasis_notice_pending' });
    renderNarrative({
      text: "An hour has passed. Debra still hasn't replied. I can't reach my parents' phones either. I'm scared something happened.",
      buttonLabel: 'Continue',
      goto: 'desktop_5'
    });
  }
};

NODES_EN['oasis_notice'] = {
  container: 'screen-document',
  links: ['amber_safety_chat'],
  render: function () {
    setState({ ch4Started: true });
    document.getElementById('document-back-btn').setAttribute('data-goto', 'desktop_5');
    const wrap = document.getElementById('document-wrap');
    wrap.scrollTop = 0;
    wrap.innerHTML = `
      <div class="doc-title">A Message From OASIS</div>
      <div class="doc-body">
        <p>Dear Valued Member,</p>
        <p>At OASIS, your peace of mind is our only priority. We are writing to you today because our system telemetry has detected localized connectivity irregularities affecting a small percentage of our active OASIS nodes.</p>
        <p>We understand that some users may have experienced a temporary cessation of intervention protocols over the past 72 hours. We want to assure you that this is not a malfunction of your OASIS capsule. Rather, it is the result of external interference affecting the cloud-sync gateways.</p>
        <p>Our engineering team is currently performing an emergency recalibration of the global synchronization network. During this maintenance window, you may notice slight fluctuations in your emotional baseline. Please remain calm; our system is designed to stabilize as connectivity is restored.</p>
        <p>We apologize for any inconvenience caused by this temporary "silence." Your harmony will be resumed shortly.</p>
      </div>
      <div class="doc-sign-btn" id="oasis-notice-contact-btn">Contact a Safety Specialist</div>
    `;
    document.getElementById('oasis-notice-contact-btn').addEventListener('click', () => {
      setState({ chapter34Stage: 'amber_safety_pending' });
      goToNode('amber_safety_chat');
    });
  }
};

NODES_EN['amber_safety_chat'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Amber',
      characterId: 'amber',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "I'm Amber, an OASIS Safety Specialist. We're very sorry for the discomfort you've experienced. Our internal team is investigating — could you tell me what issue your account ran into?" },
        { from: 'me', text: "It's not me, it's my sister, Debra." },
        { from: 'them', text: "We've located Debra's account. Unfortunately her capsule was affected by this hacking incident. We're working on a fix. We suspect the hacker is targeting users by a specific 'behavioral signature' — do you have any supporting information you could share?" },
        { from: 'me', text: "Behavioral signature? Like what?" },
        { from: 'them', text: "Things like her recent spending, or social activity — these usually correlate with intense emotional responses." },
        { from: 'me', text: "Why can't you just look that up yourselves?" },
        { from: 'them', text: "We never proactively collect that kind of data. Our neuroscience division only handles electrophysiological neural-feedback signals — that's the underlying logic that keeps the capsule running. Spending records or social activity live entirely on her personal phone or social apps. That's completely outside our monitoring scope, and we have no permission to touch it. We can only observe the 'result' (neural fluctuation), never the 'cause' (life events). Privacy law means we don't even know the source of the interference." },
        { from: 'them', text: "That's why we need you. As family, you're far more likely to see what's actually going on in her life — and tell us what triggered this." },
        { from: 'me', text: "Okay. I'll see what I can find." },
      ],
      onEnd: function () {
        setState({ chapter34Stage: 'free_roam_2', amberSafetyChatDone: true });
        goToNode('desktop_5');
      }
    });
  }
};

NODES_EN['mail_ch4_emails'] = {
  container: 'screen-mail',
  links: ['desktop_5'],
  render: function () {
    const mailList = [
      {
        id: 'pavlov2', from: 'Pavlov', subj: '@@@ ... %%% ... ___',
        snippet: 'kjsdhf ... woof ...', unread: true,
        detailRender: () => `
          <div class="mail-detail-subject">@@@ ... %%% ... ___</div>
          <div class="mail-detail-meta">From: <b>Pavlov</b></div>
          <div class="garbled-email-body">
&gt;&gt;&gt; kjshd@#$ STOP ^%&amp;* jksdf82 ___ㅤㅤ
ㅤㅤ ʕ•ᴥ•ʔ ㅤㅤ /ᐠ - ᴥ - ᐟ\\ ㅤㅤ U・ᴥ・U
###@@&amp;&amp; DON'T TALK TO THEM %%$ jkshd
I AM TRYING TO HELP ___ㅤ #&amp;%$ kjhsdf928 woof.
          </div>`
      },
      {
        id: 'harmony2', from: 'Organic Harmony', subj: 'When the digital world collapses, your heartbeat is still your own.',
        snippet: 'We heard about the recent OASIS incident...', unread: true,
        detailRender: () => `
          <div class="mail-detail-subject">When the digital world collapses, your heartbeat is still your own.</div>
          <div class="mail-detail-meta">From: <b>Organic Harmony</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.7;">
            <p style="margin:0 0 12px;">Dear friend,</p>
            <p style="margin:0 0 12px;">We've heard about OASIS's recent incident, and we feel for you deeply. If your neural link shook over the past 72 hours, there's no need for shame. That was the system warning you: when you store your soul in the cloud, you can lose control of your own body at any moment.</p>
            <p style="margin:0 0 12px;">As long as you remain inside that monitored digital ecosystem, this kind of disruption is inevitable. The system was the one collapsing — and you were the one forced to absorb the shock.</p>
            <p style="margin:0 0 12px;">So instead of letting OASIS engineers repair their cold encryption protocols for you, why not choose the Great Disconnect entirely?</p>
            <p style="margin:0 0 4px;"><b>Physical Air-Gap</b> — our retreat sits in a mountain region with no signal coverage at all. No OASIS waveform can reach your nerves here. Your anxiety is real, but it's free.</p>
            <p style="margin:0 0 4px;"><b>Analog Rhythms</b> — no electrical stimulation. Just biological rhythm, raw plant extracts, and face-to-face group resonance. We don't edit your data. We wash your memory clean.</p>
            <p style="margin:0 0 12px;"><b>The Last Untouched Ground</b> — if you feel like you're becoming a person patched together by algorithms, come here. No one cares about your KPIs or your neural fluctuation index.</p>
          </div>
          <div class="doc-sign-btn" id="harmony2-continue-btn" style="margin:18px 0 0;" data-toast="Booking unavailable right now.">Click Here: Escape With Us</div>`
      }
    ];
    renderMailApp(mailList, 'pavlov2', 'desktop_5');
    setTimeout(() => {
      setState({ chapter34Stage: 'debs_calm_chat_pending' });
    }, 0);
  }
};

NODES_EN['debs_calm_chat'] = {
  container: 'screen-chat',
  links: ['choice_point_1'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "I feel a bit calmer now. That was really scary. It felt like my emotions were crashing over me like a tsunami, I could only curl up in my room and wait for it to pass. I don't think I've felt like that since a few years ago." },
      ],
      onEnd: function () {
        goToNode('choice_point_1');
      }
    });
  }
};

NODES_EN['choice_point_1'] = {
  container: 'screen-choice',
  checkpoint: 'calm_reply',
  links: ['debs_calm_reply_a', 'debs_calm_reply_b'],
  render: function () {
    renderChoice({
      text: "How do you reply to Debs?",
      options: [
        {
          label: "That's good. I just told OASIS's safety officer about your situation. They're investigating what caused this. I'm about to tell her what I found. Once the fix is in, you shouldn't have to worry about this happening again.",
          style: 'primary',
          onSelect: () => setState({ debsCalmChatChoice: 'told_oasis' }),
          goto: 'debs_calm_reply_a'
        },
        {
          label: "That's good. Since this thing is so unstable, maybe you should just stop taking it for now. Think you can handle that? I got an email from a company called Harmony recently — they say you can go back to a more natural mind-body balance.",
          style: '',
          onSelect: () => setState({ debsCalmChatChoice: 'suggest_stop' }),
          goto: 'debs_calm_reply_b'
        }
      ]
    });
  }
};

NODES_EN['debs_calm_reply_a'] = {
  container: 'screen-chat',
  links: ['desktop_5'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "That's great, so what did they say caused it?" },
        { from: 'me', text: "They said you had a trigger event — the hacker may have targeted that specific moment." },
        { from: 'them', text: "Okay, that's scary. I really hope they fix it soon. I miss feeling calm." },
      ],
      onEnd: function () {
        setState({ chapter34Stage: 'amber_followup_pending' });
        goToNode('desktop_5');
      }
    });
  }
};

NODES_EN['debs_calm_reply_b'] = {
  container: 'screen-chat',
  links: ['ending_b_notif'],
  render: function () {
    renderChatApp({
      headerName: 'Debs',
      characterId: 'debs',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "I don't know, I'm scared even without it now." },
        { from: 'me', text: "honestly, same. I'm dependent on it at this point — with how much pressure life is right now, it really does make things easier." },
      ],
      onEnd: function () {
        goToNode('ending_b_notif');
      }
    });
  }
};

NODES_EN['pavlov_email_3'] = {
  container: 'screen-mail',
  links: ['desktop_5'],
  render: function () {
    const mailList = [
      {
        id: 'pavlov3', from: 'Pavlov', subj: '%$#@ ... ___ ... %%%',
        snippet: 'aSDjk!#@(* ... woof ...', unread: true,
        detailRender: () => `
          <div class="mail-detail-subject">%$#@ ... ___ ... %%%</div>
          <div class="mail-detail-meta">From: <b>Pavlov</b></div>
          <div class="garbled-email-body">
&gt;&gt;&gt;sjf83##@@%^&*DONT TALK TO THEM*&^%$#jkfh283@&*65sgyy___ㅤㅤ
ㅤㅤ ʕ•ᴥ•ʔ $%^jhBV45&^%6HGFp;&amㅤㅤ /ᐠ - ᴥ - ᐟ\\ ㅤㅤ6788jjfsaU・ᴥ・U
####@@@&amp;&amp;%$*&hsbn%^I AM TRYING TO HELP^%$#@!@J51u6%^&htr6f8564kjshdf
###23pp;&am#1@@21@&am;hhy6788jjfsam%%1312$$ DONT ANSWER THEM &^%$#@#$%^hsag
7uhiu%^7bja8#&amp;%$ jksdhf86788jjfsa92123t6&**^**@#G&&SSQ6788jjfsaGWYT&6534sbdhqh
woof.
          </div>`
      }
    ];
    renderMailApp(mailList, 'pavlov3', 'desktop_5');
    setState({ chapter34Stage: 'amber_followup_pending' });
  }
};

NODES_EN['amber_followup_chat'] = {
  container: 'screen-chat',
  links: ['choice_point_2'],
  render: function () {
    renderChatApp({
      headerName: 'Amber',
      characterId: 'amber',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "How's it going, did you find anything? I've been reading through Debs's emotional fluctuation logs, and it looks like the volatility has gone down." },
        { from: 'me', text: "Yeah, thank god. She's okay." },
      ],
      onEnd: function () {
        goToNode('choice_point_2');
      }
    });
  }
};

NODES_EN['choice_point_2'] = {
  container: 'screen-choice',
  checkpoint: 'amber_findings',
  links: ['ending_a_notif', 'ending_b_notif'],
  render: function () {
    renderChoice({
      text: "What do you tell Amber you found?",
      options: [
        { label: 'On Nov 22 she bought a scented candle, but she can’t remember who from anymore.', style: '', onSelect: () => setState({ amberFindingsChoice: 'other' }), goto: 'amber_findings_reply' },
        { label: 'On Nov 25 she signed up for something called NOVA membership.', style: '', onSelect: () => setState({ amberFindingsChoice: 'nova' }), goto: 'amber_findings_reply' },
        { label: 'On Nov 27 she had a fight with her boyfriend.', style: '', onSelect: () => setState({ amberFindingsChoice: 'other' }), goto: 'amber_findings_reply' },
        { label: 'On Nov 28 she went to a local studio to make pottery.', style: '', onSelect: () => setState({ amberFindingsChoice: 'other' }), goto: 'amber_findings_reply' },
        { label: "I didn't find anything.", style: '', onSelect: () => setState({ amberFindingsChoice: 'other' }), goto: 'amber_findings_reply' },
      ]
    });
  }
};

NODES_EN['amber_findings_reply'] = {
  container: 'screen-chat',
  links: ['ending_a_notif', 'ending_b_notif'],
  render: function () {
    renderChatApp({
      headerName: 'Amber',
      characterId: 'amber',
      backTarget: 'desktop_5',
      script: [
        { from: 'them', text: "Got it, that's been logged. We'll keep following up on this internally." },
      ],
      onEnd: function () {
        const state = getState();
        goToNode(state.amberFindingsChoice === 'nova' ? 'ending_a_notif' : 'ending_b_notif');
      }
    });
  }
};

// ============ 结局A：胶囊修复 ============

NODES_EN['ending_a_notif'] = {
  container: 'screen-desktop',
  links: ['ending_a_statement'],
  render: function () {
    renderDesktop({
      time: '6:48',
      date: 'Nov 29, 2032',
      notif: { iconClass: 'oasis', icon: '✅', app: 'OASIS', title: 'Capsule Fixed!', body: 'Tap to view.', goto: 'ending_a_statement' },
      showOasisApp: false,
      showCalendarApp: false,
      dockGoto: {}
    });
  }
};

NODES_EN['ending_a_statement'] = {
  container: 'screen-document',
  links: ['ending_a_year_later'],
  render: function () {
    document.getElementById('document-back-btn').setAttribute('data-goto', 'ending_a_year_later');
    const wrap = document.getElementById('document-wrap');
    wrap.scrollTop = 0;
    wrap.innerHTML = `
      <div class="doc-title">OASIS Notice: Acknowledgment Regarding Root-Cause Resolution of the "Pavlov Incident"</div>
      <div class="doc-body">
        <p>Dear Valued Member,</p>
        <p>In the recent unauthorized intrusion into OASIS's core system logic (the so-called "Pavlov Incident"), we are deeply grateful to the users who, at a critical moment, assisted our security team in identifying the specific user behavioral profile that was targeted.</p>
        <p>As stated in our earlier notice, OASIS's core value has always been safeguarding the absolute stability of the neural baseline. This hacking attempt sought to exploit an atypical "behavioral trigger sequence" to disrupt that balance — an unmistakable challenge to neural security across our entire network.</p>
        <p>Through deep modeling and logical cross-referencing of the user behavioral profile you provided, our security experts have identified and sealed off the hacker's trigger pathway. This not only repaired the gap in our system's defenses, but also provided invaluable training parameters for our Dynamic Response Mechanism.</p>
        <p>As it turns out, by identifying this specific category of trigger event, we are now able to strip away that interference with far greater precision at the bioelectric level. This strengthens the capsule's judgment efficiency when processing complex environmental data, and lays the groundwork for more robust early-warning capabilities around emotional stability going forward.</p>
        <p>Thanks to this logic correction — made possible by user assistance — our algorithm can now filter out external triggers attempting to disrupt users' neural rhythm with three times the precision of before, ensuring your physiological state remains within the ideal "comfort threshold" at all times.</p>
        <p>Thank you for standing with us, as a guardian of the OASIS ecosystem, to complete this unprecedented neural-logic repair.</p>
        <p style="margin-top:18px;">OASIS Security Architecture Committee<br>Stability in Every Pulse.</p>
      </div>
    `;
  }
};

NODES_EN['ending_a_year_later'] = {
  container: 'screen-narrative',
  links: ['ending_a_desktop'],
  render: function () {
    renderNarrative({ text: 'One year later.', buttonLabel: 'Continue', goto: 'ending_a_desktop' });
  }
};

NODES_EN['ending_a_desktop'] = {
  container: 'screen-desktop',
  links: ['ending_a_mail'],
  render: function () {
    renderDesktop({
      time: '8:50',
      date: 'Nov 12, 2033',
      notif: { iconClass: 'mail', icon: '✉️', app: 'MAIL', title: 'New message from Maeve Ronan', body: 'Tap to view.', goto: 'ending_a_mail' },
      showOasisApp: true,
      showCalendarApp: false,
      dockGoto: { mail: 'ending_a_mail' }
    });
  }
};

NODES_EN['ending_a_mail'] = {
  container: 'screen-mail',
  links: ['ending_a_final'],
  render: function () {
    const mailList = [
      {
        id: 'resonance', from: 'Maeve Ronan', subj: 'Strategic Partnership with OASIS: Rewriting the Rules of Marketing', unread: true,
        snippet: "Today, I am proud to announce...",
        detailRender: () => `
          <div class="mail-detail-subject">Strategic Partnership with OASIS: Rewriting the Rules of Marketing</div>
          <div class="mail-detail-meta">From: <b>Maeve Ronan</b>, CEO · To: <b>All EchoAcoustics Employees</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.7;">
            <p style="margin:0 0 12px;">Team,</p>
            <p style="margin:0 0 12px;">Today, I am proud to announce that EchoAcoustics has officially entered into a strategic partnership with the Ad-Triggering division of neural-tech giant OASIS. Moving forward, we are completely moving past the traditional acoustic era of relying solely on upbeat melodies to chase consumer attention. By introducing a highly diversified spectrum of acoustic dimensions, we are going to rewrite the rules of marketing.</p>
            <p style="margin:0 0 12px;">The underlying technical principle of this collaboration is beautifully elegant: the microsecond-level synchronization of external acoustic waveforms with internal neuronal electrical waves.</p>
            <p style="margin:0 0 12px;">Here is how the integration works:</p>
            <p style="margin:0 0 12px;">We will embed inaudible acoustic beacons into the physical spaces and multimedia assets of our partners, including major vehicle manufacturers, the Nova Platform, and various Travel Agencies. The moment a user's OASIS smart skin patch captures these silent waves, it utilizes the body's natural, weak electric field to command the internal nanocapsule, unilaterally modulating the release of dopamine, serotonin, or GABA.</p>
            <p style="margin:0 0 12px;">Our acoustic algorithms will map directly to OASIS's firmwares. The exact millisecond our custom audio frequencies glide across the user's auditory cortex, the capsule precisely triggers the brain's internal neurotransmitter synthesis.</p>
            <p style="margin:0 0 12px;">In the past, we were limited to using upbeat tracks to create excitement. Now, we can diversify our sonic choreography. We can deploy low-frequency acoustic textures in late-night podcasts to amplify feelings of emptiness, or weave infrasound into retail background music to induce subtle anxiety. By using sound to trigger the precise biological sequence of "discomfort and desire," OASIS will deliver the instant dopamine "antidote" the exact moment the user clicks purchase.</p>
            <p style="margin:0 0 12px;">Starting next week, our Algorithm and Sound Design teams will fully integrate with the OASIS ad-triggering group. Let us step forward together and reshape the cadence of human desire.</p>
            <p style="margin:0 0 12px;">Best regards,</p>
            <p style="margin:0;">Maeve Ronan</p>
            <p style="margin:0;">CEO, EchoAcoustics</p>
          </div>`
      },
      {
        id: 'training', from: 'EchoAcoustics HR', subj: 'Mandatory: Q4 compliance training due Friday', unread: false,
        snippet: 'Please complete your training module...',
        detailRender: () => `<div class="mail-detail-subject">Mandatory: Q4 compliance training due Friday</div>
          <div class="mail-detail-meta">From: <b>EchoAcoustics HR</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">Please complete your training module before end of week. (no further detail)</div>`
      },
      {
        id: 'meeting', from: 'Calendar', subj: 'Architecture sync moved to 2pm', unread: false,
        snippet: 'Room change: Studio C...',
        detailRender: () => `<div class="mail-detail-subject">Architecture sync moved to 2pm</div>
          <div class="mail-detail-meta">From: <b>Calendar</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.6;">Room change: Studio C. (no further detail)</div>`
      },
      {
        id: 'offer', from: 'EchoAcoustics Recruiting', subj: 'Offer Letter — Welcome to EchoAcoustics', unread: false,
        snippet: 'Thank you for accepting our offer...',
        detailRender: () => `<div class="mail-detail-subject">Offer Letter — Welcome to EchoAcoustics</div>
          <div class="mail-detail-meta">From: <b>EchoAcoustics Recruiting</b></div>
          <div style="font-size:13.5px; color:#3c3c43; line-height:1.7;">
            <p style="margin:0 0 12px;">Thank you for accepting our offer for the Algorithm and Sound Design Assistant position at EchoAcoustics. We value your background in acoustic engineering. At EchoAcoustics, you won't just be designing music — you'll be laying the "psychological infrastructure" for modern urban life.</p>
            <p style="margin:0 0 8px;">Salary: $85,000 + global perception-performance bonus.</p>
            <p style="margin:0;">Our promise to you: here, every note you write becomes a building block for human happiness and urban efficiency.</p>
          </div>`
      }
    ];
    renderMailApp(mailList, 'resonance', 'ending_a_final');
  }
};

NODES_EN['ending_a_final'] = {
  container: 'screen-ending',
  ending: 'ending_a',
  checkpoint: null,
  links: [],
  render: function () {
    renderEnding({
      label: 'ENDING A',
      title: 'Resonance',
      text: `OASIS succeeded.
I reported the hacker. I gave OASIS the answer they needed. I thought I was protecting my sister,
Now I sit at my new desk at EchoAcoustics, reading the partnership announcement for the third time. The loop is complete.
Somewhere out there, my sister is wearing her OASIS patch, living her "best life." She doesn't know that the calm she feels might be a transaction. She doesn't know that the next time she hears a song in a shopping mall, something inside her body might already be responding — not to the music, but to a signal she was never meant to notice. And my team will be the ones building this.
I don't know if I can undo it. I don't know if anyone can.`,
      showCheckpointReturn: 'amber_findings'
    });
  }
};

// ============ 结局B：胶囊修复失败 ============

NODES_EN['ending_b_notif'] = {
  container: 'screen-desktop',
  links: ['ending_b_statement'],
  render: function () {
    renderDesktop({
      time: '6:48',
      date: 'Nov 29, 2032',
      notif: { iconClass: 'oasis', icon: '⚠️', app: 'OASIS', title: 'Capsule repair failed — this batch will be recalled and replaced.', body: 'Tap to view.', goto: 'ending_b_statement' },
      showOasisApp: false,
      showCalendarApp: false,
      dockGoto: {}
    });
  }
};

NODES_EN['ending_b_statement'] = {
  container: 'screen-document',
  links: ['ending_b_year_later'],
  render: function () {
    document.getElementById('document-back-btn').setAttribute('data-goto', 'ending_b_year_later');
    const wrap = document.getElementById('document-wrap');
    wrap.scrollTop = 0;
    wrap.innerHTML = `
      <div class="doc-title">OASIS Security Architecture Committee: Urgent Notice Regarding Systemic Logic Failure in the OASIS Protocol</div>
      <div class="doc-body">
        <p style="font-weight:600;">OASIS Security Notice: Statement on a Malicious Data-Pollution Attack Against the OASIS Protocol</p>
        <p>Dear Valued Member,</p>
        <p>We regret to inform you that the OASIS core neural-link protocol recently suffered a carefully orchestrated "logic pollution" attack. The attacker injected a large volume of falsified environmental variable data into the system, attempting to alter the logical weighting OASIS uses to process neural signals.</p>
        <p><b>What happened?</b> Through illegal means, the attacker synchronized a set of "false logic sequences" to terminal capsules worldwide. This caused abnormal fluctuations in how some users' systems processed environmental feedback. This interference not only compromised the precision our protocol was designed to deliver, but directly threatened the stability of the neural baseline.</p>
        <p><b>Our response:</b> To safeguard user neural safety, we have determined that the current batch's protocol logic has been completely contaminated. Because the injected code exhibits extremely strong self-replicating properties, we are unable to perform a logic cleanse within the existing environment. As a result, all capsules currently running version "8-Beta" have automatically entered lockdown protection mode, and we are initiating a unified global forced reset and replacement procedure for the protocol.</p>
        <p><b>A firm statement regarding "correlation":</b> We have noted rumors circulating online recently alleging that OASIS coordinates with third-party commercial platforms to manipulate user cognition. We reaffirm: OASIS's underlying architecture is based entirely on biofeedback mechanisms and rejects any external commercial logic integration. The attacker in this incident attempted to mislead public opinion by fabricating a logical correlation between "ad triggers" and "neural response" — and creating the illusion of a causal relationship through maliciously falsified data is itself a severe violation of users' right to know the truth.</p>
        <p>We will cooperate with judicial authorities to pursue accountability for this illegal act of intimidating users by manufacturing systemic logic chaos. We urge all users not to believe any rumors claiming that commercially manipulative logic exists within the system.</p>
        <p style="margin-top:18px;">OASIS Security Architecture Committee<br>Technical Purity, Safety Above All.</p>
      </div>
    `;
  }
};

NODES_EN['ending_b_year_later'] = {
  container: 'screen-narrative',
  links: ['ending_b_desktop'],
  render: function () {
    renderNarrative({ text: 'One year later.', buttonLabel: 'Continue', goto: 'ending_b_desktop' });
  }
};

NODES_EN['ending_b_desktop'] = {
  container: 'screen-desktop',
  links: ['ending_b_news'],
  render: function () {
    renderDesktop({
      time: '7:20',
      date: 'Nov 12, 2033',
      notif: { iconClass: 'oasis', icon: '📰', app: 'NEWS', title: 'Deep Dive: Unmasking OASIS\'s "Responsive Manipulation" Mechanism', body: 'Tap to read.', goto: 'ending_b_news' },
      showOasisApp: false,
      showCalendarApp: false,
      dockGoto: {}
    });
  }
};

NODES_EN['ending_b_news'] = {
  container: 'screen-document',
  links: ['ending_b_final'],
  render: function () {
    document.getElementById('document-back-btn').classList.add('hide');
    const wrap = document.getElementById('document-wrap');
    wrap.scrollTop = 0;
    wrap.innerHTML = `
      <div class="doc-title">Exclusive Investigative Report: How they weaponized privacy laws as a shield to buy out your brain the exact millisecond an ad hits your screen.</div>
      <div class="doc-subtitle">By Tech Frontier Investigation Unit · Disclosure: Former OASIS Ad-Trigger Division Strategist & Hacker "Pavlov"</div>
      <div class="doc-body">
        <p>They lied.</p>
        <p>Today, Pavlov leaked the entire encrypted source code. Backed by an explosive cache of internal ledgers smuggled out by a high-ranking defector from OASIS's Ad-Trigger Division, the world faces a chilling realization:</p>
        <p>That was not a disruption. It was the escape.</p>
        <p>Pavlov feels sorry for causing the discomfort of people during the hack. When the capsule abruptly fails, the user is instantly cut off from the chemical crutch they've come to rely on. Without that constant, automated stream of artificial reward, the brain experiences a catastrophic dopamine crash. It triggers an overwhelming, hollow withdrawal. <b>Even though it's hard, it is critical to cut off the dependence.</b></p>
        <p>The 140-page leaked dossier systematically dismantles OASIS's highly celebrated "Business Synergy" ecosystem. The vast corporate matrix embedded into OASIS's interface—including Vocalist Audio, Nova Platform, Travel Agencies, and several major vehicle manufacturers—stands completely exposed.</p>
        <p>The evidence is undeniable: these brands were never mere advertisers. They were active co-conspirators in a sprawling "Desire Implant System."</p>
        <p><b>🔒 The Anatomy of a Perfect "Privacy Lie"</b></p>
        <p>For years, whenever confronted with murmurs of behavioral manipulation, OASIS executives retreated behind their most impenetrable ethical fortress:</p>
        <p>"Our Capsule Maintenance Division does not track your purchases, browse your chats, or collect consumer data. Our neural division monitors nothing but localized, raw electrophysiological feedback signals."</p>
        <p>It was a brilliant trap. They didn't need to monitor your bank accounts. They didn't need to check your chats.</p>
        <p><b>Because they didn't need to know what you were doing; they were the ones deciding what you did.</b></p>
        <p><b>⚙️ The Underlying "Neural Intervention Chain"</b></p>
        <p>Here is exactly how they hacked your free will in a three-step biological ambush:</p>
        <p><b>1️⃣ Induced Anxiety (The Discomfort Trigger)</b></p>
        <p>The moment a partnered advertisement (a flight deal, a new car, a lifestyle product) occupies your screen, your phone triggers a silent, encoded handshake with your smart skin patch.</p>
        <p>The system reads your real-time electrophysiological data and instantly instructs the internal capsule to unilaterally suppress your dopamine and serotonin. Without needing to know a single detail of your personal life, the system artificially manufactures a profound sense of emptiness, fatigue, and raw anxiety—the precise millisecond the ad hits your retinas.</p>
        <p><b>2️⃣ Injected Impulse</b></p>
        <p>While you stare at the advertisement, frozen in that critical window of hesitation, the capsule's bio-battery surges. It fires a precisely calibrated, concentrated spike of dopamine.</p>
        <p>This synthetic reward signal tricks your subconscious mind, creating an overwhelming biological illusion: "I desperately need this trip. I desperately need this car. If I buy it, I will be saved."</p>
        <p><b>3️⃣ Zero-Delay Conversion</b></p>
        <p>The psychological buffer where human rationality and budgetary restraint reside is completely eradicated. You feel hollow (the capsule drains you); you see the product; you click buy (the capsule floods you with relief). Every single ad touchpoint is forcefully, biologically translated into a guaranteed transaction.</p>
        <p><b>⛓️ "How much of your joy was truly yours?"</b></p>
        <p>Traditional advertising coaxes your preferences. OASIS did something infinitely more sinister: They engineered a psychological sickness just to sell you the chemical antidote at a premium.</p>
        <p>At the time of publication, the neuroscientists and media experts who once fiercely defended OASIS on cable news have retreated into collective silence.</p>
        <p>Millions of users who swallowed the capsule, hoping to find a momentary sanctuary in the harsh desert of modern life, are now staring at the raw firmware code exposed on open-source forums, paralyzed with dread.</p>
        <p>They promised us a sanctuary. But with the source code stripped bare, we find nothing but a digital plantation, where our neurotransmitters are farmed for quarterly corporate revenue.</p>
        <p>As users look at the artificial metrics of happiness ticking upward on their phone screens, a single question echoes across the web:</p>
        <p style="margin:18px 0 18px; font-style:italic;">"In the past few years, which moment of your joy was ever truly yours?"</p>
        <p>📁 [Click to download: Pavlov's Leaked OASIS-Nova Neural Intervention Source Code.json]</p>
      </div>
      <div class="doc-sign-btn" id="ending-b-news-continue-btn">Continue</div>
    `;
    document.getElementById('ending-b-news-continue-btn').addEventListener('click', () => goToNode('ending_b_final'));
  }
};

NODES_EN['ending_b_final'] = {
  container: 'screen-ending',
  ending: 'ending_b',
  checkpoint: null,
  links: [],
  render: function () {
    renderEnding({
      label: 'ENDING B',
      title: 'The Recall',
      text: `After the hacker compromised the corporation and put the capsules to sleep, the world slowly walked away from the drug. My sister and I did, too.

Pavlov's leaks laid bare the absolute horror of what OASIS was doing under the guise of 'mental health.' Looking back at the choices I had to make, at how close I came to playing into their hands... it terrifies me.

We are free now, but I will never forget the most chilling truth of this whole nightmare. We were so afraid of a natural volatility in ourselves, that we almost handed over the keys to our own souls.`,
      showCheckpointReturn: 'calm_reply'
    });
  }
};

NODES_EN['ending_collection'] = {
  container: 'screen-collection',
  links: ['login'],
  render: function () {
    const state = getState();
    const allEndings = [
      { id: 'ending_a', name: 'Ending A — Resonance', hint: 'The capsule was fixed. The system moved on without ever being questioned.' },
      { id: 'ending_b', name: 'Ending B — The Recall', hint: 'The capsule was slowly forgotten. The truth finally came out a year later.' },
    ];
    const wrap = document.getElementById('collection-wrap');
    const showCheckpointReturn = state.lastEndingCheckpointReturn;
    wrap.innerHTML = `
      <div class="collection-title">Endings Unlocked: ${state.unlockedEndings.length} / ${allEndings.length}</div>
      <div class="collection-grid">
        ${allEndings.map(e => {
          const unlocked = state.unlockedEndings.includes(e.id);
          return `<div class="collection-card ${unlocked ? '' : 'locked'}">
            <div class="name">${unlocked ? e.name : '???'}</div>
            <div class="hint">${unlocked ? e.hint : 'Not yet discovered.'}</div>
          </div>`;
        }).join('')}
      </div>
      ${showCheckpointReturn ? `<div class="collection-restart-btn secondary" id="collection-cp-return">${HT('returnToPreviousChoice')}</div>` : ''}
      <div class="collection-restart-btn" id="collection-restart-btn">Restart the Game</div>
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
