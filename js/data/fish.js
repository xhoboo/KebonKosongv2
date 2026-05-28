// ══════════════════════════════════════════════════════
//  FISH DATA — 150 ikan (50 Sungai, 50 Danau, 50 Laut)
//  Setiap ikan: { name, emoji, loc, minTime(detik), maxTime(detik),
//                 reward, xpFish, unlock(fishing level), rarityReq }
//  rarityReq: rarity minimum umpan yang dibutuhkan
//  unlock   : level memancing minimum
//  minTime / maxTime:
//    Sungai  : 60–1800 detik  (1–30 menit)
//    Danau   : 900–21600 detik (15 menit–6 jam)
//    Laut    : 3600–86400 detik (1–24 jam)
// ══════════════════════════════════════════════════════

var FISH = {
  // ════════════════════════════════════════════
  //  SUNGAI (50 ikan, unlock 1-100 fishing lv)
  // ════════════════════════════════════════════

  // Common (unlock 1-10)
  ikan_kecil:      { name:'Ikan Kecil',       emoji:'🐟', loc:'sungai', minTime:60,   maxTime:300,  reward:8,    xpFish:2,  unlock:1,  rarityReq:'common'   },
  ikan_mas:        { name:'Ikan Mas',          emoji:'🐠', loc:'sungai', minTime:60,   maxTime:300,  reward:10,   xpFish:2,  unlock:1,  rarityReq:'common'   },
  ikan_lele:       { name:'Lele',              emoji:'🐡', loc:'sungai', minTime:120,  maxTime:600,  reward:14,   xpFish:3,  unlock:2,  rarityReq:'common'   },
  ikan_gabus:      { name:'Gabus',             emoji:'🐟', loc:'sungai', minTime:120,  maxTime:600,  reward:16,   xpFish:3,  unlock:3,  rarityReq:'common'   },
  ikan_nila:       { name:'Nila',              emoji:'🐠', loc:'sungai', minTime:180,  maxTime:720,  reward:20,   xpFish:4,  unlock:4,  rarityReq:'common'   },
  ikan_sepat:      { name:'Sepat',             emoji:'🐡', loc:'sungai', minTime:180,  maxTime:720,  reward:22,   xpFish:4,  unlock:5,  rarityReq:'common'   },
  ikan_betok:      { name:'Betok',             emoji:'🐟', loc:'sungai', minTime:240,  maxTime:900,  reward:26,   xpFish:5,  unlock:6,  rarityReq:'common'   },
  ikan_wader:      { name:'Wader',             emoji:'🐠', loc:'sungai', minTime:240,  maxTime:900,  reward:28,   xpFish:5,  unlock:7,  rarityReq:'common'   },
  ikan_tawes:      { name:'Tawes',             emoji:'🐟', loc:'sungai', minTime:300,  maxTime:1080, reward:32,   xpFish:6,  unlock:8,  rarityReq:'common'   },
  ikan_mujair:     { name:'Mujair',            emoji:'🐡', loc:'sungai', minTime:300,  maxTime:1080, reward:35,   xpFish:6,  unlock:9,  rarityReq:'common'   },

  // Uncommon (unlock 10-25)
  ikan_patin:      { name:'Patin',             emoji:'🐟', loc:'sungai', minTime:360,  maxTime:1200, reward:45,   xpFish:8,  unlock:10, rarityReq:'common'   },
  ikan_baung:      { name:'Baung',             emoji:'🐠', loc:'sungai', minTime:360,  maxTime:1200, reward:50,   xpFish:9,  unlock:11, rarityReq:'common'   },
  ikan_belida:     { name:'Belida',            emoji:'🐡', loc:'sungai', minTime:420,  maxTime:1320, reward:56,   xpFish:10, unlock:12, rarityReq:'common'   },
  ikan_tapah:      { name:'Tapah',             emoji:'🐟', loc:'sungai', minTime:480,  maxTime:1440, reward:62,   xpFish:11, unlock:13, rarityReq:'common'   },
  ikan_jelawat:    { name:'Jelawat',           emoji:'🐠', loc:'sungai', minTime:480,  maxTime:1440, reward:68,   xpFish:12, unlock:14, rarityReq:'common'   },
  ikan_semah:      { name:'Semah',             emoji:'🐡', loc:'sungai', minTime:540,  maxTime:1560, reward:75,   xpFish:13, unlock:15, rarityReq:'uncommon' },
  ikan_seluang:    { name:'Seluang',           emoji:'🐟', loc:'sungai', minTime:540,  maxTime:1560, reward:82,   xpFish:14, unlock:16, rarityReq:'uncommon' },
  ikan_arwana_kecil:{ name:'Arwana Muda',      emoji:'🐠', loc:'sungai', minTime:600,  maxTime:1680, reward:90,   xpFish:15, unlock:18, rarityReq:'uncommon' },
  ikan_bawal_air:  { name:'Bawal Air Tawar',   emoji:'🐡', loc:'sungai', minTime:600,  maxTime:1680, reward:98,   xpFish:16, unlock:20, rarityReq:'uncommon' },
  ikan_gurami:     { name:'Gurami',            emoji:'🐟', loc:'sungai', minTime:660,  maxTime:1800, reward:108,  xpFish:17, unlock:22, rarityReq:'uncommon' },

  // Rare (unlock 25-50)
  ikan_toman:      { name:'Toman',             emoji:'🐠', loc:'sungai', minTime:720,  maxTime:1800, reward:130,  xpFish:20, unlock:25, rarityReq:'uncommon' },
  ikan_hampala:    { name:'Hampala',           emoji:'🐡', loc:'sungai', minTime:720,  maxTime:1800, reward:142,  xpFish:22, unlock:27, rarityReq:'uncommon' },
  ikan_kancra:     { name:'Kancra',            emoji:'🐟', loc:'sungai', minTime:900,  maxTime:1800, reward:156,  xpFish:24, unlock:30, rarityReq:'rare'     },
  ikan_tor:        { name:'Ikan Tor',          emoji:'🐠', loc:'sungai', minTime:900,  maxTime:1800, reward:172,  xpFish:26, unlock:33, rarityReq:'rare'     },
  ikan_peda_emas:  { name:'Peda Emas',         emoji:'✨', loc:'sungai', minTime:1080, maxTime:1800, reward:190,  xpFish:29, unlock:36, rarityReq:'rare'     },
  ikan_labi:       { name:'Ikan Labi',         emoji:'🐡', loc:'sungai', minTime:1080, maxTime:1800, reward:210,  xpFish:32, unlock:39, rarityReq:'rare'     },
  ikan_payau:      { name:'Ikan Payau',        emoji:'🐟', loc:'sungai', minTime:1200, maxTime:1800, reward:232,  xpFish:35, unlock:42, rarityReq:'rare'     },
  ikan_pelangi:    { name:'Ikan Pelangi',      emoji:'🌈', loc:'sungai', minTime:1200, maxTime:1800, reward:255,  xpFish:38, unlock:45, rarityReq:'rare'     },
  ikan_sisik_biru: { name:'Sisik Biru',        emoji:'🔵', loc:'sungai', minTime:1350, maxTime:1800, reward:282,  xpFish:42, unlock:48, rarityReq:'rare'     },
  ikan_perak_sungai:{ name:'Perak Sungai',     emoji:'⚪', loc:'sungai', minTime:1350, maxTime:1800, reward:310,  xpFish:46, unlock:50, rarityReq:'rare'     },

  // Very Rare (unlock 50-70)
  ikan_emas_muda:  { name:'Emas Muda',         emoji:'💛', loc:'sungai', minTime:1440, maxTime:1800, reward:360,  xpFish:52, unlock:52, rarityReq:'rare'     },
  ikan_cermin:     { name:'Ikan Cermin',       emoji:'🔮', loc:'sungai', minTime:1440, maxTime:1800, reward:400,  xpFish:58, unlock:55, rarityReq:'veryrare' },
  ikan_fajar:      { name:'Ikan Fajar',        emoji:'🌅', loc:'sungai', minTime:1500, maxTime:1800, reward:445,  xpFish:64, unlock:58, rarityReq:'veryrare' },
  ikan_malam:      { name:'Ikan Malam',        emoji:'🌙', loc:'sungai', minTime:1500, maxTime:1800, reward:492,  xpFish:70, unlock:61, rarityReq:'veryrare' },
  ikan_bulan_sungai:{ name:'Bulan Sungai',     emoji:'🌕', loc:'sungai', minTime:1560, maxTime:1800, reward:545,  xpFish:77, unlock:64, rarityReq:'veryrare' },
  ikan_kristal_sungai:{ name:'Kristal Sungai', emoji:'💎', loc:'sungai', minTime:1560, maxTime:1800, reward:605,  xpFish:85, unlock:67, rarityReq:'veryrare' },
  ikan_bintang_sungai:{ name:'Bintang Sungai', emoji:'⭐', loc:'sungai', minTime:1620, maxTime:1800, reward:670,  xpFish:93, unlock:70, rarityReq:'veryrare' },

  // Epic (unlock 70-85)
  ikan_naga_kecil: { name:'Naga Kecil',        emoji:'🐉', loc:'sungai', minTime:1620, maxTime:1800, reward:780,  xpFish:105,unlock:72, rarityReq:'epic'     },
  ikan_api_sungai: { name:'Api Sungai',        emoji:'🔥', loc:'sungai', minTime:1680, maxTime:1800, reward:880,  xpFish:118,unlock:75, rarityReq:'epic'     },
  ikan_petir:      { name:'Petir',             emoji:'⚡', loc:'sungai', minTime:1680, maxTime:1800, reward:980,  xpFish:132,unlock:78, rarityReq:'epic'     },
  ikan_awan:       { name:'Awan',              emoji:'☁️', loc:'sungai', minTime:1740, maxTime:1800, reward:1090, xpFish:147,unlock:81, rarityReq:'epic'     },
  ikan_badai:      { name:'Badai',             emoji:'🌪️', loc:'sungai', minTime:1740, maxTime:1800, reward:1210, xpFish:163,unlock:84, rarityReq:'epic'     },

  // Legendary (unlock 85-95)
  ikan_dewa_sungai:{ name:'Dewa Sungai',       emoji:'👑', loc:'sungai', minTime:1770, maxTime:1800, reward:1500, xpFish:200,unlock:87, rarityReq:'legendary'},
  ikan_arwana_emas:{ name:'Arwana Emas',       emoji:'✨', loc:'sungai', minTime:1770, maxTime:1800, reward:1750, xpFish:228,unlock:90, rarityReq:'legendary'},
  ikan_naga_api:   { name:'Naga Api',          emoji:'🐲', loc:'sungai', minTime:1800, maxTime:1800, reward:2000, xpFish:260,unlock:93, rarityReq:'legendary'},

  // Mythical (unlock 95-100)
  ikan_surya_sungai:{ name:'Surya Sungai',     emoji:'☀️', loc:'sungai', minTime:1800, maxTime:1800, reward:2500, xpFish:320,unlock:96, rarityReq:'mythical' },
  ikan_kosmik_sungai:{ name:'Kosmik Sungai',   emoji:'🌌', loc:'sungai', minTime:1800, maxTime:1800, reward:3200, xpFish:400,unlock:98, rarityReq:'mythical' },
  ikan_abadi_sungai:{ name:'Abadi Sungai',     emoji:'♾️', loc:'sungai', minTime:1800, maxTime:1800, reward:4000, xpFish:500,unlock:100,rarityReq:'mythical' },

  // ════════════════════════════════════════════
  //  DANAU (50 ikan, unlock 1-100 fishing lv)
  // ════════════════════════════════════════════

  // Common (unlock 1-10)
  danau_ikan_mas:  { name:'Mas Danau',         emoji:'🐟', loc:'danau',  minTime:900,  maxTime:3600, reward:18,   xpFish:3,  unlock:1,  rarityReq:'common'   },
  danau_nila:      { name:'Nila Danau',        emoji:'🐠', loc:'danau',  minTime:900,  maxTime:3600, reward:22,   xpFish:4,  unlock:1,  rarityReq:'common'   },
  danau_tawes:     { name:'Tawes Danau',       emoji:'🐡', loc:'danau',  minTime:1200, maxTime:4500, reward:28,   xpFish:5,  unlock:2,  rarityReq:'common'   },
  danau_gurami:    { name:'Gurami Danau',      emoji:'🐟', loc:'danau',  minTime:1200, maxTime:4500, reward:32,   xpFish:6,  unlock:3,  rarityReq:'common'   },
  danau_sepat:     { name:'Sepat Danau',       emoji:'🐠', loc:'danau',  minTime:1500, maxTime:5400, reward:38,   xpFish:7,  unlock:4,  rarityReq:'common'   },
  danau_bawal:     { name:'Bawal Danau',       emoji:'🐡', loc:'danau',  minTime:1500, maxTime:5400, reward:44,   xpFish:8,  unlock:5,  rarityReq:'common'   },
  danau_patin:     { name:'Patin Danau',       emoji:'🐟', loc:'danau',  minTime:1800, maxTime:6300, reward:52,   xpFish:9,  unlock:6,  rarityReq:'common'   },
  danau_lele:      { name:'Lele Danau',        emoji:'🐠', loc:'danau',  minTime:1800, maxTime:6300, reward:58,   xpFish:10, unlock:7,  rarityReq:'common'   },
  danau_mujair:    { name:'Mujair Danau',      emoji:'🐡', loc:'danau',  minTime:2100, maxTime:7200, reward:66,   xpFish:11, unlock:8,  rarityReq:'common'   },
  danau_betok:     { name:'Betok Danau',       emoji:'🐟', loc:'danau',  minTime:2100, maxTime:7200, reward:74,   xpFish:12, unlock:9,  rarityReq:'common'   },

  // Uncommon (unlock 10-25)
  danau_gabus:     { name:'Gabus Danau',       emoji:'🐠', loc:'danau',  minTime:2700, maxTime:9000, reward:90,   xpFish:14, unlock:10, rarityReq:'common'   },
  danau_toman:     { name:'Toman Danau',       emoji:'🐡', loc:'danau',  minTime:2700, maxTime:9000, reward:100,  xpFish:16, unlock:11, rarityReq:'common'   },
  danau_hampala:   { name:'Hampala Danau',     emoji:'🐟', loc:'danau',  minTime:3600, maxTime:10800,reward:115,  xpFish:18, unlock:13, rarityReq:'uncommon' },
  danau_jelawat:   { name:'Jelawat Danau',     emoji:'🐠', loc:'danau',  minTime:3600, maxTime:10800,reward:128,  xpFish:20, unlock:15, rarityReq:'uncommon' },
  danau_semah:     { name:'Semah Danau',       emoji:'🐡', loc:'danau',  minTime:4500, maxTime:12600,reward:145,  xpFish:22, unlock:17, rarityReq:'uncommon' },
  danau_kancra:    { name:'Kancra Danau',      emoji:'🐟', loc:'danau',  minTime:4500, maxTime:12600,reward:162,  xpFish:25, unlock:19, rarityReq:'uncommon' },
  danau_baung:     { name:'Baung Danau',       emoji:'🐠', loc:'danau',  minTime:5400, maxTime:14400,reward:182,  xpFish:28, unlock:21, rarityReq:'uncommon' },
  danau_tor:       { name:'Tor Danau',         emoji:'🐡', loc:'danau',  minTime:5400, maxTime:14400,reward:204,  xpFish:31, unlock:23, rarityReq:'uncommon' },
  danau_belida:    { name:'Belida Danau',      emoji:'🐟', loc:'danau',  minTime:6300, maxTime:16200,reward:228,  xpFish:35, unlock:25, rarityReq:'uncommon' },
  danau_tapah:     { name:'Tapah Danau',       emoji:'🐠', loc:'danau',  minTime:6300, maxTime:16200,reward:255,  xpFish:39, unlock:27, rarityReq:'uncommon' },

  // Rare (unlock 27-50)
  danau_pelangi:   { name:'Pelangi Danau',     emoji:'🌈', loc:'danau',  minTime:7200, maxTime:18000,reward:295,  xpFish:44, unlock:29, rarityReq:'rare'     },
  danau_kristal:   { name:'Kristal Danau',     emoji:'💎', loc:'danau',  minTime:7200, maxTime:18000,reward:335,  xpFish:50, unlock:31, rarityReq:'rare'     },
  danau_cermin:    { name:'Cermin Danau',      emoji:'🔮', loc:'danau',  minTime:9000, maxTime:18000,reward:380,  xpFish:56, unlock:33, rarityReq:'rare'     },
  danau_perak:     { name:'Perak Danau',       emoji:'⚪', loc:'danau',  minTime:9000, maxTime:18000,reward:428,  xpFish:63, unlock:35, rarityReq:'rare'     },
  danau_emas:      { name:'Emas Danau',        emoji:'🟡', loc:'danau',  minTime:10800,maxTime:18000,reward:485,  xpFish:71, unlock:37, rarityReq:'rare'     },
  danau_fajar:     { name:'Fajar Danau',       emoji:'🌅', loc:'danau',  minTime:10800,maxTime:18000,reward:548,  xpFish:80, unlock:39, rarityReq:'rare'     },
  danau_bulan:     { name:'Bulan Danau',       emoji:'🌕', loc:'danau',  minTime:12600,maxTime:18000,reward:620,  xpFish:90, unlock:41, rarityReq:'rare'     },
  danau_sisik_emas:{ name:'Sisik Emas',        emoji:'✨', loc:'danau',  minTime:12600,maxTime:18000,reward:700,  xpFish:101,unlock:43, rarityReq:'rare'     },
  danau_bintang:   { name:'Bintang Danau',     emoji:'⭐', loc:'danau',  minTime:14400,maxTime:19800,reward:792,  xpFish:113,unlock:45, rarityReq:'rare'     },
  danau_cahaya:    { name:'Cahaya Danau',      emoji:'💫', loc:'danau',  minTime:14400,maxTime:19800,reward:896,  xpFish:127,unlock:47, rarityReq:'rare'     },

  // Very Rare (unlock 47-65)
  danau_merah:     { name:'Merah Danau',       emoji:'🔴', loc:'danau',  minTime:16200,maxTime:19800,reward:1020, xpFish:143,unlock:49, rarityReq:'veryrare' },
  danau_ungu:      { name:'Ungu Danau',        emoji:'🟣', loc:'danau',  minTime:16200,maxTime:19800,reward:1155, xpFish:161,unlock:51, rarityReq:'veryrare' },
  danau_safir:     { name:'Safir Danau',       emoji:'🔵', loc:'danau',  minTime:18000,maxTime:21600,reward:1310, xpFish:182,unlock:54, rarityReq:'veryrare' },
  danau_zamrud:    { name:'Zamrud Danau',      emoji:'💚', loc:'danau',  minTime:18000,maxTime:21600,reward:1480, xpFish:205,unlock:57, rarityReq:'veryrare' },
  danau_topaz:     { name:'Topaz Danau',       emoji:'🟠', loc:'danau',  minTime:18000,maxTime:21600,reward:1675, xpFish:231,unlock:60, rarityReq:'veryrare' },
  danau_rubi:      { name:'Rubi Danau',        emoji:'❤️', loc:'danau',  minTime:19800,maxTime:21600,reward:1900, xpFish:261,unlock:63, rarityReq:'veryrare' },
  danau_berlian:   { name:'Berlian Danau',     emoji:'💎', loc:'danau',  minTime:19800,maxTime:21600,reward:2150, xpFish:295,unlock:65, rarityReq:'veryrare' },

  // Epic (unlock 65-80)
  danau_naga:      { name:'Naga Danau',        emoji:'🐉', loc:'danau',  minTime:21600,maxTime:21600,reward:2500, xpFish:340,unlock:67, rarityReq:'epic'     },
  danau_api:       { name:'Api Danau',         emoji:'🔥', loc:'danau',  minTime:21600,maxTime:21600,reward:2850, xpFish:385,unlock:70, rarityReq:'epic'     },
  danau_petir:     { name:'Petir Danau',       emoji:'⚡', loc:'danau',  minTime:21600,maxTime:21600,reward:3250, xpFish:435,unlock:73, rarityReq:'epic'     },
  danau_badai:     { name:'Badai Danau',       emoji:'🌪️', loc:'danau',  minTime:21600,maxTime:21600,reward:3700, xpFish:490,unlock:76, rarityReq:'epic'     },
  danau_aurora:    { name:'Aurora Danau',      emoji:'🌠', loc:'danau',  minTime:21600,maxTime:21600,reward:4200, xpFish:550,unlock:78, rarityReq:'epic'     },

  // Legendary (unlock 80-92)
  danau_dewa:      { name:'Dewa Danau',        emoji:'👑', loc:'danau',  minTime:21600,maxTime:21600,reward:5000, xpFish:660,unlock:81, rarityReq:'legendary'},
  danau_kosmik:    { name:'Kosmik Danau',      emoji:'🌌', loc:'danau',  minTime:21600,maxTime:21600,reward:6000, xpFish:780,unlock:85, rarityReq:'legendary'},
  danau_abadi:     { name:'Abadi Danau',       emoji:'♾️', loc:'danau',  minTime:21600,maxTime:21600,reward:7200, xpFish:920,unlock:89, rarityReq:'legendary'},

  // Mythical (unlock 93-100)
  danau_surya:     { name:'Surya Danau',       emoji:'☀️', loc:'danau',  minTime:21600,maxTime:21600,reward:9000, xpFish:1100,unlock:93, rarityReq:'mythical'},
  danau_lunar:     { name:'Lunar Danau',       emoji:'🌙', loc:'danau',  minTime:21600,maxTime:21600,reward:11000,xpFish:1320,unlock:96, rarityReq:'mythical'},
  danau_primordial:{ name:'Primordial Danau',  emoji:'🌋', loc:'danau',  minTime:21600,maxTime:21600,reward:14000,xpFish:1650,unlock:99, rarityReq:'mythical'},

  // ════════════════════════════════════════════
  //  LAUT (50 ikan, unlock 1-100 fishing lv)
  // ════════════════════════════════════════════

  // Common (unlock 1-10)
  laut_sardin:     { name:'Sardin',            emoji:'🐟', loc:'laut',   minTime:3600, maxTime:14400,reward:28,   xpFish:5,  unlock:1,  rarityReq:'common'   },
  laut_teri:       { name:'Ikan Teri',         emoji:'🐠', loc:'laut',   minTime:3600, maxTime:14400,reward:32,   xpFish:6,  unlock:1,  rarityReq:'common'   },
  laut_kembung:    { name:'Kembung',           emoji:'🐡', loc:'laut',   minTime:5400, maxTime:21600,reward:40,   xpFish:7,  unlock:2,  rarityReq:'common'   },
  laut_layang:     { name:'Layang',            emoji:'🐟', loc:'laut',   minTime:5400, maxTime:21600,reward:48,   xpFish:8,  unlock:3,  rarityReq:'common'   },
  laut_tongkol:    { name:'Tongkol',           emoji:'🐠', loc:'laut',   minTime:7200, maxTime:28800,reward:58,   xpFish:10, unlock:4,  rarityReq:'common'   },
  laut_cakalang:   { name:'Cakalang',          emoji:'🐡', loc:'laut',   minTime:7200, maxTime:28800,reward:68,   xpFish:11, unlock:5,  rarityReq:'common'   },
  laut_tenggiri:   { name:'Tenggiri',          emoji:'🐟', loc:'laut',   minTime:9000, maxTime:36000,reward:80,   xpFish:13, unlock:6,  rarityReq:'common'   },
  laut_kakap_kecil:{ name:'Kakap Muda',        emoji:'🐠', loc:'laut',   minTime:9000, maxTime:36000,reward:94,   xpFish:15, unlock:7,  rarityReq:'common'   },
  laut_kerapu_kecil:{ name:'Kerapu Muda',      emoji:'🐡', loc:'laut',   minTime:10800,maxTime:43200,reward:110,  xpFish:17, unlock:8,  rarityReq:'common'   },
  laut_barakuda_kecil:{ name:'Barakuda Muda',  emoji:'🐟', loc:'laut',   minTime:10800,maxTime:43200,reward:128,  xpFish:19, unlock:9,  rarityReq:'common'   },

  // Uncommon (unlock 10-25)
  laut_kakap:      { name:'Kakap Merah',       emoji:'🔴', loc:'laut',   minTime:14400,maxTime:50400,reward:155,  xpFish:23, unlock:10, rarityReq:'common'   },
  laut_kerapu:     { name:'Kerapu',            emoji:'🐠', loc:'laut',   minTime:14400,maxTime:50400,reward:178,  xpFish:26, unlock:12, rarityReq:'common'   },
  laut_barakuda:   { name:'Barakuda',          emoji:'🐡', loc:'laut',   minTime:18000,maxTime:57600,reward:205,  xpFish:30, unlock:14, rarityReq:'uncommon' },
  laut_tuna_kecil: { name:'Tuna Muda',         emoji:'🐟', loc:'laut',   minTime:18000,maxTime:57600,reward:236,  xpFish:34, unlock:16, rarityReq:'uncommon' },
  laut_marlin_kecil:{ name:'Marlin Muda',      emoji:'🐠', loc:'laut',   minTime:21600,maxTime:64800,reward:272,  xpFish:39, unlock:18, rarityReq:'uncommon' },
  laut_hiu_kecil:  { name:'Hiu Kecil',         emoji:'🦈', loc:'laut',   minTime:21600,maxTime:64800,reward:312,  xpFish:44, unlock:20, rarityReq:'uncommon' },
  laut_pari_kecil: { name:'Pari Kecil',        emoji:'🐡', loc:'laut',   minTime:25200,maxTime:72000,reward:360,  xpFish:50, unlock:22, rarityReq:'uncommon' },
  laut_gurita_kecil:{ name:'Gurita Muda',      emoji:'🐙', loc:'laut',   minTime:25200,maxTime:72000,reward:415,  xpFish:56, unlock:24, rarityReq:'uncommon' },
  laut_cumi:       { name:'Cumi Raksasa',      emoji:'🦑', loc:'laut',   minTime:28800,maxTime:79200,reward:478,  xpFish:63, unlock:26, rarityReq:'uncommon' },
  laut_lobster_kecil:{ name:'Lobster Muda',    emoji:'🦞', loc:'laut',   minTime:28800,maxTime:79200,reward:548,  xpFish:71, unlock:28, rarityReq:'uncommon' },

  // Rare (unlock 28-50)
  laut_tuna:       { name:'Tuna Besar',        emoji:'🐟', loc:'laut',   minTime:36000,maxTime:72000,reward:640,  xpFish:81, unlock:30, rarityReq:'rare'     },
  laut_marlin:     { name:'Marlin',            emoji:'🐠', loc:'laut',   minTime:36000,maxTime:72000,reward:736,  xpFish:92, unlock:33, rarityReq:'rare'     },
  laut_hiu:        { name:'Hiu',               emoji:'🦈', loc:'laut',   minTime:43200,maxTime:72000,reward:848,  xpFish:105,unlock:36, rarityReq:'rare'     },
  laut_pari:       { name:'Pari Manta',        emoji:'🦀', loc:'laut',   minTime:43200,maxTime:72000,reward:976,  xpFish:119,unlock:39, rarityReq:'rare'     },
  laut_gurita:     { name:'Gurita',            emoji:'🐙', loc:'laut',   minTime:50400,maxTime:72000,reward:1124, xpFish:135,unlock:42, rarityReq:'rare'     },
  laut_lobster:    { name:'Lobster',           emoji:'🦞', loc:'laut',   minTime:50400,maxTime:72000,reward:1294, xpFish:153,unlock:45, rarityReq:'rare'     },
  laut_emas:       { name:'Emas Laut',         emoji:'🟡', loc:'laut',   minTime:57600,maxTime:72000,reward:1490, xpFish:173,unlock:48, rarityReq:'rare'     },
  laut_pelangi:    { name:'Pelangi Laut',      emoji:'🌈', loc:'laut',   minTime:57600,maxTime:72000,reward:1715, xpFish:196,unlock:50, rarityReq:'rare'     },

  // Very Rare (unlock 50-70)
  laut_kristal:    { name:'Kristal Laut',      emoji:'💎', loc:'laut',   minTime:64800,maxTime:79200,reward:2000, xpFish:225,unlock:53, rarityReq:'veryrare' },
  laut_safir:      { name:'Safir Laut',        emoji:'🔵', loc:'laut',   minTime:64800,maxTime:79200,reward:2300, xpFish:255,unlock:56, rarityReq:'veryrare' },
  laut_rubi:       { name:'Rubi Laut',         emoji:'❤️', loc:'laut',   minTime:72000,maxTime:79200,reward:2650, xpFish:290,unlock:59, rarityReq:'veryrare' },
  laut_zamrud:     { name:'Zamrud Laut',       emoji:'💚', loc:'laut',   minTime:72000,maxTime:79200,reward:3050, xpFish:328,unlock:62, rarityReq:'veryrare' },
  laut_berlian:    { name:'Berlian Laut',      emoji:'💎', loc:'laut',   minTime:79200,maxTime:86400,reward:3520, xpFish:372,unlock:65, rarityReq:'veryrare' },
  laut_aurora:     { name:'Aurora Laut',       emoji:'🌠', loc:'laut',   minTime:79200,maxTime:86400,reward:4060, xpFish:422,unlock:68, rarityReq:'veryrare' },
  laut_fajar:      { name:'Fajar Laut',        emoji:'🌅', loc:'laut',   minTime:79200,maxTime:86400,reward:4680, xpFish:478,unlock:70, rarityReq:'veryrare' },

  // Epic (unlock 70-85)
  laut_naga:       { name:'Naga Laut',         emoji:'🐉', loc:'laut',   minTime:82800,maxTime:86400,reward:5500, xpFish:550,unlock:72, rarityReq:'epic'     },
  laut_leviatan:   { name:'Leviatan',          emoji:'🌊', loc:'laut',   minTime:82800,maxTime:86400,reward:6400, xpFish:635,unlock:75, rarityReq:'epic'     },
  laut_kraken:     { name:'Kraken',            emoji:'🦑', loc:'laut',   minTime:84600,maxTime:86400,reward:7500, xpFish:730,unlock:78, rarityReq:'epic'     },
  laut_megalodon:  { name:'Megalodon',         emoji:'🦈', loc:'laut',   minTime:84600,maxTime:86400,reward:8800, xpFish:840,unlock:81, rarityReq:'epic'     },
  laut_poseidon:   { name:'Poseidon Kecil',    emoji:'🔱', loc:'laut',   minTime:86400,maxTime:86400,reward:10200,xpFish:965,unlock:84, rarityReq:'epic'     },

  // Legendary (unlock 85-95)
  laut_dewa_laut:  { name:'Dewa Laut',         emoji:'👑', loc:'laut',   minTime:86400,maxTime:86400,reward:12500,xpFish:1150,unlock:87,rarityReq:'legendary'},
  laut_kosmik:     { name:'Kosmik Laut',       emoji:'🌌', loc:'laut',   minTime:86400,maxTime:86400,reward:15500,xpFish:1400,unlock:90,rarityReq:'legendary'},
  laut_abadi:      { name:'Abadi Laut',        emoji:'♾️', loc:'laut',   minTime:86400,maxTime:86400,reward:19000,xpFish:1700,unlock:93,rarityReq:'legendary'},

  // Mythical (unlock 96-100)
  laut_surya:      { name:'Surya Laut',        emoji:'☀️', loc:'laut',   minTime:86400,maxTime:86400,reward:24000,xpFish:2100,unlock:96,rarityReq:'mythical' },
  laut_singularitas:{ name:'Singularitas',     emoji:'🕳️', loc:'laut',   minTime:86400,maxTime:86400,reward:30000,xpFish:2600,unlock:98,rarityReq:'mythical' },
  laut_primordial: { name:'Primordial Laut',   emoji:'🌋', loc:'laut',   minTime:86400,maxTime:86400,reward:38000,xpFish:3200,unlock:100,rarityReq:'mythical'},

  // ════════════════════════════════════════════
  //  IKAN EKSKLUSIF CUACA
  //  1 ikan per rarity × per lokasi × per cuaca = 84 ikan
  //  weatherReq: 'cerah'|'berawan'|'hujan'|'badai'
  //  Reward ~2× lebih tinggi dari ikan biasa rarity sama
  // ════════════════════════════════════════════

  // ── SUNGAI × CERAH ───────────────────────────
  sungai_wx_cerah_c:   { name:'Sinar Pagi Sungai',   emoji:'🌤️', loc:'sungai', minTime:900,  maxTime:1800, reward:100,   xpFish:13,  unlock:1,  rarityReq:'common',   weatherReq:'cerah'   },
  sungai_wx_cerah_u:   { name:'Cahaya Sungai',        emoji:'✨',  loc:'sungai', minTime:900,  maxTime:1800, reward:320,   xpFish:42,  unlock:15, rarityReq:'uncommon', weatherReq:'cerah'   },
  sungai_wx_cerah_r:   { name:'Fajar Emas Sungai',   emoji:'🌟',  loc:'sungai', minTime:1200, maxTime:1800, reward:700,   xpFish:90,  unlock:30, rarityReq:'rare',     weatherReq:'cerah'   },
  sungai_wx_cerah_vr:  { name:'Arwana Sinar Emas',   emoji:'🌞',  loc:'sungai', minTime:1440, maxTime:1800, reward:1600,  xpFish:185, unlock:50, rarityReq:'veryrare', weatherReq:'cerah'   },
  sungai_wx_cerah_e:   { name:'Naga Sinar Sungai',   emoji:'🐲',  loc:'sungai', minTime:1680, maxTime:1800, reward:3200,  xpFish:420, unlock:70, rarityReq:'epic',     weatherReq:'cerah'   },
  sungai_wx_cerah_l:   { name:'Dewa Cahaya Sungai',  emoji:'💫',  loc:'sungai', minTime:1800, maxTime:1800, reward:7000,  xpFish:920, unlock:85, rarityReq:'legendary',weatherReq:'cerah'   },
  sungai_wx_cerah_m:   { name:'Titan Sinar Sungai',  emoji:'☀️',  loc:'sungai', minTime:1800, maxTime:1800, reward:16000, xpFish:2000,unlock:96, rarityReq:'mythical', weatherReq:'cerah'   },

  // ── SUNGAI × BERAWAN ─────────────────────────
  sungai_wx_berawan_c:  { name:'Kabut Pagi Sungai',  emoji:'🌫️', loc:'sungai', minTime:900,  maxTime:1800, reward:110,   xpFish:14,  unlock:1,  rarityReq:'common',   weatherReq:'berawan' },
  sungai_wx_berawan_u:  { name:'Awan Sungai',         emoji:'⛅',  loc:'sungai', minTime:900,  maxTime:1800, reward:340,   xpFish:44,  unlock:15, rarityReq:'uncommon', weatherReq:'berawan' },
  sungai_wx_berawan_r:  { name:'Nimbus Sungai',       emoji:'🌥️', loc:'sungai', minTime:1200, maxTime:1800, reward:750,   xpFish:95,  unlock:30, rarityReq:'rare',     weatherReq:'berawan' },
  sungai_wx_berawan_vr: { name:'Mendung Perak Sungai',emoji:'🌁', loc:'sungai', minTime:1440, maxTime:1800, reward:1750,  xpFish:200, unlock:50, rarityReq:'veryrare', weatherReq:'berawan' },
  sungai_wx_berawan_e:  { name:'Naga Awan Sungai',   emoji:'🐉',  loc:'sungai', minTime:1680, maxTime:1800, reward:3500,  xpFish:450, unlock:70, rarityReq:'epic',     weatherReq:'berawan' },
  sungai_wx_berawan_l:  { name:'Dewa Mendung Sungai',emoji:'🌩️', loc:'sungai', minTime:1800, maxTime:1800, reward:7500,  xpFish:970, unlock:85, rarityReq:'legendary',weatherReq:'berawan' },
  sungai_wx_berawan_m:  { name:'Titan Awan Sungai',  emoji:'🌑',  loc:'sungai', minTime:1800, maxTime:1800, reward:17000, xpFish:2100,unlock:96, rarityReq:'mythical', weatherReq:'berawan' },

  // ── SUNGAI × HUJAN ───────────────────────────
  sungai_wx_hujan_c:   { name:'Gerimis Sungai',       emoji:'🌧️', loc:'sungai', minTime:900,  maxTime:1800, reward:120,   xpFish:15,  unlock:1,  rarityReq:'common',   weatherReq:'hujan'   },
  sungai_wx_hujan_u:   { name:'Hujan Lebat Sungai',  emoji:'💧',  loc:'sungai', minTime:900,  maxTime:1800, reward:360,   xpFish:46,  unlock:15, rarityReq:'uncommon', weatherReq:'hujan'   },
  sungai_wx_hujan_r:   { name:'Curah Hujan Sungai',  emoji:'🌊',  loc:'sungai', minTime:1200, maxTime:1800, reward:800,   xpFish:100, unlock:30, rarityReq:'rare',     weatherReq:'hujan'   },
  sungai_wx_hujan_vr:  { name:'Arwana Hujan Sungai', emoji:'🫧',  loc:'sungai', minTime:1440, maxTime:1800, reward:1900,  xpFish:215, unlock:50, rarityReq:'veryrare', weatherReq:'hujan'   },
  sungai_wx_hujan_e:   { name:'Naga Hujan Sungai',   emoji:'💦',  loc:'sungai', minTime:1680, maxTime:1800, reward:3800,  xpFish:480, unlock:70, rarityReq:'epic',     weatherReq:'hujan'   },
  sungai_wx_hujan_l:   { name:'Dewa Hujan Sungai',   emoji:'🌈',  loc:'sungai', minTime:1800, maxTime:1800, reward:8200,  xpFish:1050,unlock:85, rarityReq:'legendary',weatherReq:'hujan'   },
  sungai_wx_hujan_m:   { name:'Titan Hujan Sungai',  emoji:'⛈️', loc:'sungai', minTime:1800, maxTime:1800, reward:18500, xpFish:2300,unlock:96, rarityReq:'mythical', weatherReq:'hujan'   },

  // ── SUNGAI × BADAI ───────────────────────────
  sungai_wx_badai_c:   { name:'Angin Kencang Sungai',emoji:'💨',  loc:'sungai', minTime:900,  maxTime:1800, reward:130,   xpFish:16,  unlock:1,  rarityReq:'common',   weatherReq:'badai'   },
  sungai_wx_badai_u:   { name:'Badai Kecil Sungai',  emoji:'⚡',  loc:'sungai', minTime:900,  maxTime:1800, reward:380,   xpFish:48,  unlock:15, rarityReq:'uncommon', weatherReq:'badai'   },
  sungai_wx_badai_r:   { name:'Topan Sungai',         emoji:'🌀',  loc:'sungai', minTime:1200, maxTime:1800, reward:860,   xpFish:105, unlock:30, rarityReq:'rare',     weatherReq:'badai'   },
  sungai_wx_badai_vr:  { name:'Siklon Sungai',        emoji:'🌪️', loc:'sungai', minTime:1440, maxTime:1800, reward:2050,  xpFish:235, unlock:50, rarityReq:'veryrare', weatherReq:'badai'   },
  sungai_wx_badai_e:   { name:'Naga Badai Sungai',   emoji:'⛈️', loc:'sungai', minTime:1680, maxTime:1800, reward:4100,  xpFish:510, unlock:70, rarityReq:'epic',     weatherReq:'badai'   },
  sungai_wx_badai_l:   { name:'Dewa Badai Sungai',   emoji:'🔱',  loc:'sungai', minTime:1800, maxTime:1800, reward:9000,  xpFish:1150,unlock:85, rarityReq:'legendary',weatherReq:'badai'   },
  sungai_wx_badai_m:   { name:'Titan Badai Sungai',  emoji:'🌋',  loc:'sungai', minTime:1800, maxTime:1800, reward:20000, xpFish:2500,unlock:96, rarityReq:'mythical', weatherReq:'badai'   },

  // ── DANAU × CERAH ────────────────────────────
  danau_wx_cerah_c:    { name:'Sinar Pagi Danau',    emoji:'🌤️', loc:'danau',  minTime:5400, maxTime:21600,reward:120,   xpFish:16,  unlock:1,  rarityReq:'common',   weatherReq:'cerah'   },
  danau_wx_cerah_u:    { name:'Cahaya Danau',         emoji:'✨',  loc:'danau',  minTime:7200, maxTime:21600,reward:370,   xpFish:48,  unlock:15, rarityReq:'uncommon', weatherReq:'cerah'   },
  danau_wx_cerah_r:    { name:'Fajar Emas Danau',    emoji:'🌟',  loc:'danau',  minTime:10800,maxTime:21600,reward:1300,  xpFish:145, unlock:30, rarityReq:'rare',     weatherReq:'cerah'   },
  danau_wx_cerah_vr:   { name:'Matahari Danau',       emoji:'🌞',  loc:'danau',  minTime:16200,maxTime:21600,reward:3500,  xpFish:420, unlock:50, rarityReq:'veryrare', weatherReq:'cerah'   },
  danau_wx_cerah_e:    { name:'Naga Sinar Danau',    emoji:'🐲',  loc:'danau',  minTime:21600,maxTime:21600,reward:8000,  xpFish:900, unlock:70, rarityReq:'epic',     weatherReq:'cerah'   },
  danau_wx_cerah_l:    { name:'Dewa Cahaya Danau',   emoji:'💫',  loc:'danau',  minTime:21600,maxTime:21600,reward:18000, xpFish:1900,unlock:85, rarityReq:'legendary',weatherReq:'cerah'   },
  danau_wx_cerah_m:    { name:'Titan Sinar Danau',   emoji:'☀️',  loc:'danau',  minTime:21600,maxTime:21600,reward:40000, xpFish:4200,unlock:96, rarityReq:'mythical', weatherReq:'cerah'   },

  // ── DANAU × BERAWAN ──────────────────────────
  danau_wx_berawan_c:  { name:'Kabut Danau',          emoji:'🌫️', loc:'danau',  minTime:5400, maxTime:21600,reward:130,   xpFish:17,  unlock:1,  rarityReq:'common',   weatherReq:'berawan' },
  danau_wx_berawan_u:  { name:'Awan Danau',            emoji:'⛅',  loc:'danau',  minTime:7200, maxTime:21600,reward:400,   xpFish:51,  unlock:15, rarityReq:'uncommon', weatherReq:'berawan' },
  danau_wx_berawan_r:  { name:'Nimbus Danau',          emoji:'🌥️', loc:'danau',  minTime:10800,maxTime:21600,reward:1400,  xpFish:155, unlock:30, rarityReq:'rare',     weatherReq:'berawan' },
  danau_wx_berawan_vr: { name:'Mendung Perak Danau',  emoji:'🌁',  loc:'danau',  minTime:16200,maxTime:21600,reward:3800,  xpFish:450, unlock:50, rarityReq:'veryrare', weatherReq:'berawan' },
  danau_wx_berawan_e:  { name:'Naga Awan Danau',      emoji:'🐉',  loc:'danau',  minTime:21600,maxTime:21600,reward:8600,  xpFish:960, unlock:70, rarityReq:'epic',     weatherReq:'berawan' },
  danau_wx_berawan_l:  { name:'Dewa Mendung Danau',   emoji:'🌩️', loc:'danau',  minTime:21600,maxTime:21600,reward:19000, xpFish:2000,unlock:85, rarityReq:'legendary',weatherReq:'berawan' },
  danau_wx_berawan_m:  { name:'Titan Awan Danau',     emoji:'🌑',  loc:'danau',  minTime:21600,maxTime:21600,reward:42000, xpFish:4400,unlock:96, rarityReq:'mythical', weatherReq:'berawan' },

  // ── DANAU × HUJAN ────────────────────────────
  danau_wx_hujan_c:    { name:'Gerimis Danau',        emoji:'🌧️', loc:'danau',  minTime:5400, maxTime:21600,reward:140,   xpFish:18,  unlock:1,  rarityReq:'common',   weatherReq:'hujan'   },
  danau_wx_hujan_u:    { name:'Hujan Lebat Danau',    emoji:'💧',  loc:'danau',  minTime:7200, maxTime:21600,reward:430,   xpFish:54,  unlock:15, rarityReq:'uncommon', weatherReq:'hujan'   },
  danau_wx_hujan_r:    { name:'Curah Hujan Danau',    emoji:'🌊',  loc:'danau',  minTime:10800,maxTime:21600,reward:1500,  xpFish:168, unlock:30, rarityReq:'rare',     weatherReq:'hujan'   },
  danau_wx_hujan_vr:   { name:'Arwana Hujan Danau',   emoji:'🫧',  loc:'danau',  minTime:16200,maxTime:21600,reward:4100,  xpFish:485, unlock:50, rarityReq:'veryrare', weatherReq:'hujan'   },
  danau_wx_hujan_e:    { name:'Naga Hujan Danau',     emoji:'💦',  loc:'danau',  minTime:21600,maxTime:21600,reward:9200,  xpFish:1020,unlock:70, rarityReq:'epic',     weatherReq:'hujan'   },
  danau_wx_hujan_l:    { name:'Dewa Hujan Danau',     emoji:'🌈',  loc:'danau',  minTime:21600,maxTime:21600,reward:20000, xpFish:2100,unlock:85, rarityReq:'legendary',weatherReq:'hujan'   },
  danau_wx_hujan_m:    { name:'Titan Hujan Danau',    emoji:'⛈️', loc:'danau',  minTime:21600,maxTime:21600,reward:45000, xpFish:4700,unlock:96, rarityReq:'mythical', weatherReq:'hujan'   },

  // ── DANAU × BADAI ────────────────────────────
  danau_wx_badai_c:    { name:'Angin Kencang Danau',  emoji:'💨',  loc:'danau',  minTime:5400, maxTime:21600,reward:150,   xpFish:19,  unlock:1,  rarityReq:'common',   weatherReq:'badai'   },
  danau_wx_badai_u:    { name:'Badai Kecil Danau',    emoji:'⚡',  loc:'danau',  minTime:7200, maxTime:21600,reward:460,   xpFish:57,  unlock:15, rarityReq:'uncommon', weatherReq:'badai'   },
  danau_wx_badai_r:    { name:'Topan Danau',           emoji:'🌀',  loc:'danau',  minTime:10800,maxTime:21600,reward:1600,  xpFish:178, unlock:30, rarityReq:'rare',     weatherReq:'badai'   },
  danau_wx_badai_vr:   { name:'Siklon Danau',          emoji:'🌪️', loc:'danau',  minTime:16200,maxTime:21600,reward:4400,  xpFish:518, unlock:50, rarityReq:'veryrare', weatherReq:'badai'   },
  danau_wx_badai_e:    { name:'Naga Badai Danau',     emoji:'⛈️', loc:'danau',  minTime:21600,maxTime:21600,reward:9900,  xpFish:1100,unlock:70, rarityReq:'epic',     weatherReq:'badai'   },
  danau_wx_badai_l:    { name:'Dewa Badai Danau',     emoji:'🔱',  loc:'danau',  minTime:21600,maxTime:21600,reward:22000, xpFish:2300,unlock:85, rarityReq:'legendary',weatherReq:'badai'   },
  danau_wx_badai_m:    { name:'Titan Badai Danau',    emoji:'🌋',  loc:'danau',  minTime:21600,maxTime:21600,reward:50000, xpFish:5200,unlock:96, rarityReq:'mythical', weatherReq:'badai'   },

  // ── LAUT × CERAH ─────────────────────────────
  laut_wx_cerah_c:     { name:'Sinar Pagi Laut',      emoji:'🌤️', loc:'laut',   minTime:14400,maxTime:43200,reward:200,   xpFish:26,  unlock:1,  rarityReq:'common',   weatherReq:'cerah'   },
  laut_wx_cerah_u:     { name:'Cahaya Laut',           emoji:'✨',  loc:'laut',   minTime:21600,maxTime:64800,reward:700,   xpFish:80,  unlock:15, rarityReq:'uncommon', weatherReq:'cerah'   },
  laut_wx_cerah_r:     { name:'Fajar Emas Laut',      emoji:'🌟',  loc:'laut',   minTime:43200,maxTime:72000,reward:2500,  xpFish:265, unlock:30, rarityReq:'rare',     weatherReq:'cerah'   },
  laut_wx_cerah_vr:    { name:'Matahari Laut',         emoji:'🌞',  loc:'laut',   minTime:64800,maxTime:79200,reward:8000,  xpFish:700, unlock:50, rarityReq:'veryrare', weatherReq:'cerah'   },
  laut_wx_cerah_e:     { name:'Naga Sinar Laut',      emoji:'🐲',  loc:'laut',   minTime:82800,maxTime:86400,reward:20000, xpFish:1600,unlock:70, rarityReq:'epic',     weatherReq:'cerah'   },
  laut_wx_cerah_l:     { name:'Dewa Cahaya Laut',     emoji:'💫',  loc:'laut',   minTime:86400,maxTime:86400,reward:50000, xpFish:4000,unlock:85, rarityReq:'legendary',weatherReq:'cerah'   },
  laut_wx_cerah_m:     { name:'Titan Sinar Laut',     emoji:'☀️',  loc:'laut',   minTime:86400,maxTime:86400,reward:120000,xpFish:9500,unlock:96, rarityReq:'mythical', weatherReq:'cerah'   },

  // ── LAUT × BERAWAN ───────────────────────────
  laut_wx_berawan_c:   { name:'Kabut Laut',            emoji:'🌫️', loc:'laut',   minTime:14400,maxTime:43200,reward:220,   xpFish:28,  unlock:1,  rarityReq:'common',   weatherReq:'berawan' },
  laut_wx_berawan_u:   { name:'Awan Laut',              emoji:'⛅',  loc:'laut',   minTime:21600,maxTime:64800,reward:750,   xpFish:85,  unlock:15, rarityReq:'uncommon', weatherReq:'berawan' },
  laut_wx_berawan_r:   { name:'Nimbus Laut',            emoji:'🌥️', loc:'laut',   minTime:43200,maxTime:72000,reward:2700,  xpFish:285, unlock:30, rarityReq:'rare',     weatherReq:'berawan' },
  laut_wx_berawan_vr:  { name:'Mendung Perak Laut',   emoji:'🌁',  loc:'laut',   minTime:64800,maxTime:79200,reward:8700,  xpFish:755, unlock:50, rarityReq:'veryrare', weatherReq:'berawan' },
  laut_wx_berawan_e:   { name:'Naga Awan Laut',        emoji:'🐉',  loc:'laut',   minTime:82800,maxTime:86400,reward:21500, xpFish:1720,unlock:70, rarityReq:'epic',     weatherReq:'berawan' },
  laut_wx_berawan_l:   { name:'Dewa Mendung Laut',     emoji:'🌩️', loc:'laut',   minTime:86400,maxTime:86400,reward:53000, xpFish:4250,unlock:85, rarityReq:'legendary',weatherReq:'berawan' },
  laut_wx_berawan_m:   { name:'Titan Awan Laut',       emoji:'🌑',  loc:'laut',   minTime:86400,maxTime:86400,reward:130000,xpFish:10000,unlock:96,rarityReq:'mythical', weatherReq:'berawan' },

  // ── LAUT × HUJAN ─────────────────────────────
  laut_wx_hujan_c:     { name:'Gerimis Laut',          emoji:'🌧️', loc:'laut',   minTime:14400,maxTime:43200,reward:240,   xpFish:30,  unlock:1,  rarityReq:'common',   weatherReq:'hujan'   },
  laut_wx_hujan_u:     { name:'Hujan Lebat Laut',     emoji:'💧',  loc:'laut',   minTime:21600,maxTime:64800,reward:800,   xpFish:90,  unlock:15, rarityReq:'uncommon', weatherReq:'hujan'   },
  laut_wx_hujan_r:     { name:'Curah Hujan Laut',     emoji:'🌊',  loc:'laut',   minTime:43200,maxTime:72000,reward:2900,  xpFish:305, unlock:30, rarityReq:'rare',     weatherReq:'hujan'   },
  laut_wx_hujan_vr:    { name:'Arwana Hujan Laut',    emoji:'🫧',  loc:'laut',   minTime:64800,maxTime:79200,reward:9500,  xpFish:820, unlock:50, rarityReq:'veryrare', weatherReq:'hujan'   },
  laut_wx_hujan_e:     { name:'Naga Hujan Laut',      emoji:'💦',  loc:'laut',   minTime:82800,maxTime:86400,reward:23000, xpFish:1840,unlock:70, rarityReq:'epic',     weatherReq:'hujan'   },
  laut_wx_hujan_l:     { name:'Dewa Hujan Laut',      emoji:'🌈',  loc:'laut',   minTime:86400,maxTime:86400,reward:57000, xpFish:4550,unlock:85, rarityReq:'legendary',weatherReq:'hujan'   },
  laut_wx_hujan_m:     { name:'Titan Hujan Laut',     emoji:'⛈️', loc:'laut',   minTime:86400,maxTime:86400,reward:140000,xpFish:10800,unlock:96,rarityReq:'mythical', weatherReq:'hujan'   },

  // ── LAUT × BADAI ─────────────────────────────
  laut_wx_badai_c:     { name:'Angin Kencang Laut',   emoji:'💨',  loc:'laut',   minTime:14400,maxTime:43200,reward:260,   xpFish:32,  unlock:1,  rarityReq:'common',   weatherReq:'badai'   },
  laut_wx_badai_u:     { name:'Badai Kecil Laut',     emoji:'⚡',  loc:'laut',   minTime:21600,maxTime:64800,reward:850,   xpFish:95,  unlock:15, rarityReq:'uncommon', weatherReq:'badai'   },
  laut_wx_badai_r:     { name:'Topan Laut',            emoji:'🌀',  loc:'laut',   minTime:43200,maxTime:72000,reward:3100,  xpFish:325, unlock:30, rarityReq:'rare',     weatherReq:'badai'   },
  laut_wx_badai_vr:    { name:'Siklon Laut',           emoji:'🌪️', loc:'laut',   minTime:64800,maxTime:79200,reward:10200, xpFish:880, unlock:50, rarityReq:'veryrare', weatherReq:'badai'   },
  laut_wx_badai_e:     { name:'Naga Badai Laut',      emoji:'⛈️', loc:'laut',   minTime:82800,maxTime:86400,reward:25000, xpFish:2000,unlock:70, rarityReq:'epic',     weatherReq:'badai'   },
  laut_wx_badai_l:     { name:'Dewa Badai Laut',      emoji:'🔱',  loc:'laut',   minTime:86400,maxTime:86400,reward:62000, xpFish:5000,unlock:85, rarityReq:'legendary',weatherReq:'badai'   },
  laut_wx_badai_m:     { name:'Titan Badai Laut',     emoji:'🌋',  loc:'laut',   minTime:86400,maxTime:86400,reward:150000,xpFish:12000,unlock:96,rarityReq:'mythical', weatherReq:'badai'   },
};

