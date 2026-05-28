// ════════════════════════════════════════════════════════════════
//   RESEP KERAJINAN — daftar resep untuk halaman Kerajinan
// ════════════════════════════════════════════════════════════════
//
//   ➤ CARA MENAMBAH RESEP BARU:
//     Tambahkan entri pada objek `CRAFT_RECIPES` di bawah.
//     Setiap entri berbentuk:
//
//        kunci_resep: {
//          name:  'Nama Item',
//          emoji: '🎣',
//          desc:  'penjelasan singkat',
//          coinCost: 0,                // opsional, biaya koin
//          ingredients: [              // bahan-bahan
//            { kind: 'plant',    key: 'bunga_matahari', qty: 3 },
//            { kind: 'cat',      cat: 'Biji',           qty: 5 },
//            { kind: 'loot',     key: 'koin_tua',       qty: 1 },
//            { kind: 'bait',     rarity: 'common',      qty: 1 },
//            { kind: 'fish_loc', loc: 'sungai',         qty: 1 }
//          ],
//          output: {
//            kind: 'tool',             // 'tool' = alat dengan daya tahan
//            role: 'fishing_rod',      // 'fishing_rod' = alat pancing (wajib untuk joran)
//            key:  'joran_pancing',    // ID unik output — HARUS UNIK, dipakai di seluruh sistem
//            label:'Joran Pancing',    // nama tampilan
//            emoji:'🎣',
//            durability: 100           // daya tahan awal (untuk kind:'tool')
//          }
//        }
//
//   ➤ JENIS BAHAN (kind):
//     - 'plant'    + key   : tanaman tertentu dari inventory
//     - 'cat'      + cat   : tanaman kategori apa saja (Bunga, Sayuran, Buah, Biji, Herbal)
//     - 'loot'     + key   : item loot Hutan (lihat js/hutan_drops.js)
//     - 'bait'     + rarity: umpan dengan rarity tertentu (common/uncommon/.../mythical)
//     - 'fish_loc' + loc   : ikan dari lokasi (sungai/danau/laut)
//
//   ➤ FILE INI HARUS DIMUAT SEBELUM js/game.js di setiap halaman.
//
// ════════════════════════════════════════════════════════════════

var CRAFT_RECIPES = {
  joran_pancing: {
    name:  'Joran Pancing',
    emoji: '🎣',
    desc:  'Joran kayu sederhana. Wajib dimiliki untuk memancing — 1 joran per slot pancing.',
    coinCost: 50,
    ingredients: [
      { kind: 'loot', key: 'batang_kayu_basah', qty: 1 },
      { kind: 'loot', key: 'koin_tua',    qty: 1 }
    ],
    output: {
      kind: 'tool',
      role: 'fishing_rod',
      key:  'joran_pancing',
      label:'Joran Pancing',
      emoji:'🎣',
      durability: 10
    }
  }
  // Tambahkan resep baru di sini ↓
};

// Katalog alat (kind:'tool') — dipakai untuk tampilan inventory & memancing.
// Otomatis terisi dari CRAFT_RECIPES yang outputnya berupa tool.
var TOOL_CATALOG = (function(){
  var cat = {};
  for (var k in CRAFT_RECIPES) {
    var r = CRAFT_RECIPES[k];
    if (r.output && r.output.kind === 'tool') {
      cat[r.output.key] = {
        label: r.output.label || r.name,
        emoji: r.output.emoji || r.emoji,
        durability: r.output.durability || 100
      };
    }
  }
  return cat;
})();
