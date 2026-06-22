# 图片资源清单与命名规范

游戏代码会**优先尝试加载 `images/` 文件夹下的真实图片**；如果某张图片还没准备好/文件不存在，会自动显示当前的纯色占位块，不会报错、不会出现裂图标志。

所以你可以按自己的节奏陆续把图片放进 `images/` 文件夹，放一张、刷新页面就生效一张，不需要等全部准备齐。

> ⚠️ 本文档为**全量重新整理版**（基于当前代码里实际调用图片的每一处），取代了之前只覆盖序章部分的旧版本。

## 0. 应用图标（images/icons/）— 已生成，无需准备

| 文件名 | 说明 |
|---|---|
| `icons/apple-touch-icon.png` | 已生成完毕✅。用户把网页添加到手机主屏幕时显示的图标：白底黑字"OASIS"，和游戏内登录页的logo视觉风格一致。 |

## 文件夹结构约定

把 `images/` 文件夹放在和 `index.html` 同一层级，内部按用途分四个子文件夹：

```
你的项目根目录/
├── index.html
├── css/
├── js/
└── images/
    ├── icons/     ← 应用图标（已生成完毕，无需准备）
    ├── avatars/   ← 角色头像（正方形，全游戏通用，头像不分章节）
    ├── story/     ← story 故事页背景图
    ├── posts/     ← friends 信息流 / 个人主页里的帖子配图
    ├── sites/     ← 第四章节里debs主页帖子链接出去的虚构网站配图（pat-studio、NOVA等）
    └── chat/      ← 聊天对话里发送的图片
```

**全部图片总数：57 张**（1 应用图标[已生成] + 9 头像 + 6 story + 21 主页帖子 + 14 信息流装饰帖 + 5 网站配图 + 1 聊天图）

---

## 1. 角色头像（images/avatars/）— 共 9 张

所有头像都是**全游戏通用**，在头像出现的每个位置（story圆环、个人主页、聊天头像、信息流帖子头像）共用同一张图，不需要为每个位置单独准备。

| 文件名 | 角色 | 出现位置 |
|---|---|---|
| `avatars/shawn.jpg` | Shawn921 | 第一章节 story / 个人主页 / 聊天 / 信息流 |
| `avatars/mia.jpg` | Mia.l | 全程：装饰性好友头像 |
| `avatars/jordan.jpg` | jordan_t | 全程：装饰性好友头像 |
| `avatars/priya.jpg` | priya92 | 全程：story / feed头像 + 聊天头像 |
| `avatars/devon.jpg` | devon.k | 全程：装饰性好友头像 |
| `avatars/debs.jpg` | Debs / debraluvlulu（玩家妹妹） | 全程：个人主页头像、聊天头像（profile页用户名显示为debraluvlulu，但头像文件名仍用debs） |
| `avatars/amber.jpg` | Amber（OASIS安全专员） | 第三、四章节：聊天头像 |
| `avatars/ruth.jpg` | Ruth | 第二章节：聊天头像 |
| `avatars/adrian.jpg` | Adrian（debs男友） | 第二、四章节：story / 个人主页 / 聊天 |

> 头像会被裁剪成圆形显示，建议准备**居中构图**的照片，重要内容（脸）别太靠边缘，正方形、至少 200×200px。

---

## 2. Story 故事页背景图（images/story/）— 共 6 张

### Shawn 的 story（第一章节，4页，按播放顺序）

| 文件名 | 内容描述 | 配文 |
|---|---|---|
| `story/shawn_1_vacation.jpg` | 自己在度假 | （无配文） |
| `story/shawn_2_car.jpg` | vision board上的车 + 新买的车摆在一起 | "i want it i got it" |
| `story/shawn_3_bar.jpg` | 在酒吧和朋友小酌 | （无配文） |
| `story/shawn_4_keys.jpg` | 拿着车钥匙的笑脸自拍 | "oasis is really helpful guys" |

### Adrian 的 story（第二章节，2页）

| 文件名 | 内容描述 | 配文 |
|---|---|---|
| `story/adrian_1_moody.jpg` | 情绪低落/不耐烦的氛围图（建议偏暗色调） | "some people don't know how good they have it." |
| `story/adrian_2_moody.jpg` | 同上风格，延续情绪 | "gave up everything and this is what I get." |

> Story类图片是**全屏背景图**，竖屏手机壁纸比例最合适（建议 9:16，如 1080×1920）。比例不同会被裁剪填满屏幕（`object-fit: cover`），重要内容建议居中。

---

## 3. 个人主页帖子配图（images/posts/）— 共 31 张

