// ══════════════════════════════════════════════════════
//  DATA UPGRADE PERMANEN
//  Upgrade didapat dari Achievement, bukan dibeli dengan koin
// ══════════════════════════════════════════════════════

var UPGRADES = {
  growSpeed: {
    name: 'Pupuk Turbo', emoji: '⚡',
    desc: 'Tanaman tumbuh lebih cepat.',
    effects: ['Tumbuh -15%', 'Tumbuh -30%', 'Tumbuh -45%'],
    maxLevel: 3
  },
  gradeBoost: {
    name: 'Pupuk Premium', emoji: '⭐',
    desc: 'Meningkatkan peluang grade S dan SS saat panen.',
    effects: ['+8% peluang S/SS', '+16% peluang S/SS', '+24% peluang S/SS'],
    maxLevel: 3
  },
  baitYield: {
    name: 'Resep Umpan', emoji: '🪱',
    desc: '+1 umpan ekstra setiap kali membuat umpan.',
    effects: ['+1 umpan/craft', '+2 umpan/craft'],
    maxLevel: 2
  },
  baitLuck: {
    name: 'Keberuntungan Umpan', emoji: '🍀',
    desc: 'Meningkatkan peluang mendapat 2 atau 3 umpan saat membuat umpan.',
    effects: ['×2: 45% | ×3: 15% (dari 30%/10%)'],
    maxLevel: 1
  },
  fishSpeed: {
    name: 'Kail Sakti', emoji: '🎣',
    desc: 'Ikan menyambar lebih cepat.',
    effects: ['Waktu pancing -18%', 'Waktu pancing -36%', 'Waktu pancing -54%'],
    maxLevel: 3
  },
  eggBoost: {
    name: 'Pakan Premium', emoji: '🥚',
    desc: 'Kolam Ikan memproduksi telur lebih cepat.',
    effects: ['+20% produksi telur', '+40% produksi telur', '+60% produksi telur'],
    maxLevel: 3
  }
};
