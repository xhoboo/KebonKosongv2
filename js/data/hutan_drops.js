// ════════════════════════════════════════════════════════════════
//   ITEM DROP HUTAN  —  Daftar barang yang dapat ditemukan di Hutan
// ════════════════════════════════════════════════════════════════
//
//   ➤ CARA MENAMBAH ITEM:
//     Tambahkan satu baris baru di dalam array `hutanDrops`
//     di bawah, mengikuti format:
//
//        { key: 'kunci_unik', name: 'Nama Item', desc: 'narasi singkat.',
//          minMeter: 0, maxMeter: 500 }
//
//     - key      : ID unik (huruf kecil, gunakan _ sebagai pemisah).
//                  Tidak boleh sama dengan entri lain.
//     - name     : Nama yang ditampilkan di jurnal.
//     - desc     : Kalimat narasi pendek saat item ditemukan.
//     - minMeter : Jarak minimum (meter) agar item bisa drop.
//     - maxMeter : Jarak maksimum (meter) agar item bisa drop.
//                  Gunakan Infinity untuk item tanpa batas atas.
//
//   ➤ CONTOH:
//        { key: 'topi_jamur', name: 'Topi Jamur',
//          desc: 'pas di kepala dan sedikit berbau hujan.',
//          minMeter: 50, maxMeter: 1000 },
//
//   ➤ CATATAN:
//     - File ini WAJIB dimuat SEBELUM js/hutan.js di hutan.html.
//     - Item hanya bisa drop jika meter saat ini berada di rentang
//       minMeter sampai maxMeter (inklusif di kedua ujung).
//     - Jangan menghapus baris `window.hutanPools.loots = hutanDrops;`
//       di bagian bawah — itulah yang membuat daftar aktif.
//
// ════════════════════════════════════════════════════════════════

(function(){
  const hutanDrops = [
    { key: 'roti_basah',        name: 'Sepotong Roti Basah', desc: 'tetapi tetap bergengsi.',                              minMeter: 0,    maxMeter: 200      },
    { key: 'koin_tua',          name: 'Koin Tua',            desc: 'mungkin dari zaman ketika warkop masih buka 24 jam.', minMeter: 0,    maxMeter: 300      },
    { key: 'jamur_ajaib',       name: 'Jamur Ajaib',         desc: 'rasanya seperti kue lapis nostalgia.',                minMeter: 0,    maxMeter: 500      },
    { key: 'batang_kayu_basah', name: 'Batang Kayu Basah',   desc: 'berat, lembap, dan berbau hujan yang belum kering.',  minMeter: 0,    maxMeter: 1000     },
    { key: 'peta_misterius',    name: 'Peta Misterius',      desc: 'dengan tulisan "sesat di sini".',                     minMeter: 50,   maxMeter: 1000     },
    { key: 'buah_langka',       name: 'Buah Langka',         desc: 'berkilau seperti janji yang terlupakan.',             minMeter: 100,  maxMeter: 2000     },
    { key: 'bunga_ember',       name: 'Bunga Ember',         desc: 'mekar meski terkena hujan asam ringan.',              minMeter: 200,  maxMeter: 3000     },
    { key: 'kristal_glow',      name: 'Kristal Bercahaya',   desc: 'memberi cahaya lembut pada malam tanpa bulan.',       minMeter: 500,  maxMeter: 5000     },
    { key: 'sayap_rusak',       name: 'Sayap Rusak',         desc: 'sepotong sayap peri, hangat bila digenggam.',         minMeter: 1000, maxMeter: Infinity }
    // Tambahkan item baru di sini ↓
  ];

  // Daftarkan ke pool agar dipakai oleh js/hutan.js (jangan diubah).
  window.hutanPools = window.hutanPools || {};
  window.hutanPools.loots = hutanDrops;
})();