> 第一章节里 Shawn 和 Debs 的主页帖子都标注为 2032年10月20日-11月8日之间发布；第四章节里 Adrian 和 Debs 的主页帖子都标注为 11月8日-11月28日之间发布（与代码里的剧情时间线一致）。

### Shawn 的主页（第一章节，5条，新→旧）

| 文件名 | 日期 | 帖子内容 |
|---|---|---|
| `posts/shawn_p1_gym.jpg` | Nov 7 | "just hit a new PR at the gym 💪" |
| `posts/shawn_p2_roadtrip.jpg` | Nov 3 | "road trip with the boys" |
| `posts/shawn_p3_vocalist.jpg` | Oct 29 | "vocalist arrived and it sounds insane" |
| `posts/shawn_p4_brunch.jpg` | Oct 24 | "midterms can wait, brunch first" |
| `posts/shawn_p5_semester.jpg` | Oct 20 | "new semester new me (jk)" |

### Debs 的主页 — 置顶（全程可见，1条）

| 文件名 | 内容 |
|---|---|
| `posts/debs_pinned_lulu.jpg` | 和腊肠犬lulu的合照（置顶纪念帖，"lulu got me through every single panic attack..."） |

### Debs 的主页 — 第一章节专属（4条，新→旧）

| 文件名 | 日期 | 帖子内容 |
|---|---|---|
| `posts/debs_ch1_p1_journaling.jpg` | Nov 6 | "trying to get back into journaling" |
| `posts/debs_ch1_p2_halloween.jpg` | Oct 31 | "halloween was... a lot 🎃" |
| `posts/debs_ch1_p3_candle.jpg` | Oct 26 | "new candle smells like fall" |
| `posts/debs_ch1_p4_sunday.jpg` | Oct 21 | "slow sunday" |

### Debs 的主页 — 第四章节专属（6条，新→旧，**前3条是关键剧情线索**）

| 文件名 | 日期 | 帖子内容 | 备注 |
|---|---|---|---|
| `posts/debs_ch4_p1_pottery.jpg` | Nov 28 | "made a mug at pat-studio today..." 🏺 | 可点击进入pat-studio页面 |
| `posts/debs_ch4_p2_nova.jpg` | Nov 25 | "signed up to be NOVA!" 🎓 | 可点击进入NOVA页面，剧情关键线索 |
| `posts/debs_ch4_p3_candle.jpg` | Nov 22 | "obsessed with this new candle 🕯️" | 剧情关键线索（不可点击，纯文字+图片） |
| `posts/debs_ch4_p4_slowday.jpg` | Nov 18 | "needed a slow day" | |
| `posts/debs_ch4_p5_playlist.jpg` | Nov 14 | "new playlist for the week" | |
| `posts/debs_ch4_p6_coffee.jpg` | Nov 9 | "coffee run with friends ☕" | |

### Adrian 的主页 — 第二章节专属（2条）

| 文件名 | 日期 | 帖子内容 |
|---|---|---|
| `posts/adrian_ch2_p1_moody.jpg` | Nov 6 | "some people don't know how good they have it." |
| `posts/adrian_ch2_p2_project.jpg` | Oct 30 | "weekend project finally done" |

### Adrian 的主页 — 第四章节专属（3条，新→旧）

| 文件名 | 日期 | 帖子内容 |
|---|---|---|
| `posts/adrian_ch4_p1_sink.jpg` | Nov 26 | "fixed the kitchen sink myself, no big deal" |
| `posts/adrian_ch4_p2_gym.jpg` | Nov 19 | "gym's been good lately" |
| `posts/adrian_ch4_p3_game.jpg` | Nov 12 | "watched the game with the guys" |

> 主页帖子配图为正方形（1:1），ins风格。

---

## 4. Friends 信息流装饰帖配图（images/posts/）— 共 14 张

这些是 friends app 主信息流（不是个人主页）里的帖子配图，会随章节变化（第一章找shawn / 第二章找adrian / 第四章找debs的场景），无剧情意义、优先级较低，可以最后再准备：

### 第一章节（4张）

| 文件名 | 角色 | 帖子内容 |
|---|---|---|
| `posts/feed_debs_lulu.jpg` | debraluvlulu | "lulu got me through every panic attack i've ever had. miss her so much 💔" |
| `posts/feed_mia_sleep.jpg` | Mia.l | "finally caught up on sleep 😴" |
| `posts/feed_jordan_midterms.jpg` | jordan_t | "midterms are kicking my ass lol" |
| `posts/feed_priya_coffee.jpg` | priya92 | "campus coffee > everything" |

