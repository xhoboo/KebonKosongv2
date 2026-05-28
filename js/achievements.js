// ══════════════════════════════════════════════════════
//  SISTEM ACHIEVEMENT
// ══════════════════════════════════════════════════════

var ACHIEVEMENTS = [];
(function() {
  var _reward = { key:'autoSlot', label:'\uD83E\uDD16 Slot Otomatis', effect:'+1 slot tanam & panen otomatis' };
  var _list = [
    // 🌻 BUNGA (20)
    ['bunga_matahari','Bunga Matahari','\uD83C\uDF3B','\uD83C\uDF3B Bunga', 150],
    ['tulip','Tulip','\uD83C\uDF37','\uD83C\uDF3B Bunga'],
    ['mawar','Mawar','\uD83C\uDF39','\uD83C\uDF3B Bunga'],
    ['sakura','Sakura','\uD83C\uDF38','\uD83C\uDF3B Bunga'],
    ['lavender','Lavender','\uD83D\uDC90','\uD83C\uDF3B Bunga'],
    ['lotus','Lotus','\uD83E\uDEB7','\uD83C\uDF3B Bunga'],
    ['anyelir','Anyelir','\uD83C\uDF3A','\uD83C\uDF3B Bunga'],
    ['krisan','Krisan','\uD83C\uDF3C','\uD83C\uDF3B Bunga'],
    ['bunga_es','Bunga Es','\u2744\uFE0F','\uD83C\uDF3B Bunga'],
    ['amarilis','Amarilis','\uD83C\uDF37','\uD83C\uDF3B Bunga'],
    ['petunia','Petunia','\uD83E\uDEB9','\uD83C\uDF3B Bunga'],
    ['dahlia','Dahlia','\uD83C\uDF39','\uD83C\uDF3B Bunga'],
    ['gardenia','Gardenia','\uD83C\uDF38','\uD83C\uDF3B Bunga'],
    ['wisteria','Wisteria','\uD83D\uDC9C','\uD83C\uDF3B Bunga'],
    ['magnolia','Magnolia','\uD83C\uDF37','\uD83C\uDF3B Bunga'],
    ['bunga_api','Bunga Api','\uD83D\uDD25','\uD83C\uDF3B Bunga'],
    ['bunga_salju','Bunga Salju','\uD83C\uDF28\uFE0F','\uD83C\uDF3B Bunga'],
    ['bunga_emas','Bunga Emas','\u2B50','\uD83C\uDF3B Bunga'],
    ['bunga_langit','Bunga Langit','\uD83C\uDF24\uFE0F','\uD83C\uDF3B Bunga'],
    ['bunga_fajar','Bunga Fajar','\uD83C\uDF05','\uD83C\uDF3B Bunga'],
    // 🥬 SAYURAN (20)
    ['selada','Selada','\uD83E\uDD6C','\uD83E\uDD6C Sayuran'],
    ['wortel','Wortel','\uD83E\uDD55','\uD83E\uDD6C Sayuran'],
    ['kentang','Kentang','\uD83E\uDD54','\uD83E\uDD6C Sayuran'],
    ['mentimun','Mentimun','\uD83E\uDD52','\uD83E\uDD6C Sayuran'],
    ['tomat','Tomat','\uD83C\uDF45','\uD83E\uDD6C Sayuran'],
    ['bawang','Bawang','\uD83E\uDDC5','\uD83E\uDD6C Sayuran'],
    ['bawang_putih','Bawang Putih','\uD83E\uDDC4','\uD83E\uDD6C Sayuran'],
    ['jagung','Jagung','\uD83C\uDF3D','\uD83E\uDD6C Sayuran'],
    ['cabai','Cabai','\uD83C\uDF36','\uD83E\uDD6C Sayuran'],
    ['terong','Terong','\uD83C\uDF46','\uD83E\uDD6C Sayuran'],
    ['paprika','Paprika','\uD83E\uDED1','\uD83E\uDD6C Sayuran'],
    ['brokoli','Brokoli','\uD83E\uDD66','\uD83E\uDD6C Sayuran'],
    ['jamur','Jamur','\uD83C\uDF44','\uD83E\uDD6C Sayuran'],
    ['labu','Labu','\uD83C\uDF83','\uD83E\uDD6C Sayuran'],
    ['bayam','Bayam','\uD83C\uDF3F','\uD83E\uDD6C Sayuran'],
    ['asparagus','Asparagus','\uD83C\uDF8B','\uD83E\uDD6C Sayuran'],
    ['lobak','Lobak','\u26AA','\uD83E\uDD6C Sayuran'],
    ['bit','Bit','\uD83D\uDD34','\uD83E\uDD6C Sayuran'],
    ['kembang_kol','Kembang Kol','\uD83E\uDD66','\uD83E\uDD6C Sayuran'],
    ['ubi_jalar','Ubi Jalar','\uD83C\uDF60','\uD83E\uDD6C Sayuran'],
    // 🍎 BUAH (20)
    ['stroberi','Stroberi','\uD83C\uDF53','\uD83C\uDF4E Buah'],
    ['pisang','Pisang','\uD83C\uDF4C','\uD83C\uDF4E Buah'],
    ['jeruk','Jeruk','\uD83C\uDF4A','\uD83C\uDF4E Buah'],
    ['lemon','Lemon','\uD83C\uDF4B','\uD83C\uDF4E Buah'],
    ['melon','Melon','\uD83C\uDF48','\uD83C\uDF4E Buah'],
    ['semangka','Semangka','\uD83C\uDF49','\uD83C\uDF4E Buah'],
    ['anggur','Anggur','\uD83C\uDF47','\uD83C\uDF4E Buah'],
    ['apel','Apel','\uD83C\uDF4E','\uD83C\uDF4E Buah'],
    ['pir','Pir','\uD83C\uDF50','\uD83C\uDF4E Buah'],
    ['kiwi','Kiwi','\uD83E\uDD5D','\uD83C\uDF4E Buah'],
    ['persik','Persik','\uD83C\uDF51','\uD83C\uDF4E Buah'],
    ['ceri','Ceri','\uD83C\uDF52','\uD83C\uDF4E Buah'],
    ['nanas','Nanas','\uD83C\uDF4D','\uD83C\uDF4E Buah'],
    ['mangga','Mangga','\uD83E\uDD6D','\uD83C\uDF4E Buah'],
    ['kelapa','Kelapa','\uD83E\uDD65','\uD83C\uDF4E Buah'],
    ['buah_naga','Buah Naga','\uD83D\uDC09','\uD83C\uDF4E Buah'],
    ['alpukat','Alpukat','\uD83E\uDD51','\uD83C\uDF4E Buah'],
    ['jambu','Jambu Merah','\uD83C\uDF4E','\uD83C\uDF4E Buah'],
    ['markisa','Markisa','\uD83D\uDFE1','\uD83C\uDF4E Buah'],
    ['pepaya','Pepaya','\uD83C\uDF48','\uD83C\uDF4E Buah'],
    // 🌾 BIJI (20)
    ['gandum','Gandum','\uD83C\uDF3E','\uD83C\uDF3E Biji'],
    ['padi','Padi','\uD83C\uDF5A','\uD83C\uDF3E Biji'],
    ['kedelai','Kedelai','\uD83E\uDEB8','\uD83C\uDF3E Biji'],
    ['kacang','Kacang Tanah','\uD83E\uDD5C','\uD83C\uDF3E Biji'],
    ['beras_merah','Beras Merah','\uD83C\uDF3E','\uD83C\uDF3E Biji'],
    ['jagung_manis','Jagung Manis','\uD83C\uDF3D','\uD83C\uDF3E Biji'],
    ['wijen','Wijen','\u26AA','\uD83C\uDF3E Biji'],
    ['bunga_matahari_biji','Biji Matahari','\uD83C\uDF3B','\uD83C\uDF3E Biji'],
    ['quinoa','Quinoa','\uD83D\uDFE1','\uD83C\uDF3E Biji'],
    ['chia','Chia','\u26AB','\uD83C\uDF3E Biji'],
    ['flax','Biji Flax','\uD83D\uDD35','\uD83C\uDF3E Biji'],
    ['amaranth','Amaranth','\uD83D\uDD34','\uD83C\uDF3E Biji'],
    ['sorgum','Sorgum','\uD83C\uDF3E','\uD83C\uDF3E Biji'],
    ['millet','Millet','\uD83D\uDFE4','\uD83C\uDF3E Biji'],
    ['barley','Barley','\uD83C\uDF3E','\uD83C\uDF3E Biji'],
    ['biji_emas','Biji Emas','\u2728','\uD83C\uDF3E Biji'],
    ['biji_perak','Biji Perak','\uD83C\uDF1F','\uD83C\uDF3E Biji'],
    ['biji_berlian','Biji Berlian','\uD83D\uDD37','\uD83C\uDF3E Biji'],
    ['biji_api','Biji Api','\uD83D\uDD25','\uD83C\uDF3E Biji'],
    ['biji_langit','Biji Langit','\u2601\uFE0F','\uD83C\uDF3E Biji'],
    // 🌿 HERBAL (20)
    ['jahe','Jahe','\uD83E\uDEBC','\uD83C\uDF3F Herbal'],
    ['kunyit','Kunyit','\uD83D\uDFE1','\uD83C\uDF3F Herbal'],
    ['teh','Teh','\uD83C\uDF75','\uD83C\uDF3F Herbal'],
    ['vanila','Vanila','\uD83C\uDF3F','\uD83C\uDF3F Herbal'],
    ['kopi','Kopi','\u2615','\uD83C\uDF3F Herbal'],
    ['coklat','Coklat','\uD83C\uDF6B','\uD83C\uDF3F Herbal'],
    ['kayu_manis','Kayu Manis','\uD83D\uDFE4','\uD83C\uDF3F Herbal'],
    ['peppermint','Peppermint','\uD83C\uDF3F','\uD83C\uDF3F Herbal'],
    ['rosemary','Rosemary','\uD83D\uDC9A','\uD83C\uDF3F Herbal'],
    ['basil','Basil','\uD83C\uDF31','\uD83C\uDF3F Herbal'],
    ['thyme','Thyme','\uD83C\uDF43','\uD83C\uDF3F Herbal'],
    ['oregano','Oregano','\uD83C\uDF3F','\uD83C\uDF3F Herbal'],
    ['chamomile','Chamomile','\uD83C\uDF3C','\uD83C\uDF3F Herbal'],
    ['sage','Sage','\uD83E\uDED9','\uD83C\uDF3F Herbal'],
    ['lemongrass','Serai','\uD83C\uDF3E','\uD83C\uDF3F Herbal'],
    ['daun_sirih','Daun Sirih','\uD83C\uDF43','\uD83C\uDF3F Herbal'],
    ['lidah_buaya','Lidah Buaya','\uD83C\uDF35','\uD83C\uDF3F Herbal'],
    ['ginseng','Ginseng','\uD83E\uDEBC','\uD83C\uDF3F Herbal'],
    ['herbal_dewa','Herbal Dewa','\u2695\uFE0F','\uD83C\uDF3F Herbal'],
    ['herbal_jiwa','Herbal Jiwa','\uD83D\uDC9C','\uD83C\uDF3F Herbal']
  ];
  for (var _i = 0; _i < _list.length; _i++) {
    var _p = _list[_i];
    var _thresh = _p[4] || 10000;
    ACHIEVEMENTS.push({
      id: 'harvest_' + _p[0],
      plantKey: _p[0],
      emoji: _p[2],
      name: 'Raja ' + _p[1],
      desc: 'Panen ' + _thresh.toLocaleString('id') + ' ' + _p[1],
      sector: _p[3],
      threshold: _thresh,
      reward: _reward
    });
  }
})();

