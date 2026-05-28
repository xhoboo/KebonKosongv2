// Pools untuk jurnal Hutan — enemies (encounter) dan empties (narasi kosong).
// Untuk daftar item drop, lihat file terpisah: js/hutan_drops.js.

(function(){
  window.hutanPools = window.hutanPools || {};

  // --- Enemies (encounter narasi) ---
  // Setiap objek: { name: string, quip: string }
  window.hutanPools.enemies = [
    { name: 'Rusa Galak', quip: 'ternyata cuma kesal karena kehilangan selfie stick.' },
    { name: 'Babi Hutan Berambut', quip: 'ia menatapmu dengan ekspresi meminjam gula.' },
    { name: 'Kepiting Liar', quip: 'meminta kompensasi atas tanah yang diinjaknya.' },
    { name: 'Naga Kecil', quip: 'sangat kecil. Seperti naga, tapi minta izin dulu.' },
    { name: 'Kancil Hipster', quip: 'menghakimi pilihan sepatu kamu.' },
    { name: 'Kumbang Besar', quip: 'mengaku sebagai pengawas lalu lintas jamur.' },
    { name: 'Burung Pincang', quip: 'bernyanyi nada yang membuat kompasmu bingung.' },
    { name: 'Ular Keriting', quip: 'melilit rapi seperti kabel charger yang hilang.' },
    { name: 'Harimau Bayangan', quip: 'lebih suka bermain petak umpet daripada berburu.' },
    { name: 'Peri Kesal', quip: 'mencoret peta dengan cat warna cerah sebagai sindiran.' }
  ];

  // --- Empties (narasi kosong / ambience) ---
  window.hutanPools.empties = [
    'Hanya angin yang sedang berlatih monolog stand-up.',
    'Daun berguguran seperti undangan reuni yang tidak pernah datang.',
    'Kamu berdiri, dan momen itu menatap balik.',
    'Terdengar langkah di kejauhan, lalu hening kembali — mungkin hanya ilusi.',
    'Sebuah batu membentuk wajah yang terlalu ramah untuk sebuah batu.',
    'Nyanyian jangkrik mengisi celah-celah waktu.',
    'Sinar matahari menembus celah daun, menggambar peta di tanah.',
    'Ada jejak kecil yang sepertinya bukan milik hewan yang pernah kamu kenal.'
  ];
})();