### 第二章节（5张）

| 文件名 | 角色 | 帖子内容 |
|---|---|---|
| `posts/feed_adrian_ch2.jpg` | Adrian | "some people don't know how good they have it." |
| `posts/feed_mia_ch2.jpg` | Mia.l | "group chat is unhinged today 💀" |
| `posts/feed_jordan_ch2.jpg` | jordan_t | "finals week survival mode" |
| `posts/feed_priya_ch2.jpg` | priya92 | "late night library run" |
| `posts/feed_devon_ch2.jpg` | devon.k | "weekend hike with the dog" |

### 第四章节（5张）

| 文件名 | 角色 | 帖子内容 |
|---|---|---|
| `posts/feed_debs_ch4.jpg` | debraluvlulu | "made a mug at pat-studio today, such a good experience! 🏺" |
| `posts/feed_adrian_ch4.jpg` | Adrian | "fixed the kitchen sink myself, no big deal"（注：adrian在第四章节信息流里只显示，已不可点击进入主页） |
| `posts/feed_mia_ch4.jpg` | Mia.l | "rainy day, perfect for reading" |
| `posts/feed_priya_ch4.jpg` | priya92 | "group project finally submitted 🙏" |
| `posts/feed_devon_ch4.jpg` | devon.k | "new headphones came in" |

> 这14张优先级较低（纯装饰、无剧情意义），可以最后再准备，或者长期使用占位色块也完全不影响游戏体验。

---

## 5. 第四章节虚构网站配图（images/sites/）— 共 5 张

debs主页里两条帖子链接出去的虚构网站（pat-studio陶艺工作室 / NOVA教育平台），出现在第四章节调查debs账号的剧情里。

> NOVA页面不需要准备照片——首屏的几何线条图形和功能区的3个图标都是直接用代码画的矢量图（SVG），不依赖照片素材。

### PAT Studio（5张，真实人像照片）

| 文件名 | 内容描述 | 建议尺寸/比例 |
|---|---|---|
| `sites/pat_hero_couple_wheel.jpg` | 首屏大图：夫妻两人在陶轮前共同制作一个花瓶的背影特写，光线柔和 | 竖屏，建议 4:5 比例 |
| `sites/pat_about_couple.jpg` | "Our Story"板块：夫妻两人的合影，在工作室忙碌的日常，穿着沾满陶泥的围裙 | 正方形 1:1 |
| `sites/pat_workshop_wheel.jpg` | 课程展示格1：陶轮课程(Wheel Throwing) | 正方形 1:1 |
| `sites/pat_workshop_handbuild.jpg` | 课程展示格2：手捏泥塑(Hand-building) | 正方形 1:1 |
| `sites/pat_workshop_glazing.jpg` | 课程展示格3：上釉过程(Date Night Pottery / 上釉) | 正方形 1:1 |

> 整体设计走温暖手工感的Wabi-Sabi极简风格（陶土色、米色、灰绿色莫兰迪色系），照片建议保持柔和自然光、不要太鲜艳饱和，匹配整体的安静质朴调性。

---

## 6. 聊天图片消息（images/chat/）— 共 1 张

聊天对话过程中，角色发来的照片消息（不是头像，是对话气泡里的一张图）：

| 文件名 | 出现位置 | 内容描述 |
|---|---|---|
| `chat/debs_beach.jpg` | Debs 第一次聊天（第一章节）的对话气泡中 | debs在沙滩发来的照片，配文 "the beach near our old place" |

> 聊天图片消息会显示成对话气泡里的一张卡片（带圆角），比例固定 1:1 正方形，比例不同会被裁剪填满（`object-fit: cover`）。

---

## 命名规则总结（以后新增内容时的参考模式）

- 角色头像：`avatars/{角色id}.jpg`（角色id是小写英文，如 `shawn`、`debs`、`ruth`、`adrian`、`amber`）
- story背景图：`story/{角色id}_{页码}_{内容关键词}.jpg`
- 个人主页帖子配图：`posts/{角色id}_{章节标记}_p{序号}_{内容关键词}.jpg`
- 信息流装饰帖配图：`posts/feed_{角色id}_{内容关键词}.jpg`
- 聊天图片消息：`chat/{角色id}_{内容关键词}.jpg`

文件格式 `.jpg` 只是建议，`.png`/`.webp` 等格式技术上也能用，但如果你换格式，需要告诉我同步改一下代码里的文件名后缀。

**没有列在上面清单里的内容**（比如帖子下方的评论文字、点赞数）都是纯文字，不需要配图。