// ──────────────────────────────────────────────────────
//  checkAchievement — tandai sebagai 'unclaimed' (belum diklaim)
// ──────────────────────────────────────────────────────
function checkAchievement(id) {
  if (!G || !G.achievements) return;
  if (G.achievements[id]) return; // sudah unlocked
  var ach = null;
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    if (ACHIEVEMENTS[i].id === id) { ach = ACHIEVEMENTS[i]; break; }
  }
  if (!ach) return;
  G.achievements[id] = 'unclaimed';
  var rewardInfo = ach.reward ? ' (+' + ach.reward.label + ')' : '';
  notify('\uD83C\uDFC6 Achievement: ' + ach.name + '!' + rewardInfo);
  addLog('\uD83C\uDFC6 Achievement: ' + ach.name + (ach.reward ? ' — tekan Klaim!' : ''), 'pos');
  updateAchievementBadge();
  var pg = document.getElementById('page-achievements');
  if (pg && pg.classList.contains('active')) buildAchievementsPage();
}

// ──────────────────────────────────────────────────────
//  checkAllAchievements
// ──────────────────────────────────────────────────────
function checkAllAchievements() {
  if (!G) return;
  for (var _i = 0; _i < ACHIEVEMENTS.length; _i++) {
    var _ach = ACHIEVEMENTS[_i];
    var _pk = _ach.plantKey;
    if (!_pk) continue;
    var _log = G.harvestLog ? G.harvestLog[_pk] : null;
    var _cnt = _log ? ((_log.C||0)+(_log.B||0)+(_log.A||0)+(_log.S||0)+(_log.SS||0)) : 0;
    if (_cnt >= (_ach.threshold || 10000)) checkAchievement(_ach.id);
  }
}

// ──────────────────────────────────────────────────────
//  updateAchievementBadge
// ──────────────────────────────────────────────────────
function updateAchievementBadge() {
  var unlocked = 0, unclaimed = 0;
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    var state = G && G.achievements ? G.achievements[ACHIEVEMENTS[i].id] : null;
    if (state) {
      unlocked++;
      if (state === 'unclaimed') unclaimed++;
    }
  }
  var badge = document.getElementById('achBadge');
  if (badge) badge.textContent = unlocked + '/' + ACHIEVEMENTS.length;
  var btn = document.querySelector('.btn-ach-hud');
  if (btn) btn.classList.toggle('ach-has-reward', unclaimed > 0);
}
