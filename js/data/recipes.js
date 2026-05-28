// ══════════════════════════════════════════════════════
//  RESEP MASAKAN
// ══════════════════════════════════════════════════════
// kind: 'plant'    → key = plant key, qty = jumlah
// kind: 'fish_loc' → loc = lokasi ikan ('sungai'/'danau'/'laut'), qty = jumlah
// kind: 'cat'      → cat = kategori tanaman ('Buah'/'Sayuran'/'Herbal'/etc), qty = jumlah

var RECIPES = {
  sayur_segar: {
    name: 'Sayur Segar', emoji: '🥗',
    desc: 'Campuran sayuran segar yang menyegarkan',
    ingredients: [
      { kind:'plant', key:'wortel', qty:2 },
      { kind:'plant', key:'selada', qty:1 }
    ],
    reward: 90, xp: 5
  },
  sup_wortel: {
    name: 'Sup Wortel', emoji: '🍲',
    desc: 'Sup hangat dengan wortel segar',
    ingredients: [
      { kind:'plant', key:'wortel', qty:3 },
      { kind:'plant', key:'bawang', qty:1 }
    ],
    reward: 120, xp: 6
  },
  tumis_bawang: {
    name: 'Tumis Bawang', emoji: '🥘',
    desc: 'Tumisan gurih dari bawang dan cabai',
    ingredients: [
      { kind:'plant', key:'bawang', qty:2 },
      { kind:'plant', key:'cabai', qty:1 },
      { kind:'plant', key:'kentang', qty:1 }
    ],
    reward: 150, xp: 8
  },
  salad_buah: {
    name: 'Salad Buah', emoji: '🍱',
    desc: 'Perpaduan buah-buahan segar',
    ingredients: [
      { kind:'cat', cat:'Buah', qty:3 }
    ],
    reward: 200, xp: 10
  },
  sup_ikan: {
    name: 'Sup Ikan', emoji: '🍜',
    desc: 'Sup ikan sungai yang gurih dan segar',
    ingredients: [
      { kind:'plant', key:'wortel', qty:1 },
      { kind:'plant', key:'bawang', qty:1 },
      { kind:'fish_loc', loc:'sungai', qty:1 }
    ],
    reward: 280, xp: 15
  },
  ikan_bakar: {
    name: 'Ikan Bakar', emoji: '🐟',
    desc: 'Ikan danau yang dibakar dengan bumbu pedas',
    ingredients: [
      { kind:'plant', key:'cabai', qty:2 },
      { kind:'fish_loc', loc:'danau', qty:1 }
    ],
    reward: 400, xp: 20
  },
  rebusan_herbal: {
    name: 'Rebusan Herbal', emoji: '🫖',
    desc: 'Ramuan herbal berkhasiat tinggi',
    ingredients: [
      { kind:'cat', cat:'Herbal', qty:3 }
    ],
    reward: 350, xp: 18
  },
  bento_mewah: {
    name: 'Bento Mewah', emoji: '🍱',
    desc: 'Hidangan mewah dari ikan laut pilihan',
    ingredients: [
      { kind:'cat', cat:'Buah', qty:2 },
      { kind:'fish_loc', loc:'laut', qty:2 }
    ],
    reward: 800, xp: 40
  }
};
