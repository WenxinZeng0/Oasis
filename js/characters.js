/* ============================================================
   characters.js — 角色头像数据表
   每个出现头像的角色（玩家好友、NPC）在这里统一定义一次，
   story、profile、chat 等多处复用同一个角色时，直接引用这里的数据，
   而不是各自重复写一遍头像路径/占位色。

   playerName 不在这里 —— 玩家本人当前没有头像展示需求(都是第一人称视角)。

   【当前状态】img 字段暂时全部留空，统一使用色块占位。
   等你把真实图片放进 images/avatars/ 文件夹后，把对应角色的 img
   字段填上文件名（比如 'avatars/shawn.webp'）即可自动切换成真实图片，
   不需要改其他任何代码。
   ============================================================ */

const CHARACTERS = {
  shawn: {
    name: 'Shawn921',
    img: 'avatars/shawn.webp',
    fallback: 'linear-gradient(145deg,#FF9F6B,#C2185B)',
  },
  // 装饰性好友（无实质剧情，仅作氛围）
  mia: {
    name: 'Mia.l',
    img: 'avatars/mia.webp',
    fallback: 'linear-gradient(145deg,#7ec8e3,#3a6ea5)',
  },
  jordan: {
    name: 'jordan_t',
    img: 'avatars/jordan.webp',
    fallback: 'linear-gradient(145deg,#9fd49a,#3f8f5c)',
  },
  priya: {
    name: 'priya92',
    img: 'avatars/priya.webp',
    fallback: 'linear-gradient(145deg,#d9a8e8,#8b4fae)',
  },
  devon: {
    name: 'devon.k',
    img: 'avatars/devon.webp',
    fallback: 'linear-gradient(145deg,#f0c674,#c98a2c)',
  },
  debs: {
    name: 'Debs',
    img: 'avatars/debs.webp',
    fallback: 'linear-gradient(145deg,#8FA3B3,#4A5D6E)',
  },
  amber: {
    name: 'Amber',
    img: 'avatars/amber.webp',
    fallback: 'linear-gradient(145deg,#C9A876,#6E5638)',
  },
  ruth: {
    name: 'Ruth',
    img: 'avatars/ruth.webp',
    fallback: 'linear-gradient(145deg,#E091B0,#8E4A6B)',
  },
  adrian: {
    name: 'Adrian',
    img: 'avatars/adrian.webp',
    fallback: 'linear-gradient(145deg,#7B96A8,#3D5566)',
  },
  // 后续组1会加入：ruth 等角色，在这里继续补充即可
};

function getCharacter(id) {
  return CHARACTERS[id] || { name: id, img: '', fallback: 'linear-gradient(145deg,#9098A5,#5C6370)' };
}