var FISH_LOCATIONS = ['sungai','danau','laut'];
var FISH_LOC_LABEL = { sungai:'Sungai', danau:'Danau', laut:'Laut', kolam:'Kolam Ikan' };
var FISH_LOC_EMOJI = { sungai:'🏞️', danau:'🏔️', laut:'🌊', kolam:'🐟' };
var FISH_LOC_SLOTS = 20; // slot per lokasi

// XP tabel memancing (level 1-100, jauh lebih lambat dari berkebun)
var FISH_XP_TABLE = (function(){
  var t=[0]; var v=200;
  for(var i=1;i<=100;i++){
    t.push(t[i-1]+Math.round(v));
    var mult = i<=20?1.25:i<=50?1.18:i<=80?1.12:1.08;
    v=Math.round(v*mult);
  }
  return t;
})();

// Rarity dari ikan berdasarkan unlock level memancing
function getFishRarityInfo(unlock) {
  if (unlock <= 15)  return {cls:'common',    label:'Common'};
  if (unlock <= 30)  return {cls:'uncommon',  label:'Uncommon'};
  if (unlock <= 50)  return {cls:'rare',      label:'Rare'};
  if (unlock <= 70)  return {cls:'veryrare',  label:'Very Rare'};
  if (unlock <= 85)  return {cls:'epic',      label:'Epic'};
  if (unlock <= 95)  return {cls:'legendary', label:'Legendary'};
  return                     {cls:'mythical',  label:'Mythical'};
}

// Rarity hierarchy order (untuk cek umpan)
var RARITY_RANK = { common:0, uncommon:1, rare:2, veryrare:3, epic:4, legendary:5, mythical:6 };
