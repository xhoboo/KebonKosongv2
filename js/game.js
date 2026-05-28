// ══════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════
var SAVE_KEY = 'kebunGame_v5';

var CAT_BG = {
  Bunga:'#223318', Sayuran:'#2c2208', Buah:'#2a1a08',
  Biji:'#28220a',  Herbal:'#1a2a18',  Langka:'#1a1040'
};

var currentFilter = 'Bunga';
var invFilterCat = '';
var invFilterRarity = '';
var invFilterGrade = '';
var statsSortBy = 'total';
var currentInvTab = 'harvest';
var currentFishLoc = 'sungai';
var invFilterFishLoc = '';
var invFilterFishRarity = '';
var invFilterFishGrade = '';
var _fishSellKey = null, _fishSellGrade = null, _fishSellQty = 1, _fishSellMaxQty = 0;
var _pendingFishSlot = null; // {loc, idx} — slot yang menunggu pilihan umpan
var _sellKey = null, _sellGrade = null, _sellQty = 1, _sellMaxQty = 0, _sellType = 'plant';
var LOOT_CATALOG = {
  jamur_ajaib:      {name:'Jamur Ajaib',         emoji:'🍄', value: 8},
  koin_tua:         {name:'Koin Tua',             emoji:'🪙', value: 10},
  peta_misterius:   {name:'Peta Misterius',       emoji:'🗺️', value: 14},
  roti_basah:       {name:'Sepotong Roti Basah',  emoji:'🥖', value: 4},
  batang_kayu_basah:{name:'Batang Kayu Basah',    emoji:'🪵', value: 3},
  buah_langka:      {name:'Buah Langka',          emoji:'🍎', value: 20},
  bunga_ember:      {name:'Bunga Ember',          emoji:'🌺', value: 30},
  kristal_glow:     {name:'Kristal Bercahaya',    emoji:'💎', value: 50},
  sayap_rusak:      {name:'Sayap Rusak',          emoji:'🪶', value: 80}
};

// ══════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════
var G = {
  coins:100, xp:0, level:1,
  totalHarvest:0, totalEarned:0, totalPlanted:0,
  inventory:{}, inventoryGrades:{}, harvestLog:{}, selectedPlant:'bunga_matahari', tool:'plant',
  slots: Array.from({length:100}, function(_,i){ return {id:i, plant:null, stage:0, timeLeft:0, stageTime:0, autoPlant:null, locked: (i>=5)}; }),
  autoSlotLimit: 0,
  lootInventory:{},
  // Fishing state
  fishXp:0, fishLevel:1, selectedBait:'', selectedJoran:null,
  baitInventory:{},   // key: rarity string, value: count
  fishInventory:{},   // key: fish key, value: count
  fishGrades:{},      // key: fish key, value: {C,B,A,S,SS} (deducted on sell)
  fishLog:{},         // key: fish key, value: {C,B,A,S,SS} (all-time)
  fishSlots:{
    sungai: Array.from({length:20}, function(_,i){ return {id:i, fishKey:null, baitRarity:null, joranId:null, startTime:0, endTime:0, done:false}; }),
    danau:  Array.from({length:20}, function(_,i){ return {id:i, fishKey:null, baitRarity:null, joranId:null, startTime:0, endTime:0, done:false}; }),
    laut:   Array.from({length:20}, function(_,i){ return {id:i, fishKey:null, baitRarity:null, joranId:null, startTime:0, endTime:0, done:false}; })
  },
  // Cuaca
  weather: 'cerah',
  weatherEnd: 0,
  // Upgrade Permanen
  upgrades: {growSpeed:0, gradeBoost:0, baitYield:0, baitLuck:0, fishSpeed:0, eggBoost:0},
  // Achievement
  achievements: {},
  // Kolam Ikan: 12 kolam, tiap kolam {fishKey, count, pendingEggs}
  ponds: Array.from({length:12}, function(){ return {fishKey:null, count:0, pendingEggs:0}; }),
  // Telur Ikan dari kolam: {fishKey: count}
  eggInventory: {},
  // Masakan: {recipeKey: count}
  cookInventory: {},
  // XP keahlian memasak per resep: {recipeKey: totalXp}
  cookXp: {},
  // Alat hasil Kerajinan: {toolKey: [{id, dur}, ...]} — tiap entri = satu alat dengan daya tahan tersisa
  tools: {},
  // ID berikutnya untuk alat (auto-increment)
  nextToolId: 1
};

// ══════════════════════════════════════════════════════
//  DOM CACHE — populated once in boot()
// ══════════════════════════════════════════════════════
var DOM = {};
var slotEls = []; // cached garden slot elements

function cacheDOM() {
  DOM.hCoins        = document.getElementById('hCoins');
  DOM.xpFill        = document.getElementById('xpFill');
  DOM.xpLabel       = document.getElementById('xpLabel');
  DOM.lvlBadge      = document.getElementById('lvlBadge');
  DOM.fishXpFill    = document.getElementById('fishXpFill');
  DOM.fishXpLabel   = document.getElementById('fishXpLabel');
  DOM.fishLvlBadge  = document.getElementById('fishLvlBadge');
  DOM.badgeGarden   = document.getElementById('tabBadgeGarden');
  DOM.badgeFishing  = document.getElementById('tabBadgeFishing');
  DOM.btnHarvestAll = document.getElementById('btnHarvestAll');
  DOM.btnPlantAll   = document.getElementById('btnPlantAll');
  DOM.sEarned       = document.getElementById('sEarned');
  DOM.sPlanted      = document.getElementById('sPlanted');
  DOM.sHarvested    = document.getElementById('sHarvested');
  DOM.infoBar       = document.getElementById('infoBar');
  DOM.logList       = document.getElementById('logList');
  DOM.notif         = document.getElementById('notif');
  DOM.invGrid       = document.getElementById('invGrid');
  DOM.shopGrid      = document.getElementById('shopGrid');
  DOM.shopFilters   = document.getElementById('shopFilters');
  DOM.gardenGrid    = document.getElementById('grid');
  DOM.ssbEmoji      = document.getElementById('ssbEmoji');
  DOM.ssbName       = document.getElementById('ssbName');
  DOM.fishSsbEmoji  = document.getElementById('fishSsbEmoji');
  DOM.fishSsbName   = document.getElementById('fishSsbName');
  DOM.fishLogList   = document.getElementById('fishLogList');
  DOM.toolPlant     = document.getElementById('toolPlant');
  DOM.toolHarvest   = document.getElementById('toolHarvest');
  DOM.invSellAllBtn = document.getElementById('invSellAllBtn');
  DOM.invTotalVal   = document.getElementById('invTotalVal');
  DOM.invFilterCat    = document.getElementById('invFilterCat');
  DOM.invFilterRarity = document.getElementById('invFilterRarity');
  DOM.invFilterGrade  = document.getElementById('invFilterGrade');
  DOM.sellModal       = document.getElementById('sellModal');
  DOM.sellModalEmoji  = document.getElementById('sellModalEmoji');
  DOM.sellModalName   = document.getElementById('sellModalName');
  DOM.sellModalGrade  = document.getElementById('sellModalGrade');
  DOM.sellModalQty    = document.getElementById('sellModalQty');
  DOM.sellModalBtnQty = document.getElementById('sellModalBtnQty');
  DOM.sellModalValue  = document.getElementById('sellModalValue');
  DOM.resetModal      = document.getElementById('resetModal');
  DOM.statsGrid       = document.getElementById('statsAcc');
  DOM.statsSummary    = document.getElementById('statsSummary');
  DOM.statsSortBy     = document.getElementById('statsSortBy');
}

// ══════════════════════════════════════════════════════
//  TABS
// ══════════════════════════════════════════════════════
function switchTab(tab) {
  ['shop','garden','inv','stats','fishing','craft','cook','achievements'].forEach(function(t) {
    var pageEl = document.getElementById('page-'+t);
    if (pageEl) pageEl.classList.toggle('active', t===tab);
    var tabEl = document.getElementById('tab-'+t);
    if (tabEl) tabEl.classList.toggle('active', t===tab);
  });
  if (tab==='garden')       setSelectedSeedBox();
  if (tab==='inv')          buildInventoryPage();
  if (tab==='shop')         buildShopGrid();
  if (tab==='stats') {
    var pageEl = document.getElementById('page-stats');
    if (pageEl) buildStatsPage();
    else {
      try { window.location.href = 'kebun.html#stats'; } catch(e) {}
    }
  }
  if (tab==='fishing')      { if (currentFishLoc === 'kolam') { setSelectedBaitBox(); setSelectedJoranBox(); buildPondLocation(); } else { buildFishPage(currentFishLoc); setSelectedBaitBox(); setSelectedJoranBox(); } }
  if (tab==='craft')        buildCraftPage();
  if (tab==='cook')         buildCookPage();
  if (tab==='achievements') buildAchievementsPage();
}

// ══════════════════════════════════════════════════════
//  RESET
// ══════════════════════════════════════════════════════

function confirmReset() {
  // Jika halaman memiliki modal reset, tampilkan modal.
  if (DOM && DOM.resetModal) {
    DOM.resetModal.classList.add('show');
    return;
  }
  // Fallback: jika tidak ada modal (mis. di index.html), pakai konfirmasi browser
  if (confirm('⚠️ Reset Game? Semua progress akan dihapus permanen. Lanjutkan?')) doReset();
}
function closeModal() {
  if (DOM && DOM.resetModal) {
    DOM.resetModal.classList.remove('show');
  }
}
function doReset() {
  closeModal();
  if (DOM.sellModal) DOM.sellModal.classList.remove('show');
  // Bersihkan data tersimpan (hanya kunci game ini)
  try { localStorage.removeItem(SAVE_KEY); } catch(e) {}
  // Reset seluruh state ke kondisi awal
  G.coins = 100; G.xp = 0; G.level = 1;
  G.totalHarvest = 0; G.totalEarned = 0; G.totalPlanted = 0;
  G.inventory = {}; G.inventoryGrades = {}; G.harvestLog = {}; G.selectedPlant = 'bunga_matahari'; G.tool = 'plant';
  G.slots = Array.from({length:100}, function(_,i){ return {id:i, plant:null, stage:0, timeLeft:0, stageTime:0, autoPlant:null, locked: (i>=5)}; });
  G.autoSlotLimit = 0;
  G.lootInventory = {};
  G.fishXp = 0; G.fishLevel = 1;
  G.baitInventory = {}; G.fishInventory = {}; G.fishGrades = {}; G.fishLog = {};
  G.fishSlots = {
    sungai: Array.from({length:20}, function(_,i){ return {id:i, fishKey:null, baitRarity:null, joranId:null, startTime:0, endTime:0, done:false}; }),
    danau:  Array.from({length:20}, function(_,i){ return {id:i, fishKey:null, baitRarity:null, joranId:null, startTime:0, endTime:0, done:false}; }),
    laut:   Array.from({length:20}, function(_,i){ return {id:i, fishKey:null, baitRarity:null, joranId:null, startTime:0, endTime:0, done:false}; })
  };
  G.tools = {};
  G.nextToolId = 1;
  G.weather = 'cerah'; G.weatherEnd = 0;
  G.upgrades = {growSpeed:0, gradeBoost:0, baitYield:0, baitLuck:0, fishSpeed:0, eggBoost:0};
  G.achievements = {};
  G.ponds = Array.from({length:12}, function(){ return {fishKey:null, count:0, pendingEggs:0}; });
  G.eggInventory = {};
  G.cookInventory = {};
  G.cookXp = {};
  updateAchievementBadge();
  updateWeatherWidget();
  currentInvTab='harvest'; currentFishLoc='sungai';
  addFishXP(0);
  invFilterCat = ''; invFilterRarity = ''; invFilterGrade = '';
  statsSortBy = 'total';
  if (DOM.invFilterCat)    DOM.invFilterCat.value = '';
  if (DOM.invFilterRarity) DOM.invFilterRarity.value = '';
  if (DOM.invFilterGrade)  DOM.invFilterGrade.value = '';
  if (DOM.statsSortBy)     DOM.statsSortBy.value = 'total';
  currentFilter = 'Bunga';
  buildShopFilters(); buildShopGrid();
  refreshAllSlots(); refreshHUD(); addXP(0);
  setSelectedSeedBox(); buildInventoryPage();
  setTool('plant');
  DOM.logList.innerHTML = '';
  addLog('\uD83D\uDDD1 Game direset ke awal!', 'neg');
  notify('\uD83D\uDDD1 Game direset sepenuhnya!');
  setTimeout(function() { window.location.reload(); }, 300);
}

// ══════════════════════════════════════════════════════
//  SAVE / LOAD / IDLE
// ══════════════════════════════════════════════════════
function buildSaveData() {
  var save = {
    coins:G.coins, xp:G.xp, level:G.level,
    totalHarvest:G.totalHarvest, totalEarned:G.totalEarned, totalPlanted:G.totalPlanted,
    inventory:G.inventory, inventoryGrades:G.inventoryGrades, harvestLog:G.harvestLog,
    selectedPlant:G.selectedPlant, slots:G.slots,
    fishXp:G.fishXp, fishLevel:G.fishLevel, selectedBait:G.selectedBait, selectedJoran:G.selectedJoran,
    baitInventory:G.baitInventory, fishInventory:G.fishInventory,
    fishGrades:G.fishGrades, fishLog:G.fishLog, fishSlots:G.fishSlots,
    weather:G.weather, weatherEnd:G.weatherEnd,
    upgrades:G.upgrades, achievements:G.achievements,
    autoSlotLimit:G.autoSlotLimit,
    ponds:G.ponds, eggInventory:G.eggInventory, cookInventory:G.cookInventory,
    cookXp:G.cookXp, lootInventory:G.lootInventory,
    tools:G.tools, nextToolId:G.nextToolId,
    savedAt:Date.now()
  };
  try {
    var raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      var existing = JSON.parse(raw);
      if (existing && typeof existing.hp === 'number') save.hp = existing.hp;
      if (existing && typeof existing.lastHpRegen === 'number') save.lastHpRegen = existing.lastHpRegen;
      if (existing && typeof existing.recordMeter === 'number') save.recordMeter = existing.recordMeter;
    }
  } catch (e) {}
  return save;
}

// Majukan semua tanaman yang sedang tumbuh sebesar `elapsed` detik
function applyOfflineProgress(elapsed) {
  if (elapsed <= 0) return { ready:0, stages:0, autoHarvested:0 };
  // Apply growSpeed upgrade only to plant growth (weather is skipped — changes during offline)
  var rawElapsed = elapsed;
  var gsLv = (G && G.upgrades && G.upgrades.growSpeed) || 0;
  var growMult = gsLv > 0 ? 1 / (1 - gsLv * 0.15) : 1;
  elapsed = rawElapsed * growMult;
  var ready = 0, stages = 0, autoHarvested = 0;
  for (var i = 0; i < 100; i++) {
    var s = G.slots[i];

    // ── AUTO-SLOT: proses panen & tanam ulang berulang selama offline ──
    if (s.autoPlant && s.autoPlant !== '__pending__') {
      var apk = s.autoPlant;
      var ap  = PLANTS[apk];
      if (!ap) continue;
      var arem = elapsed;

      while (arem >= 0) {
        // Jika slot kosong, coba tanam
        if (!s.plant) {
          if (ap.unlock <= G.level && G.coins >= ap.cost) {
            G.coins -= ap.cost;
            G.totalPlanted++;
            var ast = ap.time / 3;
            s.plant = apk; s.stage = 1; s.stageTime = ast; s.timeLeft = ast;
          } else {
            break; // tidak cukup koin / level, berhenti
          }
        }

        // Jika sudah matang (stage 4), panen
        if (s.stage === 4) {
          var ag = rollGradeWithBoost(G.level);
          G.inventory[s.plant] = (G.inventory[s.plant] || 0) + 1;
          if (!G.inventoryGrades[s.plant]) G.inventoryGrades[s.plant] = {C:0,B:0,A:0,S:0,SS:0};
          G.inventoryGrades[s.plant][ag]++;
          if (!G.harvestLog[s.plant]) G.harvestLog[s.plant] = {C:0,B:0,A:0,S:0,SS:0};
          G.harvestLog[s.plant][ag]++;
          G.totalHarvest++;
          G.xp += ap.xp; // akumulasi XP; level-up dihitung ulang di addXP(0) saat boot
          s.plant = null; s.stage = 0; s.timeLeft = 0; s.stageTime = 0;
          autoHarvested++;
          continue; // tanam ulang di iterasi berikutnya
        }

        // Majukan pertumbuhan dengan sisa waktu
        while (arem > 0 && s.stage < 4) {
          if (arem >= s.timeLeft) {
            arem -= s.timeLeft;
            s.stage++; stages++;
            if (s.stage < 4) {
              var ast2 = ap.time / 3;
              s.stageTime = ast2; s.timeLeft = ast2;
            } else {
              s.stageTime = 0; s.timeLeft = 0;
            }
          } else {
            s.timeLeft -= arem;
            arem = 0;
          }
        }

        // Jika sudah stage 4, loop lagi untuk panen; jika waktu habis, berhenti
        if (s.stage < 4) break;
      }
      continue; // lanjut ke slot berikutnya
    }

    // ── SLOT BIASA: majukan stage saja ──
    if (!s.plant || s.stage >= 4) continue;
    var p = PLANTS[s.plant];
    if (!p) continue;
    var rem = elapsed;
    while (rem > 0 && s.stage < 4) {
      if (rem >= s.timeLeft) {
        rem -= s.timeLeft;
        s.stage++; stages++;
        if (s.stage < 4) {
          var st = p.time / 3;
          s.stageTime = st; s.timeLeft = st;
        } else {
          s.stageTime = 0; s.timeLeft = 0; ready++;
        }
      } else {
        s.timeLeft -= rem;
        rem = 0;
      }
    }
  }
  // ── Pond eggs offline: matches online rate of count/2400 per 0.5s tick (= count/1200 per second)
  //    Uses rawElapsed (NOT growSpeed-boosted) and eggBoost upgrade only (weather skipped).
  if (G.ponds && Array.isArray(G.ponds)) {
    var ebLv = (G.upgrades && G.upgrades.eggBoost) || 0;
    var eggMult = 1 + ebLv * 0.2;
    for (var pi = 0; pi < G.ponds.length; pi++) {
      var pp = G.ponds[pi];
      if (!pp || !pp.fishKey || pp.count <= 0) continue;
      pp.pendingEggs = (pp.pendingEggs || 0) + (pp.count * rawElapsed / 1200) * eggMult;
    }
  }
  return { ready:ready, stages:stages, autoHarvested:autoHarvested };
}

// Simpan state ke localStorage
function saveGame() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(buildSaveData())); } catch(e) {}
}

// Muat state dari localStorage; kembalikan hasil offline atau null jika tidak ada save
function loadGame() {
  var raw;
  try { raw = localStorage.getItem(SAVE_KEY); } catch(e) { return null; }
  if (!raw) return null;
  var data;
  try { data = JSON.parse(raw); } catch(e) { return null; }
  G.coins        = typeof data.coins        ==='number' ? data.coins        : 100;
  G.xp           = typeof data.xp           ==='number' ? data.xp           : 0;
  G.level        = typeof data.level        ==='number' ? data.level        : 1;
  G.totalHarvest = typeof data.totalHarvest ==='number' ? data.totalHarvest : 0;
  G.totalEarned  = typeof data.totalEarned  ==='number' ? data.totalEarned  : 0;
  G.totalPlanted = typeof data.totalPlanted ==='number' ? data.totalPlanted : 0;
  G.inventory       = (data.inventory && typeof data.inventory==='object') ? data.inventory : {};
  G.inventoryGrades = (data.inventoryGrades && typeof data.inventoryGrades==='object') ? data.inventoryGrades : {};
  G.harvestLog      = (data.harvestLog && typeof data.harvestLog==='object') ? data.harvestLog : {};
  G.lootInventory   = (data.lootInventory && typeof data.lootInventory==='object') ? data.lootInventory : {};
  G.selectedPlant   = data.selectedPlant || 'bunga_matahari';
  if (Array.isArray(data.slots) && data.slots.length===100) {
    G.slots = data.slots.map(function(s,i){ return Object.assign({id:i,plant:null,stage:0,timeLeft:0,stageTime:0,autoPlant:null, locked: i>=5},s); });
    // Ensure older saves get locked default for slots beyond initial 5
    for (var _si=0; _si<G.slots.length; _si++) {
      if (typeof G.slots[_si].locked !== 'boolean') G.slots[_si].locked = (_si >= 5);
    }
  }
  G.autoSlotLimit = typeof data.autoSlotLimit === 'number' ? data.autoSlotLimit : 0;
  G.fishXp    = typeof data.fishXp    ==='number' ? data.fishXp    : 0;
  G.fishLevel = typeof data.fishLevel ==='number' ? data.fishLevel : 1;
  G.selectedBait  = data.selectedBait || '';
  G.selectedJoran = (typeof data.selectedJoran === 'number') ? data.selectedJoran : null;
  G.baitInventory = (data.baitInventory && typeof data.baitInventory==='object') ? data.baitInventory : {};
  G.fishInventory = (data.fishInventory && typeof data.fishInventory==='object') ? data.fishInventory : {};
  G.fishGrades    = (data.fishGrades    && typeof data.fishGrades==='object')    ? data.fishGrades    : {};
  G.fishLog       = (data.fishLog       && typeof data.fishLog==='object')       ? data.fishLog       : {};
  if (data.fishSlots && typeof data.fishSlots==='object') {
    ['sungai','danau','laut'].forEach(function(loc){
      if (Array.isArray(data.fishSlots[loc]) && data.fishSlots[loc].length===20) {
        G.fishSlots[loc] = data.fishSlots[loc].map(function(s){
          if (s && typeof s.joranId === 'undefined') s.joranId = null;
          return s;
        });
      }
    });
  }
  G.weather      = (data.weather && WEATHERS[data.weather]) ? data.weather : 'cerah';
  G.weatherEnd   = typeof data.weatherEnd   === 'number' ? data.weatherEnd   : 0;
  G.upgrades     = (data.upgrades && typeof data.upgrades === 'object')
    ? Object.assign({growSpeed:0,gradeBoost:0,baitYield:0,baitLuck:0,fishSpeed:0,eggBoost:0}, data.upgrades)
    : {growSpeed:0, gradeBoost:0, baitYield:0, baitLuck:0, fishSpeed:0, eggBoost:0};
  if (data.achievements && typeof data.achievements === 'object') {
    G.achievements = {};
    for (var _ak in data.achievements) {
      // Migrasi format lama (true) → 'claimed'
      G.achievements[_ak] = (data.achievements[_ak] === true) ? 'claimed' : data.achievements[_ak];
    }
  } else { G.achievements = {}; }
  // Clamp upgrade levels ke maxLevel
  G.upgrades.growSpeed = Math.min(G.upgrades.growSpeed || 0, 3);
  G.upgrades.fishSpeed = Math.min(G.upgrades.fishSpeed || 0, 3);
  G.upgrades.baitYield = Math.min(G.upgrades.baitYield || 0, 2);
  G.upgrades.baitLuck  = Math.min(G.upgrades.baitLuck  || 0, 1);
  G.ponds        = (function() {
    if (!Array.isArray(data.ponds)) return Array.from({length:12}, function(){ return {fishKey:null,count:0,pendingEggs:0}; });
    var arr = data.ponds.map(function(p){ return Object.assign({fishKey:null,count:0,pendingEggs:0}, p); });
    while (arr.length < 12) arr.push({fishKey:null, count:0, pendingEggs:0});
    return arr.slice(0, 12);
  })();
  G.eggInventory = (data.eggInventory && typeof data.eggInventory === 'object') ? data.eggInventory : {};
  G.cookInventory= (data.cookInventory && typeof data.cookInventory === 'object') ? data.cookInventory : {};
  G.tools = (data.tools && typeof data.tools === 'object') ? data.tools : {};
  G.nextToolId = typeof data.nextToolId === 'number' ? data.nextToolId : 1;
  // Migrasi cookLevel lama (flat 0-100) ke cookXp
  if (data.cookXp && typeof data.cookXp === 'object') {
    G.cookXp = data.cookXp;
  } else if (data.cookLevel && typeof data.cookLevel === 'object') {
    G.cookXp = {};
    for (var _ck in data.cookLevel) {
      var _oldLv = data.cookLevel[_ck] || 0;
      var _xp = 0;
      for (var _i = 0; _i < _oldLv; _i++) _xp += 10 + _i * 5;
      G.cookXp[_ck] = _xp;
    }
  } else { G.cookXp = {}; }
  if (data.savedAt) {
    var elapsed = (Date.now() - data.savedAt) / 1000;
    var result  = applyOfflineProgress(elapsed);
    result.elapsed = elapsed;
    return result;
  }
  return { ready:0, stages:0, elapsed:0 };
}



// ══════════════════════════════════════════════════════
//  SHOP
// ══════════════════════════════════════════════════════
// Merged getRarity + getRarityLabel into one lookup
function getRarityInfo(unlock) {
  if (unlock <= 20)  return {cls:'common',    label:'Common'};
  if (unlock <= 50)  return {cls:'uncommon',  label:'Uncommon'};
  if (unlock <= 100) return {cls:'rare',      label:'Rare'};
  if (unlock <= 200) return {cls:'veryrare',  label:'Very Rare'};
  if (unlock <= 300) return {cls:'epic',      label:'Epic'};
  if (unlock <  450) return {cls:'legendary', label:'Legendary'};
  return               {cls:'mythical',   label:'Mythical'};
}

function formatTime(s) {
  s = Math.ceil(s);
  if (s >= 86400) { var d=Math.floor(s/86400), hr=Math.floor((s%86400)/3600); return d+'h'+(hr>0?' '+hr+'j':''); }
  if (s >= 3600)  { var h=Math.floor(s/3600),  mn=Math.floor((s%3600)/60);   return h+'j'+(mn>0?' '+mn+'m':''); }
  if (s >= 60)    { var m=Math.floor(s/60); return m+'m'+((s%60)>0?' '+(s%60)+'d':''); }
  return s+'d';
}

// Format angka menjadi singkat untuk jutaan (eg. 1.2M)
function formatShortCost(n) {
  if (typeof n !== 'number') return n;
  var units = [ {v:1e12, s:'T'}, {v:1e9, s:'B'}, {v:1e6, s:'M'} ];
  for (var i=0;i<units.length;i++) {
    var u = units[i];
    if (n >= u.v) {
      var v = Math.round(n / (u.v/100)) / 100; // two decimals
      var out = v.toString().replace(/\.00$/,'');
      return out + u.s;
    }
  }
  return n.toLocaleString();
}

function buildShopFilters() {
  var frag = document.createDocumentFragment();
  CATEGORIES.forEach(function(cat) {
    var b = document.createElement('button');
    b.className = 'filter-btn'+(cat===currentFilter?' active':'');
    b.textContent = cat;
    b.onclick = (function(c){ return function(){ currentFilter=c; buildShopGrid(); buildShopFilters(); }; })(cat);
    frag.appendChild(b);
  });
  DOM.shopFilters.innerHTML = '';
  DOM.shopFilters.appendChild(frag);
}

function buildShopGrid() {
  var frag = document.createDocumentFragment();
  var entries = Object.entries(PLANTS).filter(function(e){
    return e[1].cat === currentFilter;
  });
  entries.forEach(function(pair) {
    var k=pair[0], p=pair[1];
    var locked=p.unlock>G.level, selected=k===G.selectedPlant;
    var rar = getRarityInfo(p.unlock);
    var card = document.createElement('div');
    card.className = 'shop-card rarity-'+rar.cls+(selected?' selected':'')+(locked?' locked':'');
    card.innerHTML =
      '<div class="sc-top">'+
        '<div class="sc-emoji">'+p.emoji+'</div>'+
        '<div class="sc-info">'+
          '<div class="sc-name">'+p.name+'</div>'+
          '<div class="sc-cat"><span class="sc-rarity">'+rar.label+'</span>'+p.cat+'</div>'+
        '</div>'+
        (locked?'<div class="sc-lock">Lv.'+p.unlock+'</div>':'')+
      '</div>'+
      '<div class="sc-stats">'+
        '<span>\uD83E\uDE99 Beli <b>'+p.cost+'</b></span>'+
        '<span>\uD83D\uDCB0 Jual <b>'+p.reward+'</b></span>'+
        '<span>\u2B50 XP <b>+'+p.xp+'</b></span>'+
        '<span>\u23F1 <b>'+p.time+'s</b></span>'+
      '</div>'+
      (selected
        ?'<div class="sc-selected-tag">\u2705 Terpilih \u2014 buka Kebun untuk tanam</div>'
        :'<button class="sc-buy-btn"'+((!locked&&G.coins>=p.cost)?'':' disabled')+'>\uD83C\uDF31 Pilih Bibit</button>'
      );
    if (!locked&&!selected) {
      card.querySelector('.sc-buy-btn').addEventListener('click',(function(key){ return function(){ choosePlant(key); }; })(k));
    }
    frag.appendChild(card);
  });
  DOM.shopGrid.innerHTML = '';
  DOM.shopGrid.appendChild(frag);
}

function choosePlant(k) {
  G.selectedPlant = k; buildShopGrid(); setSelectedSeedBox();
  var p = PLANTS[k];
  notify('\uD83C\uDF31 '+p.name+' dipilih!');
  addLog('\uD83C\uDF31 Pilih benih: '+p.name,'');
  switchTab('garden');
}

function setSelectedSeedBox() {
  var p = PLANTS[G.selectedPlant]; if (!p) return;
  DOM.ssbEmoji.textContent = p.emoji;
  DOM.ssbName.textContent  = p.name;
}

// ══════════════════════════════════════════════════════
//  GARDEN
// ══════════════════════════════════════════════════════
function buildGrid() {
  var frag = document.createDocumentFragment();
  slotEls = [];
  for (var i=0; i<100; i++) {
    var s = document.createElement('div');
    s.className = 'slot'; s.id = 'sl'+i;
    s.onclick = (function(idx){ return function(){ onSlotClick(idx); }; })(i);
    s.oncontextmenu = function(e){ e.preventDefault(); };
    frag.appendChild(s);
    slotEls[i] = s;
  }
  DOM.gardenGrid.innerHTML = '';
  DOM.gardenGrid.appendChild(frag);
  refreshAllSlots();
}

function refreshSlot(i) {
  var el = slotEls[i]; if (!el) return;
  var s  = G.slots[i];
  el.className = 'slot';
  if (s.autoPlant) el.classList.add('slot-auto');
  el.innerHTML = '';
  el._prog  = null;
  el._tip   = null;
  el._timer = null;

  // Locked slot handling
  if (s.locked) {
    el.classList.add('locked');
    el.style.background = '#1b1b1b';
    el.style.borderColor = 'rgba(255,255,255,0.06)';
    var cost = getSlotUnlockCost(i);
    el.innerHTML = '<div class="lock-emoji">\uD83D\uDD12</div><div class="slot-cost">\uD83E\uDE99 '+formatShortCost(cost)+'</div>';
    addTip(el, 'Petak terkunci — klik untuk buka (\uD83E\uDE99 '+formatShortCost(cost)+')');
    return;
  }

  if (!s.plant) {
    el.style.background  = s.autoPlant ? '#1a3040' : '#5c3d1e';
    el.style.borderColor = s.autoPlant ? '#4fc3f7' : '#3d2610';
    var p0 = PLANTS[s.autoPlant];
    if (s.autoPlant && p0) {
      addTip(el, '\uD83E\uDD16 Slot Otomatis: ' + p0.name + ' — menunggu koin...');
    } else if (s.autoPlant) {
      addTip(el, '\uD83E\uDD16 Slot Otomatis — klik untuk pilih bibit');
    } else {
      addTip(el,'Kosong \u2013 klik tanam');
    }
    if (s.autoPlant) {
      var autoTag = document.createElement('div');
      autoTag.className = 'slot-auto-tag';
      autoTag.textContent = '\uD83E\uDD16';
      el.appendChild(autoTag);
    }
    return;
  }
  el.style.borderColor = s.autoPlant ? '#4fc3f7' : '';
    var p = PLANTS[s.plant];
    el.style.background = (p && CAT_BG[p.cat]) || '#1a2a18';

  if (s.stage===4) {
    el.classList.add('ready');
    el.style.borderColor = s.autoPlant ? '#4fc3f7' : '#ffd700';
    var em = document.createElement('div');
    em.className = 'slot-emoji';
    em.style.filter = 'drop-shadow(0 0 5px gold)';
    em.textContent = p.emoji;
    el.appendChild(em);
    addTip(el, p.name+' \u2013 '+(s.autoPlant ? '\uD83E\uDD16 Auto-panen...' : 'SIAP PANEN!'));
  } else {
  var em2 = document.createElement('div');
  em2.className = 'slot-emoji';
  var emojiStage = (p && p.stages && p.stages[Math.max(0,s.stage-1)]) ? p.stages[Math.max(0,s.stage-1)] : ((p && p.emoji) ? p.emoji : '🌱');
  em2.textContent = emojiStage;
  el.appendChild(em2);

    var timer = document.createElement('div');
    timer.className = 'slot-timer';
    timer.textContent = formatTime(s.timeLeft);
    el.appendChild(timer);
    el._timer = timer;

    var bar = document.createElement('div');
    bar.className = 'slot-prog';
    var pct = s.stageTime>0 ? Math.min(100,(1-s.timeLeft/s.stageTime)*100) : 0;
    bar.style.width = pct+'%';
    el.appendChild(bar);
    el._prog = bar;

    el._tip = addTip(el, p.name+' \u2013 '+formatTime(s.timeLeft)+' lagi');
  }
  if (s.autoPlant) {
    var autoTag2 = document.createElement('div');
    autoTag2.className = 'slot-auto-tag';
    autoTag2.textContent = '\uD83E\uDD16';
    el.appendChild(autoTag2);
  }
}

function addTip(el, txt) {
  var t = document.createElement('div');
  t.className = 'slot-tip';
  t.textContent = txt;
  el.appendChild(t);
  return t;
}

function refreshAllSlots() { for (var i=0; i<100; i++) refreshSlot(i); }

// Return unlock cost for slot index `i` (0-based). First 5 slots are free.
function getSlotUnlockCost(i) {
  // First 5 slots (indices 0..4) are free
  if (typeof i !== 'number' || i < 5) return 0;
  // Base costs for slots 6..9 (indices 5..8) — index 0 here corresponds to slot index 5
  var base = [1700, 3400, 6200, 10000];
  var factor = 1.12; // slightly stronger growth
  var idx = i - 5;
  if (idx < base.length) return base[idx];
  var last = base[base.length - 1];
  for (var j = base.length; j <= idx; j++) {
    last = Math.round(last * factor);
  }
  return last;
}

function purchaseSlot(i) {
  // Enforce buying lowest locked slot first
  var s = G.slots[i];
  if (!s || !s.locked) return;
  var next = findNextLockedSlot();
  if (next === -1) { notify('Semua petak sudah terbuka.'); return; }
  if (i !== next) {
    notify('Buka petak terendah dulu: petak #' + (next+1));
    openBuySlotModal(next);
    return;
  }
  // Open in-game confirmation modal for the next locked slot
  openBuySlotModal(i);
}

function findNextLockedSlot() {
  for (var i=0;i<G.slots.length;i++) if (G.slots[i].locked) return i;
  return -1;
}

function purchaseNextSlot() {
  var idx = findNextLockedSlot();
  if (idx === -1) { notify('Semua petak sudah terbuka.'); return; }
  openBuySlotModal(idx);
}

function purchaseAffordableSlots() {
  // Buys sequential locked slots starting from the lowest locked, stop when coins insufficient
  var idx = findNextLockedSlot();
  if (idx === -1) { notify('Semua petak sudah terbuka.'); return; }
  var bought = 0, totalCost = 0, toBuy = [];
  for (var i = idx; i < G.slots.length; i++) {
    if (!G.slots[i].locked) continue; // skip already-unlocked
    var c = getSlotUnlockCost(i);
    if (G.coins >= c) {
      G.coins -= c; totalCost += c; bought++; G.slots[i].locked = false; toBuy.push(i+1);
    } else {
      break; // can't afford next slot, stop buying
    }
  }
  if (bought === 0) { notify('\uD83E\uDE99 Tidak ada petak yang dapat dibeli (koin tidak cukup).', true); return; }
  refreshAllSlots(); refreshHUD(); saveGame();
  notify('\uD83D\uDCB0 Membeli '+bought+' petak (Total: \uD83E\uDE99'+totalCost.toLocaleString()+')');
  addLog('\uD83D\uDCB0 Beli massal petak: '+toBuy.join(', '),'');
}

// --- In-game buy slot modal handlers ---
var _pendingBuySlotIdx = null;
function openBuySlotModal(i) {
  _pendingBuySlotIdx = i;
  var cost = getSlotUnlockCost(i);
  var modal = document.getElementById('buySlotModal');
  if (!modal) return;
  var txt = document.getElementById('buySlotText');
  if (txt) txt.textContent = 'Buka petak #' + (i+1) + ' seharga 🪙 ' + formatShortCost(cost) + '?';
  modal.classList.add('show');
}

function closeBuySlotModal() {
  var modal = document.getElementById('buySlotModal');
  if (modal) modal.classList.remove('show');
  _pendingBuySlotIdx = null;
}

function confirmBuySlotFromModal() {
  if (_pendingBuySlotIdx === null) return closeBuySlotModal();
  var i = _pendingBuySlotIdx; var s = G.slots[i]; if (!s || !s.locked) { closeBuySlotModal(); return; }
  var cost = getSlotUnlockCost(i);
  if (G.coins < cost) { notify('\uD83E\uDE99 Koin tidak cukup untuk membuka petak!', true); closeBuySlotModal(); return; }
  G.coins -= cost; s.locked = false; refreshSlot(i); refreshHUD();
  notify('\uD83D\uDD12 Petak #'+(i+1)+' dibuka!');
  addLog('\uD83D\uDD12 Beli petak '+(i+1)+' seharga \uD83E\uDE99'+cost, '');
  saveGame();
  closeBuySlotModal();
}

function onSlotClick(i) {
  var s = G.slots[i];

  // Jika petak terkunci, ajak pemain membeli
  if (s.locked) { purchaseSlot(i); return; }

  // Auto-slot activation mode: clicking any slot converts it to auto
  if (_autoSlotActivating) {
    _autoSlotActivating = false;
    _updateAutoSlotBtn();
    // If clicked slot is already an auto-slot, cancel without adding another
    if (s.autoPlant) {
      notify('Petak ini sudah slot otomatis. Mode aktifkan dibatalkan.');
      return;
    }
    var autoCount = 0;
    for (var _ai=0; _ai<100; _ai++) if (G.slots[_ai].autoPlant) autoCount++;
    if (autoCount >= G.autoSlotLimit) {
      notify('Batas slot otomatis sudah penuh!', true); return;
    }
    _autoSlotIdx = i;
    openAutoSlotModal(i, true);
    return;
  }

  // Clicking an existing auto-slot (including pending) opens seed chooser
  if (s.autoPlant) {
    openAutoSlotModal(i, s.autoPlant === '__pending__' ? true : false);
    return;
  }

  if (G.tool==='plant') {
    if (!s.plant)         plantSeed(i);
    else if (s.stage===4) { harvestSlot(i); refreshHUD(); }
    else                  notify('Tanaman sedang tumbuh!',true);
  } else {
    if (s.stage===4)      { harvestSlot(i); refreshHUD(); }
    else if (s.plant)     notify('Belum siap dipanen!',true);
    else                  notify('Petak kosong!',true);
  }
}

function plantSeed(i) {
  var k=G.selectedPlant, p=PLANTS[k];
  var scheck = G.slots[i];
  if (scheck && scheck.locked) { notify('Petak ini terkunci! Buka dulu.', true); return; }
  if (!p)              { notify('Pilih benih dulu di Toko!',true); return; }
  if (p.unlock>G.level){ notify('\uD83D\uDD12 '+p.name+' butuh Level '+p.unlock+'!',true); return; }
  if (G.coins<p.cost)  { notify('\uD83E\uDE99 Koin kurang! Butuh '+p.cost,true); return; }
  G.coins -= p.cost; G.totalPlanted++;
  var s=G.slots[i], st=p.time/3;
  s.plant=k; s.stage=1; s.stageTime=st; s.timeLeft=st;
  refreshSlot(i); refreshHUD();
  addLog('\uD83C\uDF31 Tanam '+p.name+' (petak '+(i+1)+')','');
  setInfo(p.emoji+' '+p.name+' ditanam di petak '+(i+1)+'! Tunggu '+formatTime(p.time)+'.');
}

function harvestSlot(i) {
  var s = G.slots[i]; if (!s.plant||s.stage!==4) return;
  var p = PLANTS[s.plant];
  var grade = rollGradeWithBoost(G.level);
  var gInfo = GRADES[grade];
  G.inventory[s.plant] = (G.inventory[s.plant]||0)+1;
  if (!G.inventoryGrades[s.plant]) G.inventoryGrades[s.plant] = {C:0,B:0,A:0,S:0,SS:0};
  G.inventoryGrades[s.plant][grade]++;
  if (!G.harvestLog[s.plant]) G.harvestLog[s.plant] = {C:0,B:0,A:0,S:0,SS:0};
  G.harvestLog[s.plant][grade]++;
  G.totalHarvest++;
  addXP(p.xp);
  var el = slotEls[i];
  if (el) {
    var pop = document.createElement('div');
    pop.className = 'harvest-popup';
    pop.innerHTML = p.emoji+' <span class="grade-tag" style="background:'+gInfo.color+';color:'+gInfo.textColor+'">'+grade+'</span>';
    el.appendChild(pop);
    setTimeout(function(){ pop.remove(); }, 950);
  }
  addLog('\uD83C\uDF3E Panen '+p.name+' ['+grade+'] \u2192 inventory! +\u2B50'+p.xp,'pos');
  setInfo(p.emoji+' '+p.name+' ['+grade+'] dipanen ke inventory!');
  checkAllAchievements();
  s.plant=null; s.stage=0; s.timeLeft=0; s.stageTime=0;
  refreshSlot(i);
  // Caller is responsible for refreshHUD() to allow batching in harvestAll
}

function plantAll() {
  var k = G.selectedPlant, p = PLANTS[k];
  if (!p)               { notify('Pilih benih dulu di Toko!', true); return; }
  if (p.unlock > G.level){ notify('\uD83D\uDD12 '+p.name+' butuh Level '+p.unlock+'!', true); return; }
  if (G.coins < p.cost)  { notify('\uD83E\uDE99 Koin tidak cukup untuk menanam satu pun!', true); return; }
  var count = 0;
  for (var i = 0; i < 100; i++) {
    if (G.slots[i].locked) continue; // skip locked slots
    if (G.slots[i].autoPlant) continue;   // skip auto-slots
    if (G.slots[i].plant) continue;   // sudah terisi
    if (G.coins < p.cost) break;      // uang habis
    G.coins -= p.cost; G.totalPlanted++;
    var s = G.slots[i], st = p.time / 3;
    s.plant = k; s.stage = 1; s.stageTime = st; s.timeLeft = st;
    refreshSlot(i);
    count++;
  }
  if (count > 0) {
    refreshHUD();
    notify('\uD83C\uDF31 '+count+' '+p.name+' ditanam!');
    addLog('\uD83C\uDF31 Tanam semua: '+count+'\xD7 '+p.name, '');
  } else {
    notify('\uD83E\uDE99 Koin habis atau semua petak terisi!', true);
  }
}

function harvestAll() {
  var count = 0;
  for (var i=0; i<100; i++) {
    if (G.slots[i].autoPlant) continue;   // skip auto-slots
    if (G.slots[i].stage===4) { harvestSlot(i); count++; }
  }
  if (count) {
    refreshHUD();
    notify('\uD83C\uDF3E '+count+' tanaman dipanen ke inventory!');
  }
}

// ══════════════════════════════════════════════════════
//  INVENTORY
// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
//  STATISTIK
// ══════════════════════════════════════════════════════
var CAT_EMOJI = {Bunga:'\uD83C\uDF38',Sayuran:'\uD83E\uDD6C',Buah:'\uD83C\uDF4E',Biji:'\uD83C\uDF30',Herbal:'\uD83C\uDF3F'};
var CAT_COLOR = {
  Bunga:'rgba(255,105,180,0.18)', Sayuran:'rgba(76,175,80,0.18)',
  Buah:'rgba(255,152,0,0.18)', Biji:'rgba(121,85,72,0.25)', Herbal:'rgba(0,188,212,0.18)'
};
var CAT_BORDER = {
  Bunga:'rgba(255,105,180,0.45)', Sayuran:'rgba(76,175,80,0.45)',
  Buah:'rgba(255,152,0,0.45)', Biji:'rgba(121,85,72,0.55)', Herbal:'rgba(0,188,212,0.45)'
};

// Rarity level info: label, CSS class, accent color, header bg
var RAR_ORDER = ['Common','Uncommon','Rare','Very Rare','Epic','Legendary','Mythical'];
var RAR_INFO = {
  Common:     {cls:'common',    color:'#c8a96e', bg:'rgba(101,67,33,0.22)'},
  Uncommon:   {cls:'uncommon',  color:'#4CAF50', bg:'rgba(27,94,32,0.22)'},
  Rare:       {cls:'rare',      color:'#2196F3', bg:'rgba(13,71,161,0.22)'},
  'Very Rare':{cls:'veryrare',  color:'#9C27B0', bg:'rgba(74,20,140,0.22)'},
  Epic:       {cls:'epic',      color:'#E91E63', bg:'rgba(136,14,79,0.22)'},
  Legendary:  {cls:'legendary', color:'#FF9800', bg:'rgba(136,50,0,0.22)'},
  Mythical:   {cls:'mythical',  color:'#FFD700', bg:'rgba(120,90,0,0.22)'}
};

function buildStatsSummary() {
  if (!DOM.statsSummary) return;
  var species = 0;
  for (var k in G.harvestLog) {
    var l = G.harvestLog[k];
    if ((l.C||0)+(l.B||0)+(l.A||0)+(l.S||0)+(l.SS||0) > 0) species++;
  }
  var fishSpecies = 0;
  for (var fk in G.fishLog) {
    var fl = G.fishLog[fk];
    if ((fl.C||0)+(fl.B||0)+(fl.A||0)+(fl.S||0)+(fl.SS||0) > 0) fishSpecies++;
  }
  var cookTotal = 0, cookSpecies = 0;
  for (var ck in G.cookInventory) {
    var cc = G.cookInventory[ck] || 0;
    if (cc > 0) { cookTotal += cc; cookSpecies++; }
  }
  DOM.statsSummary.innerHTML =
    '<div class="stat-card"><div class="stat-card-val">\uD83E\uDE99 '+G.totalEarned+'</div><div class="stat-card-lbl">\uD83D\uDCB0 Total Terjual</div></div>'+
    '<div class="stat-card"><div class="stat-card-val">'+species+'</div><div class="stat-card-lbl">\uD83C\uDF3F Spesies Ditanam</div></div>'+
    '<div class="stat-card"><div class="stat-card-val">'+fishSpecies+'</div><div class="stat-card-lbl">\uD83C\uDFA3 Spesies Terpancing</div></div>'+
    '<div class="stat-card"><div class="stat-card-val">'+cookTotal+'</div><div class="stat-card-lbl">\uD83C\uDF73 Masakan Dibuat ('+cookSpecies+' jenis)</div></div>';
}

function applyStatsFilter() {
  statsSortBy = DOM.statsSortBy ? DOM.statsSortBy.value : 'total';
  buildStatsAcc();
}

function makeColl(headerEl, bodyEl) {
  bodyEl.style.display = 'none';
  headerEl.addEventListener('click', function(e) {
    e.stopPropagation();
    var isOpen = bodyEl.style.display !== 'none';
    bodyEl.style.display = isOpen ? 'none' : 'block';
    var ch = headerEl.querySelector('.stree-chevron');
    if (ch) ch.style.transform = isOpen ? '' : 'rotate(90deg)';
  });
}

function buildStatsAcc() {
  var acc = document.getElementById('statsAcc');
  if (!acc) return;

  // Collect ALL plants grouped by category then rarity
  // catData[cat][rarLabel] = [{key,pl,log,tot,rar}, ...]
  var catData = {};
  CATEGORIES.forEach(function(cat){
    catData[cat] = {};
    RAR_ORDER.forEach(function(r){ catData[cat][r] = []; });
  });
  var grandTotal = 0;

  for (var k in PLANTS) {
    var pl = PLANTS[k];
    var log = G.harvestLog[k] || {C:0,B:0,A:0,S:0,SS:0};
    var tot = (log.C||0)+(log.B||0)+(log.A||0)+(log.S||0)+(log.SS||0);
    var rar = getRarityInfo(pl.unlock);
    if (!catData[pl.cat]) continue;
    catData[pl.cat][rar.label].push({key:k, pl:pl, log:log, tot:tot, rar:rar});
    grandTotal += tot;
  }

  // Note: don't clear acc here — buildStatsPage manages clearing and adds section headers

  function sortPlants(arr) {
    if (statsSortBy === 'name')   return arr.slice().sort(function(a,b){ return a.pl.name.localeCompare(b.pl.name); });
    if (statsSortBy === 'rarity') return arr.slice().sort(function(a,b){ return a.pl.name.localeCompare(b.pl.name); });
    return arr.slice().sort(function(a,b){ return b.tot - a.tot; });
  }

  // Level 1: Semua Tanaman
  var root = document.createElement('div');
  root.className = 'stree-root';

  var rootHdr = document.createElement('div');
  rootHdr.className = 'stree-row stree-lv1';
  rootHdr.innerHTML =
    '<span class="stree-chevron">&#9654;</span>'+
    '<span class="stree-icon">\uD83C\uDF3F</span>'+
    '<span class="stree-label">Semua Tanaman</span>'+
    '<span class="stree-val">= '+grandTotal+'</span>';

  var rootBody = document.createElement('div');
  rootBody.className = 'stree-body';
  makeColl(rootHdr, rootBody);

  CATEGORIES.forEach(function(cat) {
    var rarGroups = catData[cat];
    var catTotal = 0;
    RAR_ORDER.forEach(function(r){ rarGroups[r].forEach(function(e){ catTotal += e.tot; }); });
    if (!catTotal) return; // sembunyikan kategori dengan 0 panen

    // Level 2: Kategori
    var catEl = document.createElement('div'); catEl.className = 'stree-node';
    var catHdr = document.createElement('div');
    catHdr.className = 'stree-row stree-lv2';
    catHdr.style.setProperty('--cat-color', CAT_COLOR[cat]||'rgba(255,255,255,0.05)');
    catHdr.innerHTML =
      '<span class="stree-chevron">&#9654;</span>'+
      '<span class="stree-icon">'+(CAT_EMOJI[cat]||'\uD83C\uDF31')+'</span>'+
      '<span class="stree-label">'+cat+'</span>'+
      '<span class="stree-val">= '+catTotal+'</span>';
    var catBody = document.createElement('div');
    catBody.className = 'stree-body';
    makeColl(catHdr, catBody);

    // Level 3: Rarity (always rarest-first for grouping clarity)
    RAR_ORDER.forEach(function(rarLabel) {
      var plants = rarGroups[rarLabel];
      if (!plants || !plants.length) return;
      var ri = RAR_INFO[rarLabel];
      var rarTotal = 0; plants.forEach(function(e){ rarTotal += e.tot; });
      if (!rarTotal) return; // sembunyikan rarity dengan 0 panen
      var sorted = sortPlants(plants);

      var rarEl = document.createElement('div'); rarEl.className = 'stree-node';
      var rarHdr = document.createElement('div');
      rarHdr.className = 'stree-row stree-lv3';
      rarHdr.style.background = ri ? ri.bg : 'rgba(255,255,255,0.05)';
      rarHdr.innerHTML =
        '<span class="stree-chevron">&#9654;</span>'+
        '<span class="stree-rar-dot" style="background:'+(ri?ri.color:'#aaa')+'"></span>'+
        '<span class="stree-label">'+rarLabel+'</span>'+
        '<span class="stree-val">= '+rarTotal+'</span>';
      var rarBody = document.createElement('div');
      rarBody.className = 'stree-body';
      makeColl(rarHdr, rarBody);

      sorted.forEach(function(e) {
        if (!e.tot) return; // sembunyikan tanaman dengan 0 panen
        // Level 4: Tanaman
        var plEl = document.createElement('div'); plEl.className = 'stree-node';
        var plHdr = document.createElement('div');
        plHdr.className = 'stree-row stree-lv4';
        plHdr.innerHTML =
          '<span class="stree-chevron">&#9654;</span>'+
          '<span class="stree-icon">'+e.pl.emoji+'</span>'+
          '<span class="stree-label">'+e.pl.name+'</span>'+
          '<span class="stree-val">= '+e.tot+'</span>';
        var plBody = document.createElement('div');
        plBody.className = 'stree-body';
        makeColl(plHdr, plBody);

        // Level 5: Grade (hanya yang count > 0)
        for (var gi = 0; gi < GRADE_ORDER.length; gi++) {
          var gk = GRADE_ORDER[gi], cnt = e.log[gk]||0;
          if (!cnt) continue;
          var gradeRow = document.createElement('div');
          gradeRow.className = 'stree-row stree-lv5';
          gradeRow.innerHTML =
            '<span class="stree-grade-badge" style="background:'+GRADES[gk].color+';color:'+GRADES[gk].textColor+'">'+gk+'</span>'+
            '<span class="stree-label">Grade '+gk+'</span>'+
            '<span class="stree-val">= '+cnt+'</span>';
          plBody.appendChild(gradeRow);
        }

        plEl.appendChild(plHdr); plEl.appendChild(plBody);
        rarBody.appendChild(plEl);
      });

      rarEl.appendChild(rarHdr); rarEl.appendChild(rarBody);
      catBody.appendChild(rarEl);
    });

    catEl.appendChild(catHdr); catEl.appendChild(catBody);
    rootBody.appendChild(catEl);
  });

  root.appendChild(rootHdr); root.appendChild(rootBody);
  acc.appendChild(root);
}

function buildStatsPage() {
  buildStatsSummary();
  var acc = document.getElementById('statsAcc');
  if (!acc) return;
  acc.innerHTML = '';
  // Plant stats section header
  var plantHdr = document.createElement('div');
  plantHdr.className = 'stats-section-hdr';
  plantHdr.style.borderColor = '#4caf50';
  plantHdr.style.background = 'rgba(76,175,80,0.1)';
  plantHdr.textContent = '🌿 Semua Tanaman';
  acc.appendChild(plantHdr);
  buildStatsAcc();
  buildFishStatsSection(acc);
  buildCookStatsSection(acc);
}

function applyInvFilter() {
  invFilterCat    = DOM.invFilterCat.value;
  invFilterRarity = DOM.invFilterRarity.value;
  invFilterGrade  = DOM.invFilterGrade.value;
  buildInvGrid();
}

// ── Sell modal helpers ──────────────────────────────────────
function calcPartialSellValue(p, gradeData, qty) {
  var order = ['C','B','A','S','SS'], total = 0, rem = qty;
  for (var i = 0; i < order.length && rem > 0; i++) {
    var cnt = Math.min(rem, gradeData[order[i]]||0);
    total += cnt * gradePrice(p.reward, order[i]);
    rem -= cnt;
  }
  return total;
}

function openSellModal(key, grade) {
  var p = PLANTS[key]; if (!p) return;
  var gradeData = G.inventoryGrades[key] || {};
  _sellKey = key; _sellGrade = grade;
  _sellMaxQty = grade ? (gradeData[grade]||0) : (G.inventory[key]||0);
  if (_sellMaxQty <= 0) { notify('Tidak ada item!', true); return; }
  _sellQty = 1;
  DOM.sellModalEmoji.textContent = p.emoji;
  DOM.sellModalName.textContent  = p.name;
  var gradeEl = DOM.sellModalGrade;
  if (grade) {
    var gInf = GRADES[grade];
    gradeEl.innerHTML = '<span class="grade-tag" style="background:'+gInf.color+';color:'+gInf.textColor+'">'+grade+'</span> &times; '+_sellMaxQty;
  } else {
    var b = '';
    for (var i = 0; i < GRADE_ORDER.length; i++) {
      var gk = GRADE_ORDER[i], gc = gradeData[gk]||0;
      if (gc > 0) b += '<span class="grade-tag" style="background:'+GRADES[gk].color+';color:'+GRADES[gk].textColor+'">'+gk+'\xD7'+gc+'</span> ';
    }
    gradeEl.innerHTML = b || '—';
  }
  _sellType = 'plant';
  DOM.sellModal.classList.add('show');
  _updateSellModal();
}

function openLootSellModal(key) {
  var loot = LOOT_CATALOG[key]; if (!loot) return;
  _sellType = 'loot';
  _sellKey = key; _sellGrade = null;
  _sellMaxQty = G.lootInventory[key] || 0;
  if (_sellMaxQty <= 0) { notify('Tidak ada loot untuk dijual!', true); return; }
  _sellQty = 1;
  DOM.sellModalEmoji.textContent = loot.emoji;
  DOM.sellModalName.textContent  = loot.name;
  DOM.sellModalGrade.textContent = '×' + _sellMaxQty;
  DOM.sellModal.classList.add('show');
  _updateLootSellModal();
}

function _updateLootSellModal() {
  if (_sellType !== 'loot') return;
  var loot = LOOT_CATALOG[_sellKey];
  DOM.sellModalQty.textContent    = _sellQty;
  DOM.sellModalBtnQty.textContent = _sellQty;
  var val = (loot ? loot.value : 0) * _sellQty;
  DOM.sellModalValue.textContent = '🪙 ' + val;
}

function _updateSellModal() {
  var p = PLANTS[_sellKey];
  var gradeData = G.inventoryGrades[_sellKey] || {};
  DOM.sellModalQty.textContent    = _sellQty;
  DOM.sellModalBtnQty.textContent = _sellQty;
  var val = _sellGrade
    ? (_sellQty * gradePrice(p.reward, _sellGrade))
    : calcPartialSellValue(p, gradeData, _sellQty);
  DOM.sellModalValue.textContent = '\uD83E\uDE99 ' + val;
}

function closeSellModal() {
  if (DOM.sellModal) DOM.sellModal.classList.remove('show');
}

// ────────────────────────────────────────────────────
function buildInvGrid() {
  var frag = document.createDocumentFragment();
  var hasItems=false, totalValue=0;
  for (var k in PLANTS) {
    var qty = G.inventory[k]||0; if (qty<=0) continue;
    var p = PLANTS[k];
    if (invFilterCat    && p.cat !== invFilterCat) continue;
    if (invFilterRarity && getRarityInfo(p.unlock).label !== invFilterRarity) continue;
    var gradeData = G.inventoryGrades[k] || {};
    if (invFilterGrade && !((gradeData[invFilterGrade]||0) > 0)) continue;
    var sellGrade = invFilterGrade || null;
    var displayQty, itemVal, gradeBadges = '';
    if (sellGrade) {
      displayQty = gradeData[sellGrade]||0;
      itemVal    = displayQty * gradePrice(p.reward, sellGrade);
      var gi2 = GRADES[sellGrade];
      gradeBadges = '<span class="grade-tag" style="background:'+gi2.color+';color:'+gi2.textColor+'">'+sellGrade+'\xD7'+displayQty+'</span>';
    } else {
      displayQty = qty;
      itemVal    = calcInvValue(p.reward, gradeData) || (qty * p.reward);
      for (var gi = 0; gi < GRADE_ORDER.length; gi++) {
        var gKey = GRADE_ORDER[gi], gCnt = gradeData[gKey]||0;
        if (gCnt > 0) gradeBadges += '<span class="grade-tag" style="background:'+GRADES[gKey].color+';color:'+GRADES[gKey].textColor+'">'+gKey+'\xD7'+gCnt+'</span>';
      }
    }
    hasItems = true; totalValue += itemVal;
    var rar = getRarityInfo(p.unlock);
    var card = document.createElement('div'); card.className='inv-card rarity-'+rar.cls;
    card.innerHTML =
      '<div class="inv-emoji">'+p.emoji+'</div>'+
      '<div class="inv-info">'+
        '<div class="inv-name"><span class="inv-counter">'+displayQty+'</span>'+p.name+'</div>'+
        '<div class="grade-badges">'+gradeBadges+'</div>'+
        '<div class="inv-val">\uD83E\uDE99 '+itemVal+'</div>'+
      '</div>'+
      '<button class="inv-sell-btn">Jual</button>';
    card.querySelector('.inv-sell-btn').addEventListener('click',(function(key,sg){ return function(){ openSellModal(key,sg); }; })(k, sellGrade));
    frag.appendChild(card);
  }
  DOM.invGrid.innerHTML = '';
  if (hasItems) DOM.invGrid.appendChild(frag);
  else DOM.invGrid.innerHTML='<div class="inv-empty-msg">\uD83C\uDF92 Belum ada hasil panen.<br>Tanam dan panen tanaman di halaman Kebun!</div>';
  DOM.invSellAllBtn.disabled = !hasItems;
  DOM.invTotalVal.textContent = '\uD83E\uDE99 '+totalValue;
}

function sellAll() {
  var total=0, count=0;
  for (var k in PLANTS) {
    var qty2 = G.inventory[k]||0; if (qty2<=0) continue;
    var p2 = PLANTS[k];
    if (invFilterCat    && p2.cat !== invFilterCat) continue;
    if (invFilterRarity && getRarityInfo(p2.unlock).label !== invFilterRarity) continue;
    var gd2 = G.inventoryGrades[k] || {};
    if (invFilterGrade) {
      var gQty = gd2[invFilterGrade]||0; if (gQty<=0) continue;
      var gVal = gQty * gradePrice(p2.reward, invFilterGrade);
      total+=gVal; G.totalEarned+=gVal; count+=gQty;
      gd2[invFilterGrade] = 0;
      G.inventory[k] = Math.max(0, qty2 - gQty);
      G.inventoryGrades[k] = gd2;
    } else {
      var val2 = calcInvValue(p2.reward, gd2) || (qty2 * p2.reward);
      total+=val2; G.totalEarned+=val2; count+=qty2;
      G.inventory[k]=0; G.inventoryGrades[k]={C:0,B:0,A:0,S:0,SS:0};
    }
  }
  if (total>0) {
    G.coins+=total; buildInventoryPage(); refreshHUD();
    notify('\uD83D\uDCB0 Jual semua '+count+' item \u2192 +\uD83E\uDE99'+total);
    addLog('\uD83D\uDCB0 Jual semua '+count+' item +\uD83E\uDE99'+total,'pos');
  } else { notify('Inventory kosong!',true); }
}

// ══════════════════════════════════════════════════════
//  GAME LOOP
// ══════════════════════════════════════════════════════
function tick() {
  tickWeather();
  tickFishing();
  tickPond();
  var newReady = false;
  var growMult = getCurrentGrowMult();
  for (var i=0; i<100; i++) {
    var s = G.slots[i];
    if (!s.plant || s.stage>=4) continue;
    s.timeLeft -= 0.5 * growMult;
    if (s.timeLeft<=0) {
      s.stage++;
      if (s.stage<4) {
        var st = PLANTS[s.plant].time/3;
        s.stageTime=st; s.timeLeft=st;
      } else {
        s.stageTime=0; s.timeLeft=0;
        if (!s.autoPlant) newReady=true; // only notify for non-auto slots
      }
      refreshSlot(i);
    } else {
      // Lightweight: only update progress bar width + tooltip text
      var el = slotEls[i];
      if (el && el._prog) {
        var pct = s.stageTime>0 ? Math.min(100,(1-s.timeLeft/s.stageTime)*100) : 0;
        el._prog.style.width = pct+'%';
        var tStr = formatTime(s.timeLeft);
        if (el._timer) el._timer.textContent = tStr;
        if (el._tip)   el._tip.textContent   = PLANTS[s.plant].name+' \u2013 '+tStr+' lagi';
      }
    }
  }
  tickAutoSlots();
  if (newReady) {
    refreshHUD();
    notify('\uD83C\uDF3E Ada tanaman siap panen!');
  }
}

// ──────────────────────────────────────────────────────
//  AUTO-SLOT TICK — harvest & replant automatically
// ──────────────────────────────────────────────────────
function autoHarvestSlot(i) {
  var s = G.slots[i]; if (!s.plant || s.stage!==4) return;
  var p = PLANTS[s.plant];
  var grade = rollGradeWithBoost(G.level);
  G.inventory[s.plant] = (G.inventory[s.plant]||0)+1;
  if (!G.inventoryGrades[s.plant]) G.inventoryGrades[s.plant] = {C:0,B:0,A:0,S:0,SS:0};
  G.inventoryGrades[s.plant][grade]++;
  if (!G.harvestLog[s.plant]) G.harvestLog[s.plant] = {C:0,B:0,A:0,S:0,SS:0};
  G.harvestLog[s.plant][grade]++;
  G.totalHarvest++;
  addXP(p.xp);
  // checkAllAchievements() is called once by tickAutoSlots() after all harvests
  s.plant=null; s.stage=0; s.timeLeft=0; s.stageTime=0;
  refreshSlot(i);
}

function tickAutoSlots() {
  var changed = false;
  var anyHarvest = false;
  for (var i=0; i<100; i++) {
    var s = G.slots[i];
    if (!s.autoPlant) continue;
    if (s.autoPlant === '__pending__') continue; // belum dipilih bibitnya
    var pk = s.autoPlant;
    var p = PLANTS[pk];
    if (!p) continue;
    // Auto-harvest when ready
    if (s.stage===4) {
      autoHarvestSlot(i);
      anyHarvest = true;
      changed = true;
      s = G.slots[i]; // re-read after harvest
    }
    // Auto-plant when empty (if can afford)
    if (!s.plant && p.unlock<=G.level && G.coins>=p.cost) {
      G.coins -= p.cost;
      G.totalPlanted++;
      var st = p.time/3;
      s.plant=pk; s.stage=1; s.stageTime=st; s.timeLeft=st;
      refreshSlot(i);
      changed = true;
    }
    // (no else: slot stays as auto-empty, already rendered correctly)
  }
  if (anyHarvest) checkAllAchievements();
  if (changed) refreshHUD();
}

// ══════════════════════════════════════════════════════
//  XP / LEVEL
// ══════════════════════════════════════════════════════
function addXP(amt) {
  G.xp += amt;
  while (G.level<XP_TABLE.length-1 && G.xp>=XP_TABLE[G.level]) {
    G.level++;
    notify('\uD83C\uDF89 Level Up! Sekarang Level '+G.level+'!');
    addLog('\u2B50 Naik ke Level '+G.level+'!','pos');
    if (DOM.shopGrid) buildShopGrid();
  }
  if (DOM.xpFill) {
    var cur  = XP_TABLE[Math.max(0,G.level-1)]||0;
    var next = G.level<XP_TABLE.length-1 ? XP_TABLE[G.level] : XP_TABLE[XP_TABLE.length-1];
    var pct  = Math.min(100, ((G.xp-cur)/(next-cur))*100);
    DOM.xpFill.style.width   = pct+'%';
    DOM.xpLabel.textContent  = 'XP Kebun: '+G.xp+' / '+next;
    DOM.lvlBadge.textContent = G.level;
  }
}

// ══════════════════════════════════════════════════════
//  HUD  (badge updates merged in — no separate updateBadges())
// ══════════════════════════════════════════════════════
function refreshHUD() {
  if (DOM.hCoins) DOM.hCoins.textContent = G.coins;
  if (DOM.sEarned)    DOM.sEarned.textContent    = G.totalEarned;
  if (DOM.sPlanted)   DOM.sPlanted.textContent   = G.totalPlanted;
  if (DOM.sHarvested) DOM.sHarvested.textContent = G.totalHarvest;

  var readyCount = 0;
  for (var i=0; i<100; i++) if (G.slots[i].stage===4) readyCount++;

  if (DOM.btnHarvestAll) {
    DOM.btnHarvestAll.disabled    = readyCount===0;
    DOM.btnHarvestAll.textContent = readyCount>0 ? '\uD83C\uDF3E Panen Semua ('+readyCount+')' : '\uD83C\uDF3E Panen Semua';
  }
  if (DOM.badgeGarden) { DOM.badgeGarden.style.display=readyCount>0?'':'none'; }
  // Fishing done badge
  var fishDone = 0;
  ['sungai','danau','laut'].forEach(function(loc){
    G.fishSlots[loc].forEach(function(s){ if (s.done) fishDone++; });
  });
  if (DOM.badgeFishing) { DOM.badgeFishing.style.display=fishDone>0?'':'none'; }
  updateAchievementBadge();
  _updateAutoSlotBtn();
}

function setTool(t) {
  G.tool = t;
  if (DOM.toolPlant)   DOM.toolPlant.classList.toggle('active',   t==='plant');
  if (DOM.toolHarvest) DOM.toolHarvest.classList.toggle('active', t==='harvest');
}

function setInfo(msg) { if (DOM.infoBar) DOM.infoBar.innerHTML = msg; }

// ══════════════════════════════════════════════════════
//  LOG / NOTIFY
// ══════════════════════════════════════════════════════
var _nTimer = null;
function notify(msg, isErr) {
  DOM.notif.textContent = msg;
  DOM.notif.className   = 'notif show'+(isErr?' err':'');
  clearTimeout(_nTimer);
  _nTimer = setTimeout(function(){ DOM.notif.classList.remove('show'); }, 3200);
}

function addLog(msg, type) {
  var now = new Date();
  var t = now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  [DOM.logList, DOM.fishLogList].forEach(function(list) {
    if (!list) return;
    var d = document.createElement('div');
    d.className = 'log-entry '+(type||'');
    d.innerHTML = '<span class="log-time">'+t+'</span> '+msg;
    list.insertBefore(d, list.firstChild);
    while (list.children.length>80) list.removeChild(list.lastChild);
  });
}

// ══════════════════════════════════════════════════════
//  FISHING XP / LEVEL
// ══════════════════════════════════════════════════════
function addFishXP(amt) {
  G.fishXp += amt;
  while (G.fishLevel < 100 && G.fishXp >= FISH_XP_TABLE[G.fishLevel]) {
    G.fishLevel++;
    notify('🎣 Level Memancing naik! Sekarang Level ' + G.fishLevel + '!');
    addLog('⭐ Level Memancing naik ke ' + G.fishLevel + '!', 'pos');
  }
  var cur  = FISH_XP_TABLE[Math.max(0, G.fishLevel - 1)] || 0;
  var next = G.fishLevel < 100 ? FISH_XP_TABLE[G.fishLevel] : FISH_XP_TABLE[100];
  var pct  = Math.min(100, ((G.fishXp - cur) / (next - cur)) * 100);
  if (DOM.fishXpFill)   DOM.fishXpFill.style.width     = pct + '%';
  if (DOM.fishXpLabel)  DOM.fishXpLabel.textContent     = 'XP Pancing: ' + G.fishXp + ' / ' + next;
  if (DOM.fishLvlBadge) DOM.fishLvlBadge.textContent    = G.fishLevel;
}

// ══════════════════════════════════════════════════════
//  FISHING PAGE
// ══════════════════════════════════════════════════════
function switchFishLoc(loc) {
  currentFishLoc = loc;
  FISH_LOCATIONS.forEach(function(l) {
    var btn = document.getElementById('fishTab-' + l);
    if (btn) btn.classList.toggle('active', l === loc);
  });
  var kolamBtn = document.getElementById('fishTab-kolam');
  if (kolamBtn) kolamBtn.classList.toggle('active', loc === 'kolam');
  if (loc === 'kolam') { buildPondLocation(); return; }
  buildFishPage(loc);
}

function fishAll(loc) {
  if (!G.selectedBait || !(G.baitInventory[G.selectedBait] > 0)) {
    notify('\uD83E\uDEB1 Pilih umpan dulu dan pastikan stok tersedia!', true); return;
  }
  if (getAvailableJorans().length === 0) {
    notify('\uD83C\uDFA3 Tidak ada Joran Pancing tersedia! Buat Joran di Kerajinan.', true); return;
  }
  var bait = G.selectedBait;
  var count = 0, depleted = 0;
  var slots = G.fishSlots[loc];
  for (var i = 0; i < slots.length; i++) {
    if (slots[i].fishKey) continue;
    if (!(G.baitInventory[bait] > 0)) break;
    var joran = pickJoranForCast();
    if (!joran) break;

    var chosenKey = pickFishForBait(bait, loc);
    if (!chosenKey) break;
    var chosenFish = FISH[chosenKey];
    var baseDur = chosenFish.minTime + Math.random() * (chosenFish.maxTime - chosenFish.minTime);
    var sMult = 1 - (G.upgrades.fishSpeed || 0) * 0.18;
    var wMult = (WEATHERS[G.weather] || WEATHERS['cerah']).fishMult;
    var duration = Math.max(5, baseDur * sMult / wMult);
    var now = Date.now();
    G.baitInventory[bait]--;
    slots[i].fishKey    = chosenKey;
    slots[i].baitRarity = bait;
    slots[i].joranId    = joran.id;
    slots[i].startTime  = now;
    slots[i].endTime    = now + duration * 1000;
    slots[i].done       = false;
    // Kurangi daya tahan joran sekarang (saat cast)
    var res = consumeJoranById(joran.id);
    if (res && res.depleted) {
      depleted++;
      slots[i].joranId = null; // joran hancur saat cast \u2014 slot tetap aktif tapi tidak menahan joran
    }
    count++;
  }
  if (depleted > 0) addLog('\uD83C\uDFA3 ' + depleted + ' Joran patah saat dipakai!', 'neg');
  if (count > 0) {
    addLog('\uD83C\uDFA3 Pancing Semua di ' + FISH_LOC_LABEL[loc] + ': ' + count + ' slot dipasang', '');
    notify('\uD83C\uDFA3 ' + count + ' pancingan dipasang di ' + FISH_LOC_LABEL[loc] + '!');
    setSelectedBaitBox();
    setSelectedJoranBox();
    buildFishPage(loc);
    buildCraftPage();
  } else {
    notify('Semua slot sudah aktif atau umpan habis!', true);
  }
}

function collectAllFish(loc) {
  var count = 0;
  var slots = G.fishSlots[loc];
  for (var i = 0; i < slots.length; i++) {
    if (slots[i].done) { collectFish(loc, i, true); count++; }
  }
  if (count === 0) { notify('Belum ada ikan yang menyambar!', true); return; }
  checkAllAchievements();
  buildFishPage(loc);
  refreshHUD();
  var _invPage = document.getElementById('page-inv');
  if (_invPage && _invPage.classList.contains('active')) buildInventoryPage();
  notify('\uD83D\uDC1F ' + count + ' ikan berhasil dipancing!');
  addLog('\uD83D\uDC1F Angkat semua: ' + count + ' ikan di ' + FISH_LOC_LABEL[loc], 'pos');
}

function buildFishPage(loc) {
  if (loc === 'kolam') { buildPondLocation(); return; }
  var container = document.getElementById('fishLocContent');
  if (!container) return;
  container.innerHTML = '';

  var slots = G.fishSlots[loc];
  var locLabel = FISH_LOC_LABEL[loc];

  // Fish unlocked in this location
  var availFish = [];
  var wxFishNow = []; // weather-exclusive fish available in current weather
  for (var fk in FISH) {
    var _f = FISH[fk];
    if (_f.loc === loc) {
      availFish.push(fk);
      if (_f.weatherReq && _f.weatherReq === G.weather) wxFishNow.push(_f);
    }
  }
  var wxInfo = '';
  if (wxFishNow.length > 0) {
    var wData = WEATHERS[G.weather] || WEATHERS['cerah'];
    wxInfo = ' <span style="color:#ffd700;font-size:0.7rem">✦ ' + wData.emoji + ' ' + wxFishNow.length + ' ikan eksklusif ' + wData.label + ' tersedia!</span>';
  }

  var hdr = document.createElement('div');
  hdr.className = 'fish-slots-header';
  var joranCount = getJoranCount();
  var joranAvail = getAvailableJorans().length;
  var joranInfo = ' &nbsp;&middot;&nbsp; 🎣 Joran: ' + joranAvail + '/' + joranCount + ' tersedia';
  hdr.innerHTML = FISH_LOC_EMOJI[loc] + ' <b>' + locLabel + '</b> — ' + availFish.length + ' jenis ikan tersedia, ' + slots.filter(function(s){ return s.fishKey; }).length + '/20 slot aktif' + joranInfo + wxInfo;
  container.appendChild(hdr);

  var doneCount = slots.filter(function(s){ return s.done; }).length;
  var emptyCount = slots.filter(function(s){ return !s.fishKey; }).length;

  var topRow = document.createElement('div');
  topRow.className = 'fish-top';
  // create "Pancing Semua" button
  var btnCast = document.createElement('button');
  btnCast.className = 'fish-btn-cast';
  if (emptyCount === 0) btnCast.disabled = true;
  btnCast.innerHTML = '\uD83C\uDFA3 Pancing Semua (' + emptyCount + ')';
  btnCast.addEventListener('click', function(){ fishAll(loc); });
  topRow.appendChild(btnCast);
  // create "Angkat Semua" button
  var btnCollect = document.createElement('button');
  btnCollect.className = 'fish-btn-collect';
  if (doneCount === 0) btnCollect.disabled = true;
  btnCollect.innerHTML = '\uD83D\uDC1F Angkat Semua (' + doneCount + ')';
  btnCollect.addEventListener('click', function(){ collectAllFish(loc); });
  topRow.appendChild(btnCollect);
  container.appendChild(topRow);

  var grid = document.createElement('div');
  grid.className = 'fish-slots-grid';
  for (var i = 0; i < 20; i++) {
    grid.appendChild(buildFishSlotEl(loc, i));
  }
  container.appendChild(grid);
}

function buildFishSlotEl(loc, idx) {
  var slot = G.fishSlots[loc][idx];
  var el = document.createElement('div');
  var now = Date.now();

  if (!slot.fishKey) {
    // Empty
    el.className = 'fish-slot empty';
    el.innerHTML = '<div class="fish-slot-emoji">🎣</div><div class="fish-slot-name">Kosong</div><div class="fish-slot-timer">Klik untuk memasang pancingan</div>';
    el.onclick = (function(l, i){ return function(){ openBaitChooser(l, i); }; })(loc, idx);
  } else if (slot.done) {
    // Strike! — jangan ungkap ikan, tunggu klik
    el.className = 'fish-slot done';
    el.innerHTML =
      '<div class="fish-slot-emoji">\uD83C\uDFA3</div>' +
      '<div class="fish-slot-name" style="color:#4caf50;font-size:0.7rem">\u2728 Ikan Menyambar!</div>' +
      '<div class="fish-slot-timer" style="color:#a8e6a3;font-size:0.6rem">Klik untuk mengambil</div>';
    el.onclick = (function(l, i){ return function(){ collectFish(l, i); }; })(loc, idx);
  } else {
    // Sedang memancing — sembunyikan info ikan & timer
    el.className = 'fish-slot active';
    el.innerHTML =
      '<div class="fish-slot-emoji">\uD83C\uDFA3</div>' +
      '<div class="fish-slot-name" style="font-size:0.62rem;color:#7ec8e3">Sedang memancing</div>' +
      '<div class="fish-slot-loading"></div>';
  }
  return el;
}

// ── Bait chooser ────────────────────────────────────────────
function setSelectedBaitBox() {
  if (!DOM.fishSsbEmoji || !DOM.fishSsbName) return;
  var bait = G.selectedBait;
  if (!bait || !(G.baitInventory[bait] > 0)) {
    DOM.fishSsbEmoji.textContent = '\uD83E\uDEB1';
    DOM.fishSsbName.textContent  = 'Pilih Umpan';
    DOM.fishSsbName.className    = 'ssb-name';
    return;
  }
  var ri = getRarityInfoByClass(bait);
  DOM.fishSsbEmoji.textContent = '\uD83E\uDEB1';
  DOM.fishSsbName.textContent  = 'Umpan ' + (BAIT_LABEL[bait] || ri.label) + ' (\xD7' + G.baitInventory[bait] + ')';
  DOM.fishSsbName.className    = 'ssb-name rarity-' + bait;
}

function setSelectedJoranBox() {
  var emojiEl = document.getElementById('joranSsbEmoji');
  var nameEl  = document.getElementById('joranSsbName');
  if (!emojiEl || !nameEl) return;
  var avail = getAvailableJorans();
  var total = getJoranCount();
  if (total === 0) {
    emojiEl.textContent = '\uD83C\uDFA3';
    nameEl.textContent  = 'Tidak ada Joran';
    nameEl.className    = 'ssb-name';
    return;
  }
  if (G.selectedJoran !== null) {
    for (var i = 0; i < avail.length; i++) {
      if (avail[i].id === G.selectedJoran) {
        var meta = (typeof TOOL_CATALOG !== 'undefined' && TOOL_CATALOG[getJoranToolKey()]) || { label: 'Joran Pancing' };
        emojiEl.textContent = '\uD83C\uDFA3';
        nameEl.textContent  = meta.label + ' #' + avail[i].id + ' (\u26A1' + avail[i].dur + ')';
        nameEl.className    = 'ssb-name';
        return;
      }
    }
    G.selectedJoran = null;
  }
  emojiEl.textContent = '\uD83C\uDFA3';
  nameEl.textContent  = 'Joran Otomatis (\xD7' + avail.length + '/' + total + ')';
  nameEl.className    = 'ssb-name';
}

function openJoranSelector() {
  var avail = getAvailableJorans();
  var total = getJoranCount();
  if (total === 0) {
    notify('\uD83C\uDFA3 Tidak ada Joran Pancing! Buat Joran di Kerajinan.', true);
    return;
  }
  var modal = document.getElementById('joranChooserModal');
  var list  = document.getElementById('joranChooserList');
  if (!modal || !list) return;
  list.innerHTML = '';
  var meta = (typeof TOOL_CATALOG !== 'undefined' && TOOL_CATALOG[getJoranToolKey()]) || { label: 'Joran Pancing', durability: 100 };
  // Auto option
  var autoRow = document.createElement('div');
  autoRow.className = 'fish-bait-row' + (G.selectedJoran === null ? ' selected' : '');
  autoRow.innerHTML = '<span class="bait-name">\uD83C\uDFA3 Otomatis (durabilitas terendah dulu)</span><span class="bait-qty">\xD7' + avail.length + '</span>';
  autoRow.onclick = function(){ selectJoran(null); };
  list.appendChild(autoRow);
  // Individual jorans
  var used = getUsedJoranIds();
  var all  = getJoranList();
  for (var i = 0; i < all.length; i++) {
    var j = all[i];
    var inUse  = !!used[j.id];
    var pct = Math.round((j.dur / (meta.durability || 100)) * 100);
    var row = document.createElement('div');
    row.className = 'fish-bait-row' + (G.selectedJoran === j.id ? ' selected' : '') + (inUse ? ' disabled' : '');
    row.innerHTML =
      '<span class="bait-name">\uD83C\uDFA3 ' + meta.label + ' #' + j.id + (inUse ? ' <span style="color:#7ec8e3;font-size:0.7rem">(sedang dipakai)</span>' : '') + '</span>' +
      '<span class="bait-qty">\u26A1' + j.dur + ' (' + pct + '%)</span>';
    if (!inUse) row.onclick = (function(id){ return function(){ selectJoran(id); }; })(j.id);
    list.appendChild(row);
  }
  modal.classList.add('show');
}

function selectJoran(id) {
  G.selectedJoran = id;
  setSelectedJoranBox();
  closeJoranSelector();
}

function closeJoranSelector() {
  var modal = document.getElementById('joranChooserModal');
  if (modal) modal.classList.remove('show');
}

function openBaitSelector() {
  var availBaits = [];
  for (var r in G.baitInventory) {
    if ((G.baitInventory[r] || 0) > 0) availBaits.push(r);
  }
  if (availBaits.length === 0) {
    notify('\uD83E\uDEB1 Tidak punya umpan! Cari umpan saat jalan-jalan di Hutan.', true);
    return;
  }
  _pendingFishSlot = null;
  var modal = document.getElementById('baitChooserModal');
  var list  = document.getElementById('baitChooserList');
  if (!modal || !list) return;
  list.innerHTML = '';
  var rarOrder = ['common','uncommon','rare','veryrare','epic','legendary','mythical'];
  rarOrder.forEach(function(r) {
    var qty = G.baitInventory[r] || 0;
    if (qty <= 0) return;
    var ri = getRarityInfoByClass(r);
    var row = document.createElement('div');
    row.className = 'fish-bait-row' + (G.selectedBait === r ? ' selected' : '');
    row.innerHTML =
      '<span class="bait-name rarity-' + r + '">' + '\uD83E\uDEB1' + ' ' + ri.label + ' Umpan</span>' +
      '<span class="bait-qty">\xD7' + qty + '</span>';
    row.onclick = (function(rarity){ return function(){ selectBait(rarity); }; })(r);
    list.appendChild(row);
  });
  modal.classList.add('show');
}

function selectBait(rarity) {
  G.selectedBait = rarity;
  setSelectedBaitBox();
  closeBaitChooser();
}

function openBaitChooser(loc, idx) {
  // Cek apakah ada ikan yang bisa dipancing di lokasi ini
  var availFish = [];
  for (var fk in FISH) {
    var f = FISH[fk];
    if (f.loc === loc) availFish.push(fk);
  }

  // Auto-place jika umpan pilihan sudah ada dan stoknya cukup
  if (G.selectedBait && (G.baitInventory[G.selectedBait] || 0) > 0) {
    _pendingFishSlot = {loc: loc, idx: idx};
    placeBait(G.selectedBait);
    return;
  }

  // Cek umpan yang dimiliki
  var availBaits = [];
  for (var r in G.baitInventory) {
    if ((G.baitInventory[r] || 0) > 0) availBaits.push(r);
  }
  if (availBaits.length === 0) {
    notify('🪱 Tidak punya umpan! Cari umpan saat jalan-jalan di Hutan.', true);
    return;
  }

  _pendingFishSlot = {loc: loc, idx: idx};
  // Build modal content
  var modal = document.getElementById('baitChooserModal');
  var list = document.getElementById('baitChooserList');
  if (!modal || !list) return;
  list.innerHTML = '';
  var rarOrder = ['common','uncommon','rare','veryrare','epic','legendary','mythical'];
  rarOrder.forEach(function(r) {
    var qty = G.baitInventory[r] || 0;
    if (qty <= 0) return;
    var ri = getRarityInfoByClass(r);
    var row = document.createElement('div');
    row.className = 'fish-bait-row';
    row.innerHTML =
      '<span class="bait-name rarity-' + r + '">🪱 ' + ri.label + ' Umpan</span>' +
      '<span class="bait-qty">×' + qty + '</span>';
    row.onclick = (function(rarity){ return function(){ placeBait(rarity); }; })(r);
    list.appendChild(row);
  });
  modal.classList.add('show');
}

function closeBaitChooser() {
  var modal = document.getElementById('baitChooserModal');
  if (modal) modal.classList.remove('show');
  _pendingFishSlot = null;
}

function getRarityInfoByClass(cls) {
  var map = {
    common:{label:'Common'}, uncommon:{label:'Uncommon'}, rare:{label:'Rare'},
    veryrare:{label:'Very Rare'}, epic:{label:'Epic'}, legendary:{label:'Legendary'}, mythical:{label:'Mythical'}
  };
  return map[cls] || {label:cls};
}

function placeBait(baitRarity) {
  if (!_pendingFishSlot) return;
  var loc = _pendingFishSlot.loc, idx = _pendingFishSlot.idx;
  _pendingFishSlot = null;
  closeBaitChooser();
  _doPlaceBait(baitRarity, loc, idx);
}

// Pilih ikan berdasarkan umpan: 70% exact rarity, 20% satu rarity di bawah, 10% satu rarity di atas
function pickFishForBait(baitRarity, loc) {
  var baitRank = RARITY_RANK[baitRarity] || 0;
  function poolAtRank(rank) {
    var arr = [];
    if (rank < 0 || rank > 6) return arr;
    for (var fk in FISH) {
      var f = FISH[fk];
      if (f.loc !== loc) continue;
      if (f.weatherReq && f.weatherReq !== G.weather) continue;
      if (RARITY_RANK[f.rarityReq] === rank) arr.push(fk);
    }
    return arr;
  }
  var roll = Math.random();
  var targetRank;
  if      (roll < 0.20 && baitRank > 0) targetRank = baitRank - 1; // 20%: satu di bawah
  else if (roll < 0.30 && baitRank < 6) targetRank = baitRank + 1; // 10%: satu di atas
  else                                   targetRank = baitRank;      // 70%: exact
  var pool = poolAtRank(targetRank);
  if (pool.length === 0) pool = poolAtRank(baitRank); // fallback ke exact
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function _doPlaceBait(baitRarity, loc, idx) {
  if ((G.baitInventory[baitRarity] || 0) <= 0) { notify('Umpan habis!', true); return; }
  var joran = pickJoranForCast();
  if (!joran) { notify('🎣 Tidak ada Joran Pancing tersedia! Buat Joran di Kerajinan.', true); return; }

  var chosenKey = pickFishForBait(baitRarity, loc);
  if (!chosenKey) { notify('Tidak ada ikan yang cocok dengan umpan ini di lokasi ini!', true); return; }
  var chosenFish = FISH[chosenKey];
  var baseDuration = chosenFish.minTime + Math.random() * (chosenFish.maxTime - chosenFish.minTime);
  var speedMult = 1 - (G.upgrades.fishSpeed || 0) * 0.18;
  var weatherFishMult = (WEATHERS[G.weather] || WEATHERS['cerah']).fishMult;
  var duration = baseDuration * speedMult / weatherFishMult;
  duration = Math.max(5, duration); // minimal 5 detik
  var now = Date.now();

  G.baitInventory[baitRarity]--;
  var slot = G.fishSlots[loc][idx];
  slot.fishKey    = chosenKey;
  slot.baitRarity = baitRarity;
  slot.joranId    = joran.id;
  slot.startTime  = now;
  slot.endTime    = now + duration * 1000;
  slot.done       = false;
  var res = consumeJoranById(joran.id);
  if (res && res.depleted) {
    slot.joranId = null;
    addLog('🎣 Joran Pancing patah setelah dipakai!', 'neg');
    notify('🎣 Joran Pancing patah! Buat yang baru di Kerajinan.', true);
  }

  notify('\uD83C\uDFA3 Umpan dipasang di ' + FISH_LOC_LABEL[loc] + '! Menunggu ikan menyambar...');
  addLog('\uD83C\uDFA3 Pancing di ' + FISH_LOC_LABEL[loc] + ' slot ' + (idx+1) + ' \u2014 umpan ' + (BAIT_LABEL[baitRarity] || baitRarity), '');
  G.selectedBait = baitRarity;
  setSelectedBaitBox();
  setSelectedJoranBox();
  buildFishPage(loc);
  var _craftPage = document.getElementById('page-craft');
  if (_craftPage && _craftPage.classList.contains('active')) buildCraftPage();
}

function collectFish(loc, idx, _silent) {
  var slot = G.fishSlots[loc][idx];
  if (!slot.fishKey || !slot.done) return;
  var f = FISH[slot.fishKey];
  var grade = rollGrade(G.fishLevel);
  var fk = slot.fishKey;

  G.fishInventory[fk] = (G.fishInventory[fk] || 0) + 1;
  if (!G.fishGrades[fk]) G.fishGrades[fk] = {C:0,B:0,A:0,S:0,SS:0};
  G.fishGrades[fk][grade]++;
  if (!G.fishLog[fk]) G.fishLog[fk] = {C:0,B:0,A:0,S:0,SS:0};
  G.fishLog[fk][grade]++;

  addFishXP(f.xpFish);

  // Reset slot (joran dilepas, daya tahan sudah dikurangi saat cast)
  slot.fishKey = null; slot.baitRarity = null; slot.joranId = null;
  slot.startTime = 0; slot.endTime = 0; slot.done = false;

  if (_silent) return;

  notify('🐟 ' + f.name + ' [' + grade + '] berhasil dipancing!');
  addLog('🐟 Tangkap ' + f.name + ' [' + grade + '] di ' + FISH_LOC_LABEL[loc] + '! +⭐' + f.xpFish, 'pos');
  checkAllAchievements();
  buildFishPage(loc);
  refreshHUD();
  var _invPage = document.getElementById('page-inv');
  if (_invPage && _invPage.classList.contains('active')) buildInventoryPage();
}

// ── Fishing tick ─────────────────────────────────────────────
function tickFishing() {
  var now = Date.now();
  var anyNewDone = false, newDoneInCurrent = false, totalDone = 0;
  var locs = ['sungai','danau','laut'];
  for (var li = 0; li < locs.length; li++) {
    var loc = locs[li];
    var slots = G.fishSlots[loc];
    for (var si = 0; si < slots.length; si++) {
      var slot = slots[si];
      if (slot.fishKey && !slot.done && now >= slot.endTime) {
        slot.done = true;
        anyNewDone = true;
        if (loc === currentFishLoc) newDoneInCurrent = true;
      }
      if (slot.done) totalDone++;
    }
  }
  if (anyNewDone) {
    notify('\uD83C\uDFA3 Ada ikan yang menyambar! Segera klik slotnya!');
    if (newDoneInCurrent) {
      var fishPage = document.getElementById('page-fishing');
      if (fishPage && fishPage.classList.contains('active')) buildFishPage(currentFishLoc);
    }
    if (DOM.badgeFishing) DOM.badgeFishing.style.display = totalDone > 0 ? '' : 'none';
  }
}

// ══════════════════════════════════════════════════════
//  HOLD-TO-REPEAT HELPER
//  Panggil fn() langsung saat tombol ditekan, lalu ulangi
//  setiap 200ms setelah tahan 500ms. Berhenti saat dilepas.
// ══════════════════════════════════════════════════════
function applyHoldToRepeat(btn, fn) {
  var holdTimer = null;
  var holdInterval = null;
  var touchActive = false;
  var touchEndTimer = null;
  function startHold(e) {
    e.preventDefault();
    fn();
    // Jika btn sudah dihapus dari DOM oleh fn() (misal buildCookPage),
    // jangan pasang timer agar tidak terpicu lagi.
    if (!btn.isConnected) return;
    holdTimer = setTimeout(function() {
      holdInterval = setInterval(function() {
        if (btn.isConnected) fn(); else stopHold();
      }, 200);
    }, 500);
  }
  function stopHold() {
    clearTimeout(holdTimer);
    clearInterval(holdInterval);
    holdTimer = null;
    holdInterval = null;
  }
  btn.addEventListener('mousedown', function(e) {
    if (touchActive) return;
    startHold(e);
  });
  btn.addEventListener('touchstart', function(e) {
    touchActive = true;
    clearTimeout(touchEndTimer);
    startHold(e);
  }, { passive: false });
  btn.addEventListener('mouseup', stopHold);
  btn.addEventListener('mouseleave', stopHold);
  // Tahan touchActive selama 500ms setelah touchend agar synthetic mousedown
  // yang dikirim browser (~300ms kemudian) tidak memicu aksi kedua.
  btn.addEventListener('touchend', function() {
    stopHold();
    touchEndTimer = setTimeout(function() { touchActive = false; }, 500);
  });
  btn.addEventListener('touchcancel', function() {
    stopHold();
    touchEndTimer = setTimeout(function() { touchActive = false; }, 500);
  });
}

// ══════════════════════════════════════════════════════
//  CRAFTING PAGE (resep dari js/craft_recipes.js)
// ══════════════════════════════════════════════════════
function getCraftIngredientCount(ing) {
  if (ing.kind === 'plant') return G.inventory[ing.key] || 0;
  if (ing.kind === 'cat') {
    var s = 0;
    for (var k in PLANTS) if (PLANTS[k].cat === ing.cat) s += G.inventory[k] || 0;
    return s;
  }
  if (ing.kind === 'loot') return G.lootInventory[ing.key] || 0;
  if (ing.kind === 'bait') return G.baitInventory[ing.rarity] || 0;
  if (ing.kind === 'fish_loc') {
    var t = 0;
    for (var fk in FISH) if (FISH[fk].loc === ing.loc) t += G.fishInventory[fk] || 0;
    return t;
  }
  return 0;
}

function craftIngredientLabel(ing) {
  if (ing.kind === 'plant') {
    var p = PLANTS[ing.key];
    return p ? (p.emoji + ' ' + p.name) : ing.key;
  }
  if (ing.kind === 'cat') return '\uD83C\uDF3F ' + ing.cat + ' (apa saja)';
  if (ing.kind === 'loot') {
    var l = LOOT_CATALOG[ing.key];
    return l ? (l.emoji + ' ' + l.name) : ing.key;
  }
  if (ing.kind === 'bait') {
    var lbl = (typeof BAIT_LABEL !== 'undefined' && BAIT_LABEL[ing.rarity]) || ing.rarity;
    return '\uD83E\uDEB1 Umpan ' + lbl;
  }
  if (ing.kind === 'fish_loc') {
    var locName = ing.loc === 'sungai' ? 'Sungai' : ing.loc === 'danau' ? 'Danau' : 'Laut';
    return '\uD83D\uDC1F Ikan ' + locName;
  }
  return '?';
}

function canCraftRecipe(recipe) {
  if (recipe.coinCost && G.coins < recipe.coinCost) return false;
  for (var i = 0; i < recipe.ingredients.length; i++) {
    if (getCraftIngredientCount(recipe.ingredients[i]) < recipe.ingredients[i].qty) return false;
  }
  return true;
}

function deductCraftIngredient(ing) {
  var rem = ing.qty;
  if (ing.kind === 'plant') {
    G.inventory[ing.key] = Math.max(0, (G.inventory[ing.key] || 0) - rem);
    if (G.inventoryGrades[ing.key]) {
      var gd = G.inventoryGrades[ing.key];
      ['C','B','A','S','SS'].forEach(function(g){ var c=Math.min(rem,gd[g]||0); gd[g]-=c; rem-=c; });
    }
  } else if (ing.kind === 'cat') {
    for (var k in PLANTS) {
      if (rem <= 0) break;
      if (PLANTS[k].cat !== ing.cat) continue;
      var qty = G.inventory[k] || 0; if (qty <= 0) continue;
      var t = Math.min(rem, qty);
      G.inventory[k] -= t;
      if (G.inventoryGrades[k]) {
        var gd2 = G.inventoryGrades[k], r2 = t;
        ['C','B','A','S','SS'].forEach(function(g){ var c=Math.min(r2,gd2[g]||0); gd2[g]-=c; r2-=c; });
      }
      rem -= t;
    }
  } else if (ing.kind === 'loot') {
    G.lootInventory[ing.key] = Math.max(0, (G.lootInventory[ing.key] || 0) - rem);
  } else if (ing.kind === 'bait') {
    G.baitInventory[ing.rarity] = Math.max(0, (G.baitInventory[ing.rarity] || 0) - rem);
  } else if (ing.kind === 'fish_loc') {
    for (var fk in FISH) {
      if (rem <= 0) break;
      if (FISH[fk].loc !== ing.loc) continue;
      var q = G.fishInventory[fk] || 0; if (q <= 0) continue;
      var tt = Math.min(rem, q);
      G.fishInventory[fk] -= tt;
      if (G.fishGrades[fk]) {
        var gf = G.fishGrades[fk], r3 = tt;
        ['C','B','A','S','SS'].forEach(function(g){ var c=Math.min(r3,gf[g]||0); gf[g]-=c; r3-=c; });
      }
      rem -= tt;
    }
  }
}

function buildCraftPage() {
  var grid = document.getElementById('craftGrid');
  if (!grid) return;
  if (typeof CRAFT_RECIPES === 'undefined') {
    grid.innerHTML = '<div class="inv-empty-msg">Belum ada resep. Tambahkan di js/craft_recipes.js</div>';
    return;
  }
  var frag = document.createDocumentFragment();
  var hasAny = false;
  for (var key in CRAFT_RECIPES) {
    hasAny = true;
    var recipe = CRAFT_RECIPES[key];
    var canCraft = canCraftRecipe(recipe);
    var ingHtml = '';
    for (var i = 0; i < recipe.ingredients.length; i++) {
      var ing = recipe.ingredients[i];
      var have = getCraftIngredientCount(ing);
      var enough = have >= ing.qty;
      ingHtml += '<div class="cook-ing' + (!enough ? ' cook-ing-lack' : '') + '">' + craftIngredientLabel(ing) + ' \xD7' + ing.qty + ' <span class="cook-have">(' + have + ' dimiliki)</span></div>';
    }
    if (recipe.coinCost && recipe.coinCost > 0) {
      var coinOk = G.coins >= recipe.coinCost;
      ingHtml += '<div class="cook-ing' + (!coinOk ? ' cook-ing-lack' : '') + '">\uD83E\uDE99 ' + recipe.coinCost + ' koin <span class="cook-have">(' + G.coins + ' dimiliki)</span></div>';
    }
    var ownedHtml = '';
    if (recipe.output && recipe.output.kind === 'tool') {
      var owned = (G.tools[recipe.output.key] || []).length;
      ownedHtml = '<div class="cook-reward">Dimiliki: ' + (recipe.output.emoji || '') + ' \xD7' + owned + ' &nbsp; Daya tahan awal: ' + (recipe.output.durability || 100) + '</div>';
    }
    var card = document.createElement('div');
    card.className = 'cook-card' + (canCraft ? '' : ' cook-disabled');
    card.innerHTML =
      '<div class="cook-emoji">' + recipe.emoji + '</div>' +
      '<div class="cook-info">' +
        '<div class="cook-name">' + recipe.name + '</div>' +
        '<div class="cook-desc">' + recipe.desc + '</div>' +
        '<div class="cook-ingredients">' + ingHtml + '</div>' +
        ownedHtml +
      '</div>' +
      '<button class="cook-btn"' + (!canCraft ? ' disabled' : '') + '>\uD83D\uDD28 Buat</button>';
    if (canCraft) {
      applyHoldToRepeat(card.querySelector('.cook-btn'), (function(k){ return function(){ craftRecipe(k); }; })(key));
    }
    frag.appendChild(card);
  }
  grid.innerHTML = '';
  if (hasAny) grid.appendChild(frag);
  else grid.innerHTML = '<div class="inv-empty-msg">Belum ada resep. Tambahkan di js/craft_recipes.js</div>';
}

function craftRecipe(key) {
  var recipe = CRAFT_RECIPES[key];
  if (!recipe) return;
  if (!canCraftRecipe(recipe)) { notify('Bahan tidak cukup!', true); return; }
  for (var i = 0; i < recipe.ingredients.length; i++) deductCraftIngredient(recipe.ingredients[i]);
  if (recipe.coinCost) G.coins -= recipe.coinCost;
  if (recipe.output && recipe.output.kind === 'tool') {
    if (!G.tools[recipe.output.key]) G.tools[recipe.output.key] = [];
    G.tools[recipe.output.key].push({ id: G.nextToolId++, dur: recipe.output.durability || 100 });
  }
  refreshHUD();
  var outLabel = (recipe.output && recipe.output.label) || recipe.name;
  notify('\uD83D\uDD28 Berhasil membuat ' + outLabel + '!');
  addLog('\uD83D\uDD28 Buat ' + recipe.name, 'pos');
  buildCraftPage();
  var _invPage = document.getElementById('page-inv');
  if (_invPage && _invPage.classList.contains('active')) {
    if (currentInvTab === 'tool') buildToolInvGrid();
    else if (currentInvTab === 'harvest') buildInvGrid();
  }
}

// -- Joran / Tool helpers --------------------------------------
function getJoranToolKey() {
  if (typeof CRAFT_RECIPES !== 'undefined') {
    for (var _jk in CRAFT_RECIPES) {
      var _jr = CRAFT_RECIPES[_jk];
      if (_jr.output && _jr.output.kind === 'tool' && _jr.output.role === 'fishing_rod') return _jr.output.key;
    }
    for (var _jk2 in CRAFT_RECIPES) {
      var _jr2 = CRAFT_RECIPES[_jk2];
      if (_jr2.output && _jr2.output.kind === 'tool') return _jr2.output.key;
    }
  }
  return 'joran_pancing';
}
function getJoranList() {
  var key = getJoranToolKey();
  return (G.tools && G.tools[key]) ? G.tools[key] : [];
}
function getJoranCount() { return getJoranList().length; }

function getUsedJoranIds() {
  var used = {};
  ['sungai','danau','laut'].forEach(function(loc){
    if (!G.fishSlots[loc]) return;
    G.fishSlots[loc].forEach(function(s){ if (s && s.joranId != null) used[s.joranId] = true; });
  });
  return used;
}

function getAvailableJorans() {
  var used = getUsedJoranIds();
  return getJoranList().filter(function(j){ return !used[j.id]; });
}

function pickJoranForCast() {
  var avail = getAvailableJorans();
  if (avail.length === 0) return null;
  if (G.selectedJoran !== null) {
    for (var i = 0; i < avail.length; i++) {
      if (avail[i].id === G.selectedJoran) return avail[i];
    }
  }
  avail.sort(function(a, b){ return a.dur - b.dur; });
  return avail[0];
}

function consumeJoranById(id) {
  var arr = getJoranList();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      arr[i].dur--;
      if (arr[i].dur <= 0) { arr.splice(i, 1); return { depleted: true }; }
      return { depleted: false, dur: arr[i].dur };
    }
  }
  return null;
}

// ══════════════════════════════════════════════════════
//  INVENTORY TABS
// ══════════════════════════════════════════════════════
function switchInvTab(tab) {
  currentInvTab = tab;
  ['harvest','fish','bait','tool','egg','loot'].forEach(function(t) {
    var btn = document.getElementById('invTab' + t.charAt(0).toUpperCase() + t.slice(1));
    var panel = document.getElementById('invPanel' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.toggle('active', t === tab);
    if (panel) panel.style.display = t === tab ? '' : 'none';
  });
  if (tab === 'harvest') buildInvGrid();
  if (tab === 'fish')    buildFishInvGrid();
  if (tab === 'bait')    buildBaitInvGrid();
  if (tab === 'tool')    buildToolInvGrid();
  if (tab === 'egg')     buildEggInvGrid();
  if (tab === 'loot')    buildLootInvGrid();
}

function buildInventoryPage() {
  if (currentInvTab === 'harvest') buildInvGrid();
  else if (currentInvTab === 'fish') buildFishInvGrid();
  else if (currentInvTab === 'bait') buildBaitInvGrid();
  else if (currentInvTab === 'tool') buildToolInvGrid();
  else if (currentInvTab === 'egg')  buildEggInvGrid();
  else if (currentInvTab === 'loot') buildLootInvGrid();
}

function buildToolInvGrid() {
  var grid = document.getElementById('toolInvGrid');
  if (!grid) return;
  var frag = document.createDocumentFragment();
  var hasAny = false;
  for (var toolKey in G.tools) {
    var arr = G.tools[toolKey] || [];
    if (arr.length === 0) continue;
    var meta = (typeof TOOL_CATALOG !== 'undefined' && TOOL_CATALOG[toolKey]) || { label: toolKey, emoji: '🔧', durability: 100 };
    var used = getUsedJoranIds();
    arr.forEach(function(inst) {
      hasAny = true;
      var pct = Math.round((inst.dur / (meta.durability || 100)) * 100);
      var inUse = !!used[inst.id];
      var card = document.createElement('div');
      card.className = 'inv-card';
      card.innerHTML =
        '<div class="inv-emoji">' + meta.emoji + '</div>' +
        '<div class="inv-info">' +
          '<div class="inv-name">' + meta.label + (inUse ? ' <span style="color:#7ec8e3;font-size:0.7rem">(sedang dipakai)</span>' : '') + '</div>' +
          '<div class="inv-val">Daya tahan: ' + inst.dur + ' / ' + (meta.durability || 100) + ' (' + pct + '%)</div>' +
        '</div>';
      frag.appendChild(card);
    });
  }
  grid.innerHTML = '';
  if (hasAny) grid.appendChild(frag);
  else grid.innerHTML = '<div class="inv-empty-msg">🎣 Belum punya alat. Buat Joran Pancing di halaman Kerajinan!</div>';
}

// ── Fish inventory ───────────────────────────────────────────
function applyFishInvFilter() {
  invFilterFishLoc    = document.getElementById('invFilterFishLoc')    ? document.getElementById('invFilterFishLoc').value    : '';
  invFilterFishRarity = document.getElementById('invFilterFishRarity') ? document.getElementById('invFilterFishRarity').value : '';
  invFilterFishGrade  = document.getElementById('invFilterFishGrade')  ? document.getElementById('invFilterFishGrade').value  : '';
  buildFishInvGrid();
}

function buildFishInvGrid() {
  var grid = document.getElementById('fishInvGrid');
  if (!grid) return;
  var frag = document.createDocumentFragment();
  var hasItems = false, totalVal = 0;

  for (var fk in FISH) {
    var qty = G.fishInventory[fk] || 0; if (qty <= 0) continue;
    var f = FISH[fk];
    if (invFilterFishLoc && f.loc !== invFilterFishLoc) continue;
    var rar = getFishRarityInfo(f.unlock);
    if (invFilterFishRarity && rar.label !== invFilterFishRarity) continue;
    var gd = G.fishGrades[fk] || {};
    if (invFilterFishGrade && !((gd[invFilterFishGrade] || 0) > 0)) continue;

    var gradeBadges = '';
    var itemVal = 0;
    for (var gi = 0; gi < GRADE_ORDER.length; gi++) {
      var gk = GRADE_ORDER[gi], cnt = gd[gk] || 0;
      if (cnt > 0) {
        gradeBadges += '<span class="grade-tag" style="background:' + GRADES[gk].color + ';color:' + GRADES[gk].textColor + '">' + gk + '×' + cnt + '</span>';
        itemVal += cnt * gradePrice(f.reward, gk);
      }
    }
    totalVal += itemVal;
    hasItems = true;

    var card = document.createElement('div');
    card.className = 'inv-card rarity-' + rar.cls;
    card.innerHTML =
      '<div class="inv-emoji">' + f.emoji + '</div>' +
      '<div class="inv-info">' +
        '<div class="inv-name"><span class="inv-counter">' + qty + '</span>' + f.name + '</div>' +
        '<div class="grade-badges">' + gradeBadges + '</div>' +
        '<div class="inv-val">🪙 ' + itemVal + '</div>' +
      '</div>' +
      '<button class="inv-sell-btn">Jual</button>';
    card.querySelector('.inv-sell-btn').onclick = (function(key){ return function(){ openFishSellModal(key); }; })(fk);
    frag.appendChild(card);
  }

  grid.innerHTML = '';
  if (hasItems) grid.appendChild(frag);
  else grid.innerHTML = '<div class="inv-empty-msg">🐟 Belum ada hasil pancingan.</div>';

  var valEl = document.getElementById('fishInvTotalVal');
  if (valEl) valEl.textContent = '🪙 ' + totalVal;
  var sellBtn = document.getElementById('fishSellAllBtn');
  if (sellBtn) sellBtn.disabled = !hasItems;
}

function buildBaitInvGrid() {
  var grid = document.getElementById('baitInvGrid');
  if (!grid) return;
  var frag = document.createDocumentFragment();
  var hasAny = false;
  var rarOrder = ['common','uncommon','rare','veryrare','epic','legendary','mythical'];
  rarOrder.forEach(function(r) {
    var qty = G.baitInventory[r] || 0; if (qty <= 0) return;
    hasAny = true;
    var ri = getRarityInfoByClass(r);
    var card = document.createElement('div');
    card.className = 'inv-card rarity-' + r;
    card.innerHTML =
      '<div class="inv-emoji">🪱</div>' +
      '<div class="inv-info">' +
        '<div class="inv-name"><span class="inv-counter">' + qty + '</span>Umpan ' + ri.label + '</div>' +
        '<div class="inv-val">×' + qty + '</div>' +
      '</div>';
    frag.appendChild(card);
  });
  grid.innerHTML = '';
  if (hasAny) grid.appendChild(frag);
  else grid.innerHTML = '<div class="inv-empty-msg">🪱 Belum ada umpan. Cari umpan saat jalan-jalan di Hutan!</div>';
}

// ── Egg inventory ─────────────────────────────────────────
function buildEggInvGrid() {
  var grid = document.getElementById('eggInvGrid');
  if (!grid) return;
  var frag = document.createDocumentFragment();
  var hasItems = false, totalVal = 0;
  for (var fk in G.eggInventory) {
    var qty = G.eggInventory[fk] || 0;
    if (qty <= 0) continue;
    var f = FISH[fk];
    if (!f) continue;
    hasItems = true;
    var val = Math.max(1, Math.floor(f.reward * 0.3));
    totalVal += val * qty;
    var card = document.createElement('div');
    card.className = 'inv-card';
    card.innerHTML =
      '<div class="inv-emoji">🥚</div>' +
      '<div class="inv-info">' +
        '<div class="inv-name"><span class="inv-counter">' + qty + '</span>Telur ' + f.name + '</div>' +
        '<div class="inv-qty">' + f.emoji + ' \xD7' + qty + '</div>' +
        '<div class="inv-val">🪙 ' + (val * qty) + '</div>' +
      '</div>';
    // create sell button with explicit handler
    (function(fkCopy){
      var btn = document.createElement('button');
      btn.className = 'inv-sell-btn';
      btn.textContent = 'Jual';
      btn.addEventListener('click', function(){ sellEggs(fkCopy); });
      card.appendChild(btn);
    })(fk);
    frag.appendChild(card);
  }
  grid.innerHTML = '';
  var totalValEl = document.getElementById('eggInvTotalVal');
  var sellBtn = document.getElementById('eggSellAllBtn');
  if (!hasItems) {
    grid.innerHTML = '<div class="inv-empty-msg">🥚 Belum ada telur. Masukkan ikan ke Kolam Ikan dan tunggu telur terkumpul!</div>';
    if (totalValEl) totalValEl.textContent = '🪙 0';
    if (sellBtn) sellBtn.disabled = true;
    return;
  }
  grid.appendChild(frag);
  if (totalValEl) totalValEl.textContent = '🪙 ' + totalVal;
  if (sellBtn) sellBtn.disabled = false;
}

function buildLootInvGrid() {
  var grid = document.getElementById('lootInvGrid');
  if (!grid) return;
  var frag = document.createDocumentFragment();
  var totalQty = 0, totalValue = 0;
  for (var lk in LOOT_CATALOG) {
    var qty = G.lootInventory[lk] || 0;
    if (qty <= 0) continue;
    var loot = LOOT_CATALOG[lk];
    totalQty += qty;
    totalValue += (loot.value || 0) * qty;
    var card = document.createElement('div');
    card.className = 'inv-card';
    card.innerHTML =
      '<div class="inv-emoji">' + loot.emoji + '</div>' +
      '<div class="inv-info">' +
        '<div class="inv-name"><span class="inv-counter">' + qty + '</span>' + loot.name + '</div>' +
        '<div class="inv-val">🪙 ' + ((loot.value||0) * qty) + '</div>' +
      '</div>' +
      '<button class="inv-sell-btn">Jual</button>';
    card.querySelector('.inv-sell-btn').onclick = (function(key){ return function(){ openLootSellModal(key); }; })(lk);
    frag.appendChild(card);
  }
  grid.innerHTML = '';
  var totalValEl = document.getElementById('lootInvTotalVal');
  var sellBtn = document.getElementById('lootSellAllBtn');
  if (totalQty > 0) {
    grid.appendChild(frag);
    if (totalValEl) totalValEl.textContent = '🎒 ' + totalQty + ' barang / 🪙 ' + totalValue;
    if (sellBtn) sellBtn.disabled = false;
  } else {
    grid.innerHTML = '<div class="inv-empty-msg">🎒 Belum ada loot hutan. Jalan-jalan ke Hutan dulu!</div>';
    if (totalValEl) totalValEl.textContent = '🎒 0 barang / 🪙 0';
    if (sellBtn) sellBtn.disabled = true;
  }
}

function sellEggs(fishKey) {
  var qty = G.eggInventory[fishKey] || 0;
  if (qty <= 0) return;
  var f = FISH[fishKey];
  var val = Math.max(1, Math.floor((f ? f.reward : 10) * 0.3));
  var earned = val * qty;
  G.eggInventory[fishKey] = 0;
  G.coins += earned;
  G.totalEarned += earned;
  refreshHUD();
  notify('🥚 Jual ' + qty + ' Telur ' + (f ? f.name : '') + ' → 🪙' + earned);
  buildEggInvGrid();
}

function sellAllEggs() {
  var earned = 0;
  for (var fk in G.eggInventory) {
    var qty = G.eggInventory[fk] || 0;
    if (qty <= 0) continue;
    var f = FISH[fk];
    var val = Math.max(1, Math.floor((f ? f.reward : 10) * 0.3));
    earned += val * qty;
    G.eggInventory[fk] = 0;
  }
  if (earned <= 0) { notify('Tidak ada telur untuk dijual!', true); return; }
  G.coins += earned;
  G.totalEarned += earned;
  refreshHUD();
  notify('🥚 Jual semua telur → 🪙' + earned);
  buildEggInvGrid();
}

function sellAllLoot() {
  var total = 0, qtyCount = 0;
  for (var lk in LOOT_CATALOG) {
    var qty = G.lootInventory[lk] || 0;
    if (qty <= 0) continue;
    var loot = LOOT_CATALOG[lk];
    total += (loot.value || 0) * qty;
    qtyCount += qty;
    G.lootInventory[lk] = 0;
  }
  if (total <= 0) { notify('Tidak ada loot untuk dijual!', true); return; }
  G.coins += total;
  G.totalEarned += total;
  refreshHUD();
  notify('💰 Jual semua loot (' + qtyCount + ' barang) → 🪙' + total);
  addLog('💰 Jual semua loot (' + qtyCount + ' barang) +🪙' + total, 'pos');
  buildLootInvGrid();
}

// ── Fish sell modal ──────────────────────────────────────────
function openFishSellModal(key) {
  var f = FISH[key]; if (!f) return;
  var gd = G.fishGrades[key] || {};
  _fishSellKey = key; _fishSellGrade = null;
  _fishSellMaxQty = G.fishInventory[key] || 0;
  if (_fishSellMaxQty <= 0) return;
  _fishSellQty = 1;

  // Reuse sell modal
  DOM.sellModalEmoji.textContent = f.emoji;
  DOM.sellModalName.textContent  = f.name;
  var b = '';
  for (var i = 0; i < GRADE_ORDER.length; i++) {
    var gk = GRADE_ORDER[i], gc = gd[gk] || 0;
    if (gc > 0) b += '<span class="grade-tag" style="background:' + GRADES[gk].color + ';color:' + GRADES[gk].textColor + '">' + gk + '×' + gc + '</span> ';
  }
  DOM.sellModalGrade.innerHTML = b || '—';
  _sellKey = null; // Mark as fish sell
  DOM.sellModal.classList.add('show');
  _updateFishSellModal();
}

function _updateFishSellModal() {
  if (!_fishSellKey) return;
  var f = FISH[_fishSellKey];
  var gd = G.fishGrades[_fishSellKey] || {};
  DOM.sellModalQty.textContent    = _fishSellQty;
  DOM.sellModalBtnQty.textContent = _fishSellQty;
  var val = 0, rem = _fishSellQty;
  ['C','B','A','S','SS'].forEach(function(g){ var c=Math.min(rem,gd[g]||0); val+=c*gradePrice(f.reward,g); rem-=c; });
  DOM.sellModalValue.textContent = '🪙 ' + val;
}

function confirmSellModal() {
  if (_fishSellKey) { confirmFishSellModal(); return; }
  if (_sellType === 'loot') { confirmLootSellModal(); return; }
  if (!_sellKey || _sellQty <= 0) return;
  var p = PLANTS[_sellKey];
  var gradeData = G.inventoryGrades[_sellKey] || {};
  var earned = 0, sold = 0;
  if (_sellGrade) {
    var avail = Math.min(_sellQty, gradeData[_sellGrade]||0);
    earned = avail * gradePrice(p.reward, _sellGrade);
    gradeData[_sellGrade] = (gradeData[_sellGrade]||0) - avail;
    sold = avail;
  } else {
    var ord = ['C','B','A','S','SS'], rem = _sellQty;
    for (var j = 0; j < ord.length && rem > 0; j++) {
      var c = Math.min(rem, gradeData[ord[j]]||0);
      earned += c * gradePrice(p.reward, ord[j]);
      gradeData[ord[j]] = (gradeData[ord[j]]||0) - c;
      sold += c; rem -= c;
    }
  }
  G.inventory[_sellKey] = Math.max(0, (G.inventory[_sellKey]||0) - sold);
  G.inventoryGrades[_sellKey] = gradeData;
  G.coins += earned; G.totalEarned += earned;
  closeSellModal();
  buildInventoryPage(); refreshHUD();
  notify('💰 Jual ' + sold + '× ' + p.name + ' → +🪙' + earned);
  addLog('💰 Jual ' + sold + '× ' + p.name + ' +🪙' + earned, 'pos');
}

function confirmLootSellModal() {
  if (!_sellKey || _sellQty <= 0) return;
  var loot = LOOT_CATALOG[_sellKey];
  var qty = Math.min(_sellQty, G.lootInventory[_sellKey]||0);
  var earned = (loot ? loot.value : 0) * qty;
  G.lootInventory[_sellKey] = Math.max(0, (G.lootInventory[_sellKey]||0) - qty);
  G.coins += earned; G.totalEarned += earned;
  closeSellModal();
  buildInventoryPage(); refreshHUD();
  notify('💰 Jual ' + qty + '× ' + (loot ? loot.name : 'Loot') + ' → +🪙' + earned);
  addLog('💰 Jual ' + qty + '× ' + (loot ? loot.name : 'Loot') + ' +🪙' + earned, 'pos');
}

function confirmFishSellModal() {
  var f = FISH[_fishSellKey];
  var gd = G.fishGrades[_fishSellKey] || {};
  var earned = 0, sold = 0, rem = _fishSellQty;
  ['C','B','A','S','SS'].forEach(function(g){ var c=Math.min(rem,gd[g]||0); earned+=c*gradePrice(f.reward,g); gd[g]-=c; sold+=c; rem-=c; });
  G.fishInventory[_fishSellKey] = Math.max(0, (G.fishInventory[_fishSellKey]||0) - sold);
  G.fishGrades[_fishSellKey] = gd;
  G.coins += earned; G.totalEarned += earned;
  _fishSellKey = null;
  closeSellModal();
  buildFishInvGrid(); refreshHUD();
  notify('💰 Jual ' + sold + '× ' + f.name + ' → +🪙' + earned);
  addLog('💰 Jual ' + sold + '× ' + f.name + ' +🪙' + earned, 'pos');
}

function sellModalAll() {
  if (_fishSellKey) { _fishSellQty = _fishSellMaxQty; confirmFishSellModal(); return; }
  if (_sellType === 'loot') { _sellQty = _sellMaxQty; confirmLootSellModal(); return; }
  _sellQty = _sellMaxQty; confirmSellModal();
}

function sellModalAdj(delta) {
  if (_fishSellKey) {
    _fishSellQty = Math.max(1, Math.min(_fishSellMaxQty, _fishSellQty + delta));
    _updateFishSellModal();
  } else if (_sellType === 'loot') {
    _sellQty = Math.max(1, Math.min(_sellMaxQty, _sellQty + delta));
    _updateLootSellModal();
  } else {
    _sellQty = Math.max(1, Math.min(_sellMaxQty, _sellQty + delta));
    _updateSellModal();
  }
}

function sellAllFish() {
  var total = 0, count = 0;
  for (var fk in FISH) {
    var qty = G.fishInventory[fk] || 0; if (qty <= 0) continue;
    var f = FISH[fk];
    if (invFilterFishLoc && f.loc !== invFilterFishLoc) continue;
    var rar = getFishRarityInfo(f.unlock);
    if (invFilterFishRarity && rar.label !== invFilterFishRarity) continue;
    var gd = G.fishGrades[fk] || {};
    var val = 0;
    ['C','B','A','S','SS'].forEach(function(g){ val += (gd[g]||0) * gradePrice(f.reward,g); gd[g]=0; });
    total += val; count += qty;
    G.fishInventory[fk] = 0; G.fishGrades[fk] = {C:0,B:0,A:0,S:0,SS:0};
  }
  if (total > 0) {
    G.coins += total; G.totalEarned += total;
    buildFishInvGrid(); refreshHUD();
    notify('💰 Jual semua ' + count + ' ikan → +🪙' + total);
    addLog('💰 Jual semua ' + count + ' ikan +🪙' + total, 'pos');
  } else { notify('Hasil pancingan kosong!', true); }
}

// ══════════════════════════════════════════════════════
//  STATS — Fish section
// ══════════════════════════════════════════════════════
function buildFishStatsSection(container) {
  // Header
  var hdr = document.createElement('div');
  hdr.className = 'stats-section-hdr';
  hdr.textContent = '🐟 Semua Ikan';
  container.appendChild(hdr);

  // Summary cards hanya ditampilkan di buildStatsSummary (atas), tidak di sini
  var totalFishCaught = 0;
  for (var fk in G.fishLog) {
    var l = G.fishLog[fk];
    var t = (l.C||0)+(l.B||0)+(l.A||0)+(l.S||0)+(l.SS||0);
    if (t > 0) { totalFishCaught += t; }
  }

  // Build grouped tree by location
  // locData[loc][rarLabel] = [{fk,f,log,tot,rar}]
  var locData = {};
  FISH_LOCATIONS.forEach(function(loc) { locData[loc] = {}; RAR_ORDER.forEach(function(r){ locData[loc][r]=[]; }); });
  var grandTotal = 0;

  for (var fk2 in FISH) {
    var f = FISH[fk2];
    var log = G.fishLog[fk2] || {C:0,B:0,A:0,S:0,SS:0};
    var tot = (log.C||0)+(log.B||0)+(log.A||0)+(log.S||0)+(log.SS||0);
    var rar = getFishRarityInfo(f.unlock);
    var rarLabel = getRarityInfoByClass(rar.cls).label;
    if (!locData[f.loc]) continue;
    locData[f.loc][rarLabel] = locData[f.loc][rarLabel] || [];
    locData[f.loc][rarLabel].push({fk:fk2, f:f, log:log, tot:tot, rar:rar});
    grandTotal += tot;
  }

  // Level 1: Semua Ikan
  var root = document.createElement('div'); root.className = 'stree-root';
  var rootHdr = document.createElement('div');
  rootHdr.className = 'stree-row stree-lv1';
  rootHdr.innerHTML = '<span class="stree-chevron">&#9654;</span><span class="stree-icon">🐟</span><span class="stree-label">Semua Ikan</span><span class="stree-val">= ' + grandTotal + '</span>';
  var rootBody = document.createElement('div'); rootBody.className = 'stree-body';
  makeColl(rootHdr, rootBody);

  FISH_LOCATIONS.forEach(function(loc) {
    var rarGroups = locData[loc];
    var locTotal = 0;
    RAR_ORDER.forEach(function(r){ (rarGroups[r]||[]).forEach(function(e){ locTotal+=e.tot; }); });
    if (!locTotal) return;

    var catEl = document.createElement('div'); catEl.className='stree-node';
    var catHdr = document.createElement('div');
    catHdr.className = 'stree-row stree-lv2';
    catHdr.style.setProperty('--cat-color','rgba(2,136,209,0.18)');
    catHdr.innerHTML = '<span class="stree-chevron">&#9654;</span><span class="stree-icon">'+FISH_LOC_EMOJI[loc]+'</span><span class="stree-label">'+FISH_LOC_LABEL[loc]+'</span><span class="stree-val">= '+locTotal+'</span>';
    var catBody = document.createElement('div'); catBody.className='stree-body';
    makeColl(catHdr, catBody);

    RAR_ORDER.forEach(function(rarLabel) {
      var fish = rarGroups[rarLabel] || [];
      if (!fish.length) return;
      var ri = RAR_INFO[rarLabel];
      var rarTotal = 0; fish.forEach(function(e){ rarTotal+=e.tot; });
      if (!rarTotal) return;
      fish.sort(function(a,b){ return b.tot - a.tot; });

      var rarEl = document.createElement('div'); rarEl.className='stree-node';
      var rarHdr = document.createElement('div');
      rarHdr.className = 'stree-row stree-lv3';
      rarHdr.style.background = ri ? ri.bg : 'rgba(255,255,255,0.05)';
      rarHdr.innerHTML = '<span class="stree-chevron">&#9654;</span><span class="stree-rar-dot" style="background:'+(ri?ri.color:'#aaa')+'"></span><span class="stree-label">'+rarLabel+'</span><span class="stree-val">= '+rarTotal+'</span>';
      var rarBody = document.createElement('div'); rarBody.className='stree-body';
      makeColl(rarHdr, rarBody);

      fish.forEach(function(e) {
        if (!e.tot) return;
        var plEl = document.createElement('div'); plEl.className='stree-node';
        var plHdr = document.createElement('div');
        plHdr.className = 'stree-row stree-lv4';
        var wxBadge = e.f.weatherReq ? ' <span style="font-size:0.65rem;opacity:0.85">' + (WEATHERS[e.f.weatherReq]||WEATHERS['cerah']).emoji + '</span>' : '';
        plHdr.innerHTML = '<span class="stree-chevron">&#9654;</span><span class="stree-icon">'+e.f.emoji+'</span><span class="stree-label">'+e.f.name+wxBadge+'</span><span class="stree-val">= '+e.tot+'</span>';
        var plBody = document.createElement('div'); plBody.className='stree-body';
        makeColl(plHdr, plBody);

        for (var gi=0; gi<GRADE_ORDER.length; gi++) {
          var gk=GRADE_ORDER[gi], cnt=e.log[gk]||0; if (!cnt) continue;
          var gradeRow=document.createElement('div');
          gradeRow.className='stree-row stree-lv5';
          gradeRow.innerHTML='<span class="stree-grade-badge" style="background:'+GRADES[gk].color+';color:'+GRADES[gk].textColor+'">'+gk+'</span><span class="stree-label">Grade '+gk+'</span><span class="stree-val">= '+cnt+'</span>';
          plBody.appendChild(gradeRow);
        }
        plEl.appendChild(plHdr); plEl.appendChild(plBody);
        rarBody.appendChild(plEl);
      });
      rarEl.appendChild(rarHdr); rarEl.appendChild(rarBody);
      catBody.appendChild(rarEl);
    });
    catEl.appendChild(catHdr); catEl.appendChild(catBody);
    rootBody.appendChild(catEl);
  });
  root.appendChild(rootHdr); root.appendChild(rootBody);
  container.appendChild(root);
}

function buildCookStatsSection(container) {
  // Header seksi masakan
  var hdr = document.createElement('div');
  hdr.className = 'stats-section-hdr';
  hdr.style.borderColor = '#ff9800';
  hdr.style.background = 'rgba(255,152,0,0.1)';
  hdr.textContent = '\uD83C\uDF73 Semua Masakan';
  container.appendChild(hdr);

  // Hitung total semua masakan yang pernah dibuat
  var grandTotal = 0;
  for (var rk in G.cookInventory) grandTotal += (G.cookInventory[rk] || 0);

  var root = document.createElement('div'); root.className = 'stree-root';
  var rootHdr = document.createElement('div');
  rootHdr.className = 'stree-row stree-lv1';
  rootHdr.innerHTML = '<span class="stree-chevron">&#9654;</span><span class="stree-icon">\uD83C\uDF73</span><span class="stree-label">Masakan Dibuat</span><span class="stree-val">= ' + grandTotal + '</span>';
  var rootBody = document.createElement('div'); rootBody.className = 'stree-body';
  makeColl(rootHdr, rootBody);

  // Daftar resep yang pernah dibuat (count > 0)
  var entries = [];
  for (var key in RECIPES) {
    var recipe = RECIPES[key];
    var count = G.cookInventory[key] || 0;
    if (count <= 0) continue;
    var cookInfo = getCookLevelInfo(key);
    entries.push({ key: key, recipe: recipe, count: count, cookInfo: cookInfo });
  }
  // Sort: terbanyak dibuat dulu
  entries.sort(function(a, b) { return b.count - a.count; });

  entries.forEach(function(e) {
    var el = document.createElement('div'); el.className = 'stree-node';
    var elHdr = document.createElement('div');
    elHdr.className = 'stree-row stree-lv2';
    elHdr.style.setProperty('--cat-color', 'rgba(255,152,0,0.15)');

    // Tampilkan level masak
    var lvLabel = e.cookInfo.level > 0
      ? ' <span style="font-size:0.65rem;color:#ffc107">Lv' + e.cookInfo.level + '</span>'
      : '';
    elHdr.innerHTML =
      '<span class="stree-chevron">&#9654;</span>' +
      '<span class="stree-icon">' + e.recipe.emoji + '</span>' +
      '<span class="stree-label">' + e.recipe.name + lvLabel + '</span>' +
      '<span class="stree-val">= ' + e.count + '</span>';

    var elBody = document.createElement('div'); elBody.className = 'stree-body';
    makeColl(elHdr, elBody);

    // Detail: reward, level masak, XP
    var chance = Math.min(1, 0.30 + e.cookInfo.level * 0.007);
    var detailRow = document.createElement('div');
    detailRow.className = 'stree-row stree-lv3';
    detailRow.innerHTML =
      '<span style="width:1rem"></span>' +
      '<span class="stree-label" style="color:#aaa;font-size:0.72rem">' +
        '\uD83E\uDE99 ' + e.recipe.reward + '/porsi &nbsp;|&nbsp; ' +
        '\uD83D\uDCC8 Level Masak: ' + e.cookInfo.level + ' &nbsp;|&nbsp; ' +
        '\u2713 Sukses: ' + Math.round(chance * 100) + '%' +
      '</span>';
    elBody.appendChild(detailRow);

    el.appendChild(elHdr); el.appendChild(elBody);
    rootBody.appendChild(el);
  });

  if (entries.length === 0) {
    var emptyRow = document.createElement('div');
    emptyRow.className = 'stree-row stree-lv2';
    emptyRow.innerHTML = '<span class="stree-label" style="color:#888">Belum ada masakan yang dibuat.</span>';
    rootBody.appendChild(emptyRow);
  }

  root.appendChild(rootHdr); root.appendChild(rootBody);
  container.appendChild(root);
}
// ══════════════════════════════════════════════════════
function getCurrentGrowMult() {
  var w = WEATHERS[G.weather] || WEATHERS['cerah'];
  var lv = G.upgrades.growSpeed || 0;
  // Upgrade mengurangi waktu tumbuh: lv1=-15%, lv2=-30%, lv3=-45%
  // Agar tick (-= 0.5 * growMult) menghabiskan timeLeft lebih cepat,
  // kita bagi dengan faktor (1 - lv*0.15) sehingga multiplier > 1
  var upgradeSpeedMult = lv > 0 ? 1 / (1 - lv * 0.15) : 1;
  return w.growMult * upgradeSpeedMult;
}

function rollGradeWithBoost(level) {
  var w = WEATHERS[G.weather] || WEATHERS['cerah'];
  var weatherBonus = w.gradeBonus || 0;
  var boost   = (G.upgrades.gradeBoost || 0) * 0.08 + Math.max(0, weatherBonus);
  var penalty = Math.max(0, -weatherBonus);
  if (boost === 0 && penalty === 0) return rollGrade(level);
  var p = getGradeProbs(level);
  // Upward boost: geser dari C/B ke S/SS
  if (boost > 0) {
    var transfer = Math.min(p.C + p.B, boost);
    var fromC = Math.min(p.C, transfer * 0.6);
    var fromB = Math.min(p.B, transfer * 0.4);
    p.C -= fromC; p.B -= fromB;
    p.SS += (fromC + fromB) * 0.4;
    p.S  += (fromC + fromB) * 0.6;
  }
  // Downward penalty: geser dari SS/S/A ke B/C
  if (penalty > 0) {
    var downT = Math.min(p.SS + p.S + p.A, penalty);
    var dSS = Math.min(p.SS, downT * 0.2);
    var dS  = Math.min(p.S,  downT * 0.4);
    var dA  = Math.min(p.A,  downT * 0.4);
    p.SS -= dSS; p.S -= dS; p.A -= dA;
    p.B  += (dSS + dS + dA) * 0.4;
    p.C  += (dSS + dS + dA) * 0.6;
  }
  var r = Math.random();
  if (r < p.SS)                         return 'SS';
  if (r < p.SS + p.S)                   return 'S';
  if (r < p.SS + p.S + p.A)             return 'A';
  if (r < p.SS + p.S + p.A + p.B)       return 'B';
  return 'C';
}

function tickWeather() {
  var now = Date.now();
  if (now < G.weatherEnd) return; // cuaca masih berlaku
  // Pilih cuaca baru
  var prev = G.weather;
  G.weather = WEATHER_POOL[Math.floor(Math.random() * WEATHER_POOL.length)];
  var dur = (WEATHER_MIN_SEC + Math.random() * (WEATHER_MAX_SEC - WEATHER_MIN_SEC)) * 1000;
  G.weatherEnd = now + dur;
  if (G.weather !== prev) updateWeatherWidget();
}

function updateWeatherWidget() {
  var el = document.getElementById('weatherPill');
  if (!el) return;
  var w = WEATHERS[G.weather] || WEATHERS['cerah'];
  el.textContent = w.emoji + ' ' + w.label;
  el.title = w.desc;
}

// ══════════════════════════════════════════════════════
//  KOLAM IKAN SYSTEM (9 kolam, tiap kolam 1 jenis, maks 9 ikan)
// ══════════════════════════════════════════════════════
function tickPond() {
  if (!G.ponds) return;
  var w = WEATHERS[G.weather] || WEATHERS['cerah'];
  var eggMult = (1 + (G.upgrades.eggBoost || 0) * 0.2) * (w.eggMult || 1);
  for (var i = 0; i < G.ponds.length; i++) {
    var p = G.ponds[i];
    if (!p.fishKey || p.count <= 0) continue;
    // 1 ikan → 1 telur per 1200 detik; per tick (0.5 s) = count/2400
    p.pendingEggs = (p.pendingEggs || 0) + (p.count / 2400) * eggMult;
  }
}

function buildPondLocation() {
  var container = document.getElementById('fishLocContent');
  if (!container) return;
  container.innerHTML = '';

  var activePonds = G.ponds.filter(function(p){ return p.fishKey && p.count > 0; }).length;
  var totalPending = G.ponds.reduce(function(s, p){ return s + (p.pendingEggs || 0); }, 0);
  var totalInv = 0;
  for (var ek in G.eggInventory) totalInv += G.eggInventory[ek] || 0;

  var hdr = document.createElement('div');
  hdr.className = 'fish-slots-header';
  hdr.innerHTML = '🐟 <b>Kolam Ikan</b> — ' + activePonds + '/12 kolam aktif &nbsp;&nbsp; 🥚 Inventory: ' + totalInv + ' telur';
  container.appendChild(hdr);

  var canCollect = Math.floor(totalPending) > 0;
  var topRow = document.createElement('div');
  topRow.className = 'fish-top';
  var collectAllBtn = document.createElement('button');
  collectAllBtn.className = 'fish-btn-collect';
  if (!canCollect) collectAllBtn.disabled = true;
  collectAllBtn.innerHTML = '🥚 Panen Semua (' + Math.floor(totalPending) + ' telur)';
  collectAllBtn.addEventListener('click', function(){ collectAllPondEggs(); });
  topRow.appendChild(collectAllBtn);
  container.appendChild(topRow);

  var grid = document.createElement('div');
  grid.className = 'pond-loc-grid';
  for (var i = 0; i < 12; i++) {
    grid.appendChild(buildPondCard(i));
  }
  container.appendChild(grid);
}

function buildPondCard(idx) {
  var p = G.ponds[idx];
  var card = document.createElement('div');
  var f = p.fishKey ? FISH[p.fishKey] : null;
  var pending = Math.floor(p.pendingEggs || 0);
  card.className = 'pond-card' + (f ? ' pond-card-active' : '');

  var title = document.createElement('div'); title.className = 'pond-card-title'; title.textContent = 'Kolam ' + (idx + 1);
  card.appendChild(title);
  if (f) {
    var perMin = (p.count / 2400 * 120).toFixed(2);
    var fishEl = document.createElement('div'); fishEl.className = 'pond-card-fish'; fishEl.textContent = f.emoji + ' ' + f.name; card.appendChild(fishEl);
    var countEl = document.createElement('div'); countEl.className = 'pond-card-count'; countEl.textContent = p.count + '/9 ikan'; card.appendChild(countEl);
    var eggsEl = document.createElement('div'); eggsEl.className = 'pond-card-eggs'; eggsEl.innerHTML = '🥚 ' + pending + ' &nbsp;<span class="pond-rate">+' + perMin + '/mnt</span>'; card.appendChild(eggsEl);
    var btns = document.createElement('div'); btns.className = 'pond-card-btns';
    var addBtn = document.createElement('button'); addBtn.className = 'pond-cb pond-cb-add'; if (p.count >= 9) addBtn.disabled = true; addBtn.textContent = '+ Ikan'; addBtn.addEventListener('click', function(){ openAddFishToPondModal(idx); }); btns.appendChild(addBtn);
    var remBtn = document.createElement('button'); remBtn.className = 'pond-cb pond-cb-remove'; remBtn.textContent = '− Ikan'; remBtn.addEventListener('click', function(){ removeOneFishFromPond(idx); }); btns.appendChild(remBtn);
    var collectBtn = document.createElement('button'); collectBtn.className = 'pond-cb pond-cb-collect'; if (pending <= 0) collectBtn.disabled = true; collectBtn.textContent = '🥚 Panen'; collectBtn.addEventListener('click', function(){ collectPondEggs(idx); }); btns.appendChild(collectBtn);
    card.appendChild(btns);
  } else {
    var emptyTxt = document.createElement('div'); emptyTxt.className = 'pond-card-empty-txt'; emptyTxt.textContent = 'Kosong'; card.appendChild(emptyTxt);
    var btns = document.createElement('div'); btns.className = 'pond-card-btns';
    var addBtn = document.createElement('button'); addBtn.className = 'pond-cb pond-cb-add'; addBtn.textContent = '+ Ikan'; addBtn.addEventListener('click', function(){ openAddFishToPondModal(idx); }); btns.appendChild(addBtn);
    card.appendChild(btns);
  }
  return card;
}

function openAddFishToPondModal(pondIdx) {
  var p = G.ponds[pondIdx];
  if (!p) return;
  if (p.count >= 9) { notify('Kolam ' + (pondIdx + 1) + ' sudah penuh! (maks. 9 ikan)', true); return; }
  // Kolam sudah ada ikan — langsung tambah tanpa modal
  if (p.fishKey) {
    if ((G.fishInventory[p.fishKey] || 0) <= 0) {
      var f0 = FISH[p.fishKey];
      notify('Tidak punya ' + (f0 ? f0.name : p.fishKey) + ' di inventory!', true);
      return;
    }
    addFishToPond(pondIdx, p.fishKey);
    return;
  }
  // Kolam kosong — tampilkan modal untuk memilih jenis ikan
  var modal = document.getElementById('addFishModal');
  var list  = document.getElementById('addFishList');
  var titleEl = modal ? modal.querySelector('.fish-modal-title') : null;
  if (!modal || !list) return;
  if (titleEl) titleEl.textContent = '🐟 Tambah Ikan ke Kolam ' + (pondIdx + 1);
  list.innerHTML = '';
  modal.dataset.pondIdx = pondIdx;
  var hasAny = false;
  for (var fk in FISH) {
    if ((G.fishInventory[fk] || 0) <= 0) continue;
    hasAny = true;
    var f = FISH[fk];
    var row = document.createElement('div');
    row.className = 'fish-bait-row';
    row.innerHTML = '<span>' + f.emoji + ' ' + f.name + '</span><span class="bait-qty">\xD7' + G.fishInventory[fk] + '</span>';
    row.onclick = (function(key, pidx){ return function(){ addFishToPond(pidx, key); }; })(fk, pondIdx);
    list.appendChild(row);
  }
  if (!hasAny) list.innerHTML = '<div style="padding:10px;color:#aaa">Belum punya ikan di inventory.</div>';
  modal.classList.add('show');
}

function closeAddFishModal() {
  var modal = document.getElementById('addFishModal');
  if (modal) modal.classList.remove('show');
}

function addFishToPond(pondIdx, fishKey) {
  var p = G.ponds[pondIdx];
  if (!p) return;
  if (p.fishKey && p.fishKey !== fishKey) {
    notify('Kolam ini hanya bisa diisi ' + (FISH[p.fishKey] ? FISH[p.fishKey].name : p.fishKey) + '!', true); return;
  }
  if (p.count >= 9) { notify('Kolam sudah penuh! (maks. 9 ikan)', true); return; }
  if ((G.fishInventory[fishKey] || 0) <= 0) { notify('Tidak punya ikan ini!', true); return; }
  G.fishInventory[fishKey]--;
  if (G.fishGrades[fishKey]) {
    var gd = G.fishGrades[fishKey], rem = 1;
    ['C','B','A','S','SS'].forEach(function(g){ var c = Math.min(rem, gd[g]||0); gd[g] -= c; rem -= c; });
  }
  if (!p.fishKey) p.fishKey = fishKey;
  p.count++;
  closeAddFishModal();
  var f = FISH[fishKey];
  notify('🐟 ' + (f ? f.name : fishKey) + ' masuk Kolam ' + (pondIdx + 1) + '! (' + p.count + '/9)');
  addLog('🐟 Kolam ' + (pondIdx + 1) + ': +1 ' + (f ? f.name : fishKey) + ' (' + p.count + '/9)', '');
  checkAllAchievements();
  buildPondLocation();
}

function removeOneFishFromPond(pondIdx) {
  var p = G.ponds[pondIdx];
  if (!p || !p.fishKey || p.count <= 0) return;
  var fishKey = p.fishKey;
  var f = FISH[fishKey];
  G.fishInventory[fishKey] = (G.fishInventory[fishKey] || 0) + 1;
  if (!G.fishGrades[fishKey]) G.fishGrades[fishKey] = {C:0,B:0,A:0,S:0,SS:0};
  G.fishGrades[fishKey].C++;
  p.count--;
  if (p.count === 0) { p.fishKey = null; p.pendingEggs = 0; }
  notify((f ? f.emoji + ' ' + f.name : 'Ikan') + ' dikeluarkan dari Kolam ' + (pondIdx + 1) + '.');
  buildPondLocation();
}

function collectPondEggs(pondIdx) {
  var p = G.ponds[pondIdx];
  if (!p || !p.fishKey) return;
  var eggs = Math.floor(p.pendingEggs || 0);
  if (eggs <= 0) { notify('Belum ada telur di Kolam ' + (pondIdx + 1) + '!', true); return; }
  p.pendingEggs = (p.pendingEggs || 0) - eggs;
  G.eggInventory[p.fishKey] = (G.eggInventory[p.fishKey] || 0) + eggs;
  var f = FISH[p.fishKey];
  notify('🥚 +' + eggs + ' Telur ' + (f ? f.name : '') + ' dari Kolam ' + (pondIdx + 1) + '!');
  addLog('🥚 Panen ' + eggs + ' Telur ' + (f ? f.name : '') + ' (Kolam ' + (pondIdx + 1) + ')', 'pos');
  buildPondLocation();
}

function collectAllPondEggs() {
  var total = 0;
  for (var i = 0; i < G.ponds.length; i++) {
    var p = G.ponds[i];
    if (!p.fishKey) continue;
    var eggs = Math.floor(p.pendingEggs || 0);
    if (eggs > 0) {
      p.pendingEggs -= eggs;
      G.eggInventory[p.fishKey] = (G.eggInventory[p.fishKey] || 0) + eggs;
      total += eggs;
    }
  }
  if (total <= 0) { notify('Belum ada telur yang bisa dipanen!', true); return; }
  notify('🥚 Total ' + total + ' telur dipanen!');
  addLog('🥚 Panen semua telur: +' + total, 'pos');
  buildPondLocation();
}

// ══════════════════════════════════════════════════════
//  AUTO-SLOT SYSTEM
// ══════════════════════════════════════════════════════
var _autoSlotActivating = false;
var _autoSlotIdx = null;

function _countAutoSlots() {
  var c = 0;
  for (var i=0; i<100; i++) if (G.slots[i] && G.slots[i].autoPlant) c++;
  return c;
}

function _updateAutoSlotBtn() {
  var btn = document.getElementById('btnActivateAutoSlot');
  if (!btn) return;
  var available = (G.autoSlotLimit || 0) - _countAutoSlots();
  if (available > 0) {
    btn.style.display = '';
    if (_autoSlotActivating) {
      btn.textContent = '\uD83E\uDD16 Klik petak untuk dijadikan auto...';
      btn.classList.add('btn-auto-activating');
    } else {
      btn.textContent = '\uD83E\uDD16 Aktifkan Slot Auto (' + available + ' tersedia)';
      btn.classList.remove('btn-auto-activating');
    }
  } else {
    btn.style.display = 'none';
    _autoSlotActivating = false;
    btn.classList.remove('btn-auto-activating');
  }
}

function activateAutoSlotMode() {
  if (_countAutoSlots() >= (G.autoSlotLimit || 0)) {
    notify('Tidak ada slot otomatis tersedia!', true); return;
  }
  _autoSlotActivating = !_autoSlotActivating;
  _updateAutoSlotBtn();
  if (_autoSlotActivating) {
    notify('\uD83E\uDD16 Mode aktifkan: klik petak manapun untuk dijadikan slot otomatis.');
  } else {
    notify('Mode aktifkan dibatalkan.');
  }
}

function openAutoSlotModal(slotIdx, isFirstTime) {
  _autoSlotIdx = slotIdx;
  var modal = document.getElementById('autoSlotModal');
  if (!modal) return;
  var titleEl = modal.querySelector('.auto-slot-modal-title');
  var s = G.slots[slotIdx];
  var p = s.autoPlant ? PLANTS[s.autoPlant] : null;
  if (titleEl) {
    if (isFirstTime) {
      titleEl.textContent = '\uD83E\uDD16 Aktifkan Slot Otomatis — Petak ' + (slotIdx + 1);
    } else {
      titleEl.textContent = '\uD83E\uDD16 Slot Otomatis — Petak ' + (slotIdx + 1) + (p ? ': ' + p.name : '');
    }
  }
  var cancelBtn = document.getElementById('autoSlotCancelBtn');
  if (cancelBtn) cancelBtn.style.display = isFirstTime ? 'none' : '';
  buildAutoSlotSeedList();
  modal.classList.add('show');
}

function closeAutoSlotModal() {
  var modal = document.getElementById('autoSlotModal');
  if (modal) modal.classList.remove('show');
  _autoSlotIdx = null;
}

function buildAutoSlotSeedList() {
  var list = document.getElementById('autoSlotSeedList');
  if (!list) return;
  list.innerHTML = '';
  // Group unlocked plants by category
  var groups = {};
  var catOrder = [];
  for (var k in PLANTS) {
    var p = PLANTS[k];
    if (p.unlock > G.level) continue;
    if (!groups[p.cat]) { groups[p.cat] = []; catOrder.push(p.cat); }
    groups[p.cat].push({key:k, plant:p});
  }
  // Remove duplicates in catOrder
  catOrder = catOrder.filter(function(c, idx){ return catOrder.indexOf(c) === idx; });

  var curAutoPlant = _autoSlotIdx !== null ? G.slots[_autoSlotIdx].autoPlant : null;
  var frag = document.createDocumentFragment();
  catOrder.forEach(function(cat) {
    var catHdr = document.createElement('div');
    catHdr.className = 'auto-slot-cat-hdr';
    catHdr.textContent = cat;
    frag.appendChild(catHdr);
    groups[cat].forEach(function(entry) {
      var row = document.createElement('div');
      var canAfford = G.coins >= entry.plant.cost;
      row.className = 'auto-slot-seed-row' + (entry.key === curAutoPlant ? ' selected' : '');
      row.innerHTML =
        '<span class="auto-slot-seed-emoji">' + entry.plant.emoji + '</span>' +
        '<span class="auto-slot-seed-name">' + entry.plant.name + '</span>' +
        '<span class="auto-slot-seed-cost">\uD83E\uDE99' + entry.plant.cost + '</span>';
      row.onclick = (function(key){ return function(){ setAutoSlotSeed(key); }; })(entry.key);
      frag.appendChild(row);
    });
  });
  list.appendChild(frag);
}

function setAutoSlotSeed(plantKey) {
  if (_autoSlotIdx === null) return;
  var s = G.slots[_autoSlotIdx];
  // Abandon current plant (if any) when changing seed
  s.plant = null; s.stage = 0; s.timeLeft = 0; s.stageTime = 0;
  s.autoPlant = plantKey;
  refreshSlot(_autoSlotIdx);
  refreshHUD();
  var p = PLANTS[plantKey];
  notify('\uD83E\uDD16 Petak ' + (_autoSlotIdx+1) + ' otomatis menanam ' + (p ? p.name : plantKey) + '!');
  addLog('\uD83E\uDD16 Slot ' + (_autoSlotIdx+1) + ' otomatis: ' + (p ? p.name : plantKey), 'pos');
  closeAutoSlotModal();
  _updateAutoSlotBtn();
}

function disableAutoSlot() {
  if (_autoSlotIdx === null) return;
  var s = G.slots[_autoSlotIdx];
  var oldPlant = s.autoPlant;
  s.autoPlant = null;
  // Keep current plant as-is (player can harvest manually)
  refreshSlot(_autoSlotIdx);
  refreshHUD();
  var p = oldPlant ? PLANTS[oldPlant] : null;
  notify('\uD83E\uDD16 Slot otomatis petak ' + (_autoSlotIdx+1) + ' dimatikan.');
  addLog('\uD83E\uDD16 Slot ' + (_autoSlotIdx+1) + ' otomatis dimatikan', '');
  closeAutoSlotModal();
  _updateAutoSlotBtn();
}

// ══════════════════════════════════════════════════════
//  ACHIEVEMENT PAGE + KLAIM UPGRADE
// ══════════════════════════════════════════════════════
function claimAchievementReward(id) {
  if (!G.achievements[id] || G.achievements[id] !== 'unclaimed') return;
  var ach = null;
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    if (ACHIEVEMENTS[i].id === id) { ach = ACHIEVEMENTS[i]; break; }
  }
  if (!ach) return;
  G.achievements[id] = 'claimed';
  if (ach.reward) {
    if (ach.reward.key === 'autoSlot') {
      G.autoSlotLimit = (G.autoSlotLimit || 0) + 1;
      // Otomatis tandai slot paling atas-kiri sebagai auto (autoPlant = '' = reserved, bukan null)
      var firstFree = -1;
      for (var _fi = 0; _fi < 100; _fi++) {
        if (G.slots[_fi] && !G.slots[_fi].autoPlant) { firstFree = _fi; break; }
      }
      if (firstFree >= 0) {
        G.slots[firstFree].autoPlant = '__pending__';
        refreshSlot(firstFree);
      }
      notify('\uD83E\uDD16 Slot Otomatis diperoleh! Klik petak ' + (firstFree >= 0 ? firstFree+1 : '') + ' di Kebun untuk memilih bibit.');
      addLog('\uD83E\uDD16 Slot Otomatis +1 \u2014 klik petak ' + (firstFree >= 0 ? firstFree+1 : '') + ' untuk pilih bibit!', 'pos');
    } else {
      G.upgrades[ach.reward.key] = ach.reward.level;
      notify('\uD83C\uDF81 ' + ach.reward.label + ' \u2014 ' + ach.reward.effect + ' diaktifkan!');
      addLog('\uD83D\uDD27 Upgrade diklaim: ' + ach.reward.label, 'pos');
    }
  } else {
    notify('\u2705 Achievement diklaim: ' + ach.name);
    addLog('\uD83C\uDFC6 Diklaim: ' + ach.name, 'pos');
  }
  saveGame();
  updateAchievementBadge();
  _updateAutoSlotBtn();
  buildAchievementsPage();
}

function _buildAchCard(ach, state) {
  var isLocked    = state === 'locked';
  var isUnclaimed = state === 'unclaimed';
  var isClaimed   = state === 'claimed';

  var progressHtml = '';
  if (ach.plantKey && isLocked) {
    var _plog = G.harvestLog ? G.harvestLog[ach.plantKey] : null;
    var _pcnt = _plog ? ((_plog.C||0)+(_plog.B||0)+(_plog.A||0)+(_plog.S||0)+(_plog.SS||0)) : 0;
    var _thresh = ach.threshold || 10000;
    var pct = Math.min(100, Math.floor(_pcnt / _thresh * 100));
    progressHtml = '<div class="ach-progress-wrap"><div class="ach-progress-bar" style="width:' + pct + '%"></div></div><span class="ach-progress-lbl">' + _pcnt.toLocaleString('id') + ' / ' + _thresh.toLocaleString('id') + '</span>';
  }

  var rewardHtml = '';
  if (ach.reward) {
    if (isLocked) {
      rewardHtml = '<div class="ach-reward ach-reward-locked">\uD83D\uDD12 ' + ach.reward.label + '</div>';
    } else {
      rewardHtml = '<div class="ach-reward' + (isClaimed ? ' ach-reward-done' : ' ach-reward-ready') + '">' +
        ach.reward.label + ' \u2014 ' + ach.reward.effect + '</div>';
    }
  }

  var actionHtml = '';
  if (isClaimed) {
    actionHtml = '<div class="ach-status ach-status-done">\u2705 Diklaim</div>';
  } else if (isUnclaimed) {
    actionHtml = '<button class="ach-claim-btn" data-ach-id="' + ach.id + '">\uD83C\uDF81 Klaim!</button>';
  } else {
    actionHtml = '<div class="ach-status ach-status-locked">\uD83D\uDD12</div>';
  }

  return '<div class="ach-card' +
    (isClaimed   ? ' ach-claimed'   :
     isUnclaimed ? ' ach-unclaimed' : ' ach-locked') + '">' +
    '<div class="ach-emoji">' + (isLocked ? '\uD83D\uDD12' : ach.emoji) + '</div>' +
    '<div class="ach-info">' +
      '<div class="ach-name">' + ach.name + '</div>' +
      '<div class="ach-desc">' + ach.desc + '</div>' +
      progressHtml +
      rewardHtml +
    '</div>' +
    '<div class="ach-action">' + actionHtml + '</div>' +
  '</div>';
}

// New: create achievement card as DOM element and attach explicit handlers
function _createAchCardElement(ach, state) {
  var isLocked    = state === 'locked';
  var isUnclaimed = state === 'unclaimed';
  var isClaimed   = state === 'claimed';

  var card = document.createElement('div');
  card.className = 'ach-card' + (isClaimed ? ' ach-claimed' : (isUnclaimed ? ' ach-unclaimed' : ' ach-locked'));

  var emojiEl = document.createElement('div'); emojiEl.className = 'ach-emoji'; emojiEl.textContent = isLocked ? '\uD83D\uDD12' : ach.emoji;
  var infoEl = document.createElement('div'); infoEl.className = 'ach-info';
  var nameEl = document.createElement('div'); nameEl.className = 'ach-name'; nameEl.textContent = ach.name;
  var descEl = document.createElement('div'); descEl.className = 'ach-desc'; descEl.textContent = ach.desc;
  infoEl.appendChild(nameEl); infoEl.appendChild(descEl);

  // progress
  if (ach.plantKey && isLocked) {
    var _plog = G.harvestLog ? G.harvestLog[ach.plantKey] : null;
    var _pcnt = _plog ? ((_plog.C||0)+(_plog.B||0)+(_plog.A||0)+(_plog.S||0)+(_plog.SS||0)) : 0;
    var _thresh = ach.threshold || 10000;
    var pct = Math.min(100, Math.floor(_pcnt / _thresh * 100));
    var wrap = document.createElement('div'); wrap.className = 'ach-progress-wrap';
    var bar = document.createElement('div'); bar.className = 'ach-progress-bar'; bar.style.width = pct + '%';
    wrap.appendChild(bar);
    var lbl = document.createElement('span'); lbl.className = 'ach-progress-lbl'; lbl.textContent = _pcnt.toLocaleString('id') + ' / ' + _thresh.toLocaleString('id');
    infoEl.appendChild(wrap); infoEl.appendChild(lbl);
  }

  // reward
  if (ach.reward) {
    var reward = document.createElement('div');
    reward.className = 'ach-reward' + (isClaimed ? ' ach-reward-done' : (isLocked ? ' ach-reward-locked' : ' ach-reward-ready'));
    reward.textContent = (isLocked ? '\uD83D\uDD12 ' : '') + ach.reward.label + (isLocked ? '' : ' — ' + ach.reward.effect);
    infoEl.appendChild(reward);
  }

  var actionEl = document.createElement('div'); actionEl.className = 'ach-action';
  if (isClaimed) {
    var done = document.createElement('div'); done.className = 'ach-status ach-status-done'; done.textContent = '\u2705 Diklaim'; actionEl.appendChild(done);
  } else if (isUnclaimed) {
    var btn = document.createElement('button'); btn.className = 'ach-claim-btn'; btn.textContent = '\uD83C\uDF81 Klaim!';
    btn.addEventListener('click', function(){ claimAchievementReward(ach.id); });
    actionEl.appendChild(btn);
  } else {
    var locked = document.createElement('div'); locked.className = 'ach-status ach-status-locked'; locked.textContent = '\uD83D\uDD12'; actionEl.appendChild(locked);
  }

  card.appendChild(emojiEl); card.appendChild(infoEl); card.appendChild(actionEl);
  return card;
}

function buildAchievementsPage() {
  var container = document.getElementById('achGrid');
  if (!container) return;
  container.innerHTML = '';

  // Hitung statistik global
  var total = ACHIEVEMENTS.length;
  var claimedCount = 0, unclaimedCount = 0;
  for (var u = 0; u < ACHIEVEMENTS.length; u++) {
    var _st = G.achievements[ACHIEVEMENTS[u].id] || 'locked';
    if (_st === 'claimed')   claimedCount++;
    if (_st === 'unclaimed') unclaimedCount++;
  }

  // ── Banner "Siap Diklaim" di teratas ──
  if (unclaimedCount > 0) {
    var bannerGrid = document.createElement('div');
    bannerGrid.className = 'ach-claim-list';
    for (var u2 = 0; u2 < ACHIEVEMENTS.length; u2++) {
      if ((G.achievements[ACHIEVEMENTS[u2].id] || 'locked') === 'unclaimed') {
        bannerGrid.appendChild(_createAchCardElement(ACHIEVEMENTS[u2], 'unclaimed'));
      }
    }
    container.appendChild(bannerGrid);
  }

  // ── Kelompokkan per sektor ──
  var sectors = {}, sectorOrder = [];
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    var sec = ACHIEVEMENTS[i].sector || 'Lainnya';
    if (!sectors[sec]) { sectors[sec] = []; sectorOrder.push(sec); }
    sectors[sec].push(ACHIEVEMENTS[i]);
  }

  // Warna latar per kategori
  var _catBgMap = {
    'Bunga':'rgba(255,105,180,0.12)', 'Sayuran':'rgba(76,175,80,0.12)',
    'Buah':'rgba(255,152,0,0.12)',    'Biji':'rgba(121,85,72,0.18)',
    'Herbal':'rgba(0,188,212,0.12)'
  };

  // ── Root level ──
  var root = document.createElement('div');
  root.className = 'stree-root';

  var rootHdr = document.createElement('div');
  rootHdr.className = 'stree-row stree-lv1';
  rootHdr.innerHTML =
    '<span class="stree-chevron">&#9654;</span>' +
    '<span class="stree-icon">\uD83C\uDFC6</span>' +
    '<span class="stree-label">Semua Achievement</span>' +
    '<span class="stree-val ach-tree-val">' + claimedCount + ' / ' + total + ' diklaim</span>';
  var rootBody = document.createElement('div');
  rootBody.className = 'stree-body';
  makeColl(rootHdr, rootBody);

  // ── Sektor level ──
  for (var s = 0; s < sectorOrder.length; s++) {
    var secName = sectorOrder[s];
    var achs = sectors[secName];

    // Emoji & label dari nama sektor (misal "🌻 Bunga" → emoji="🌻", label="Bunga")
    var secParts = secName.split(' ');
    var secEmoji = secParts[0];
    var secLabel = secParts.slice(1).join(' ') || secName;

    // Hitung progress sektor
    var secClaimed = 0;
    for (var j = 0; j < achs.length; j++) {
      if ((G.achievements[achs[j].id] || 'locked') === 'claimed') secClaimed++;
    }
    var allDone = secClaimed === achs.length;

    var secEl = document.createElement('div');
    secEl.className = 'stree-node';

    var secHdr = document.createElement('div');
    secHdr.className = 'stree-row stree-lv2';
    secHdr.style.setProperty('--cat-color', _catBgMap[secLabel] || 'rgba(255,255,255,0.05)');
    secHdr.innerHTML =
      '<span class="stree-chevron">&#9654;</span>' +
      '<span class="stree-icon">' + secEmoji + '</span>' +
      '<span class="stree-label">' + secLabel + (allDone ? ' \u2705' : '') + '</span>' +
      '<span class="stree-val ach-tree-val">' + secClaimed + ' / ' + achs.length + '</span>';

    var secBody = document.createElement('div');
    secBody.className = 'stree-body';
    makeColl(secHdr, secBody);

    // Grid kartu achievement (skip unclaimed — sudah ada di banner atas)
    var grid = document.createElement('div');
    grid.className = 'ach-sector-grid ach-tree-grid';
    for (var k = 0; k < achs.length; k++) {
      var ach = achs[k];
      var state = G.achievements[ach.id] || 'locked';
      if (state === 'unclaimed') continue;
      grid.appendChild(_createAchCardElement(ach, state));
    }
    secBody.appendChild(grid);

    secEl.appendChild(secHdr);
    secEl.appendChild(secBody);
    rootBody.appendChild(secEl);
  }

  root.appendChild(rootHdr);
  root.appendChild(rootBody);
  container.appendChild(root);
}

// ══════════════════════════════════════════════════════
//  COOK PAGE (Resep Masakan)
// ══════════════════════════════════════════════════════
function getIngredientCount(ing) {
  if (ing.kind === 'plant') {
    return G.inventory[ing.key] || 0;
  } else if (ing.kind === 'fish_loc') {
    var total = 0;
    for (var fk in FISH) {
      if (FISH[fk].loc === ing.loc) total += G.fishInventory[fk] || 0;
    }
    return total;
  } else if (ing.kind === 'cat') {
    var sum = 0;
    for (var k in PLANTS) {
      if (PLANTS[k].cat === ing.cat) sum += G.inventory[k] || 0;
    }
    return sum;
  }
  return 0;
}

function canCookRecipe(recipe) {
  for (var i = 0; i < recipe.ingredients.length; i++) {
    var ing = recipe.ingredients[i];
    if (getIngredientCount(ing) < ing.qty) return false;
  }
  return true;
}

function deductIngredient(ing) {
  var rem = ing.qty;
  if (ing.kind === 'plant') {
    G.inventory[ing.key] = Math.max(0, (G.inventory[ing.key] || 0) - rem);
    if (G.inventoryGrades[ing.key]) {
      var gd = G.inventoryGrades[ing.key];
      ['C','B','A','S','SS'].forEach(function(g){ var c=Math.min(rem,gd[g]||0); gd[g]-=c; rem-=c; });
    }
  } else if (ing.kind === 'fish_loc') {
    for (var fk in FISH) {
      if (rem <= 0) break;
      if (FISH[fk].loc !== ing.loc) continue;
      var qty = G.fishInventory[fk] || 0;
      if (qty <= 0) continue;
      var take = Math.min(rem, qty);
      G.fishInventory[fk] -= take;
      if (G.fishGrades[fk]) {
        var gf = G.fishGrades[fk], r2 = take;
        ['C','B','A','S','SS'].forEach(function(g){ var c=Math.min(r2,gf[g]||0); gf[g]-=c; r2-=c; });
      }
      rem -= take;
    }
  } else if (ing.kind === 'cat') {
    for (var pk in PLANTS) {
      if (rem <= 0) break;
      if (PLANTS[pk].cat !== ing.cat) continue;
      var pqty = G.inventory[pk] || 0;
      if (pqty <= 0) continue;
      var ptake = Math.min(rem, pqty);
      G.inventory[pk] -= ptake;
      if (G.inventoryGrades[pk]) {
        var gp = G.inventoryGrades[pk], r3 = ptake;
        ['C','B','A','S','SS'].forEach(function(g){ var c=Math.min(r3,gp[g]||0); gp[g]-=c; r3-=c; });
      }
      rem -= ptake;
    }
  }
}

// XP yang dibutuhkan untuk naik dari level lv ke lv+1
function cookXpNeeded(lv) {
  return 10 + lv * 5;
}

// Hitung info level dari total XP
function getCookLevelInfo(recipeKey) {
  var totalXp = G.cookXp[recipeKey] || 0;
  var lv = 0, rem = totalXp;
  while (lv < 100) {
    var need = cookXpNeeded(lv);
    if (rem < need) break;
    rem -= need;
    lv++;
  }
  return { level: lv, xpInLevel: rem, xpNeeded: lv < 100 ? cookXpNeeded(lv) : 1 };
}

function getCookSuccessChance(recipeKey) {
  var lv = getCookLevelInfo(recipeKey).level;
  // Level 0 = 30%, Level 100 = 100%
  return 0.30 + lv * 0.007;
}

function cookRecipe(recipeKey) {
  var recipe = RECIPES[recipeKey];
  if (!recipe) return;
  if (!canCookRecipe(recipe)) { notify('Bahan tidak cukup!', true); return; }

  var lv = getCookLevelInfo(recipeKey).level;
  var chance = getCookSuccessChance(recipeKey);
  var success = (Math.random() < chance);

  // Bahan selalu dikonsumsi (gagal = bahan terbuang)
  for (var i = 0; i < recipe.ingredients.length; i++) deductIngredient(recipe.ingredients[i]);

  if (success) {
    G.cookXp[recipeKey] = (G.cookXp[recipeKey] || 0) + 10;
    var afterInfo = getCookLevelInfo(recipeKey);
    G.coins += recipe.reward;
    G.totalEarned += recipe.reward;
    addXP(recipe.xp);
    G.cookInventory[recipeKey] = (G.cookInventory[recipeKey] || 0) + 1;
    checkAllAchievements();
    refreshHUD();
    notify('\uD83C\uDF73 ' + recipe.emoji + ' ' + recipe.name + ' berhasil! +\uD83E\uDE99' + recipe.reward + ' (Keahlian Lv' + afterInfo.level + ')');
    addLog('\uD83C\uDF73 Masak ' + recipe.name + ' berhasil +\uD83E\uDE99' + recipe.reward + ' +\u2B50' + recipe.xp, 'pos');
  } else {
    // Gagal: tidak ada XP
    refreshHUD();
    notify('\uD83D\uDD25 ' + recipe.emoji + ' ' + recipe.name + ' gagal dimasak! Bahan terbuang.', true);
    addLog('\uD83D\uDD25 Masak ' + recipe.name + ' gagal \u2014 bahan terbuang', 'neg');
  }
  buildCookPage();
}

function buildCookPage() {
  var grid = document.getElementById('cookGrid');
  if (!grid) return;
  var frag = document.createDocumentFragment();
  for (var key in RECIPES) {
    var recipe = RECIPES[key];
    var canCook = canCookRecipe(recipe);
    var cooked = G.cookInventory[key] || 0;
    var lvInfo = getCookLevelInfo(key);
    var cookLv = lvInfo.level;
    var successPct = Math.round(getCookSuccessChance(key) * 100);
    var barPct = cookLv >= 100 ? 100 : Math.floor(lvInfo.xpInLevel / lvInfo.xpNeeded * 100);
    var ingHtml = '';
    for (var i = 0; i < recipe.ingredients.length; i++) {
      var ing = recipe.ingredients[i];
      var have = getIngredientCount(ing);

      // Cek apakah bahan pernah dimiliki sebelumnya
      var everOwned = false;
      if (ing.kind === 'plant') {
        everOwned = !!(G.harvestLog && G.harvestLog[ing.key]);
      } else if (ing.kind === 'fish_loc') {
        for (var fk in G.fishLog) {
          if (FISH[fk] && FISH[fk].loc === ing.loc) { everOwned = true; break; }
        }
      } else if (ing.kind === 'cat') {
        for (var pk in G.harvestLog) {
          if (PLANTS[pk] && PLANTS[pk].cat === ing.cat) { everOwned = true; break; }
        }
      }

      var enough = have >= ing.qty;
      if (!everOwned) {
        // Belum pernah punya — tampilkan siluet ???
        ingHtml += '<div class="cook-ing cook-ing-mystery">❓ ??? \xD7' + ing.qty + '</div>';
      } else {
        var ingName = ing.kind === 'plant' ? (PLANTS[ing.key] ? PLANTS[ing.key].emoji + ' ' + PLANTS[ing.key].name : ing.key)
                    : ing.kind === 'fish_loc' ? ('🐟 Ikan ' + (ing.loc === 'sungai' ? 'Sungai' : ing.loc === 'danau' ? 'Danau' : 'Laut'))
                    : ('🌿 ' + ing.cat);
        ingHtml += '<div class="cook-ing' + (!enough ? ' cook-ing-lack' : '') + '">' + ingName + ' \xD7' + ing.qty + ' <span class="cook-have">(' + have + ' dimiliki)</span></div>';
      }
    }
    var card = document.createElement('div');
    card.className = 'cook-card' + (canCook ? '' : ' cook-disabled');
    card.innerHTML =
      '<div class="cook-emoji">' + recipe.emoji + '</div>' +
      '<div class="cook-info">' +
        '<div class="cook-name">' + recipe.name + '</div>' +
        '<div class="cook-desc">' + recipe.desc + '</div>' +
        '<div class="cook-ingredients">' + ingHtml + '</div>' +
        '<div class="cook-level-bar"><span class="cook-lv-label">Lv ' + cookLv + '/100</span><div class="cook-lv-track"><div class="cook-lv-fill" style="width:' + barPct + '%"></div></div><span class="cook-lv-chance' + (successPct >= 100 ? ' cook-lv-max' : (successPct < 50 ? ' cook-lv-low' : '')) + '">' + successPct + '% sukses</span></div>' +
        '<div class="cook-reward">\uD83E\uDE99 +' + recipe.reward + ' &nbsp; \u2B50 +' + recipe.xp + ' XP' + (cooked > 0 ? ' &nbsp; Dimasak: ' + cooked + '\xD7' : '') + '</div>' +
      '</div>' +
      '<button class="cook-btn"' + (!canCook ? ' disabled' : '') + '>\uD83C\uDF73 Masak</button>';
    if (canCook) {
      applyHoldToRepeat(card.querySelector('.cook-btn'), (function(k){ return function(){ cookRecipe(k); }; })(key));
    }
    frag.appendChild(card);
  }
  grid.innerHTML = '';
  grid.appendChild(frag);
}

// ══════════════════════════════════════════════════════
//  ACHIEVEMENT PAGE
// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
//  MUSIK
// ══════════════════════════════════════════════════════
var _musicOn = true;

function initMusic() {
  var audio = document.getElementById('bgMusic');
  if (!audio) return;
  audio.volume = 0.2;
  var saved = null;
  try { saved = localStorage.getItem('kebunMusic'); } catch(e) {}
  _musicOn = saved !== 'off';

  // Lanjutkan posisi musik dari halaman sebelumnya
  var savedTime = null;
  try { savedTime = sessionStorage.getItem('kebunMusicTime'); } catch(e) {}
  if (savedTime !== null) {
    var restoreTime = parseFloat(savedTime) || 0;
    function doRestoreTime() {
      if (audio.duration) audio.currentTime = restoreTime % audio.duration;
      else audio.currentTime = restoreTime;
    }
    if (audio.readyState >= 1) doRestoreTime();
    else audio.addEventListener('loadedmetadata', doRestoreTime, { once: true });
  }

  // Simpan posisi saat pindah halaman
  function saveMusicTime() {
    try { sessionStorage.setItem('kebunMusicTime', audio.currentTime); } catch(e) {}
  }
  window.addEventListener('pagehide', saveMusicTime);
  window.addEventListener('beforeunload', saveMusicTime);

  _applyMusicState();
  // Mulai putar setelah interaksi pertama (browser policy)
  var startOnce = function() {
    if (_musicOn) audio.play().catch(function(){});
    document.removeEventListener('click', startOnce);
    document.removeEventListener('keydown', startOnce);
  };
  document.addEventListener('click', startOnce);
  document.addEventListener('keydown', startOnce);
}

function toggleMusic() {
  _musicOn = !_musicOn;
  _applyMusicState();
  try { localStorage.setItem('kebunMusic', _musicOn ? 'on' : 'off'); } catch(e) {}
}

function _applyMusicState() {
  var audio = document.getElementById('bgMusic');
  var btn   = document.getElementById('btnMusic');
  if (!audio) return;
  if (_musicOn) {
    audio.play().catch(function(){});
    if (btn) { btn.textContent = '🎵'; btn.classList.remove('music-off'); }
  } else {
    audio.pause();
    if (btn) { btn.textContent = '🔇'; btn.classList.add('music-off'); }
  }
}

// ══════════════════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════════════════
function boot() {
  cacheDOM();
  var offline = loadGame(); // null = tidak ada save (pertama kali)
  if (DOM.shopFilters) { buildShopFilters(); buildShopGrid(); }
  if (DOM.gardenGrid) { buildGrid(); }
  refreshHUD(); addXP(0); addFishXP(0);
  if (DOM.ssbEmoji) setSelectedSeedBox();
  if (DOM.fishSsbEmoji) setSelectedBaitBox();
  if (document.getElementById('joranSsbEmoji')) setSelectedJoranBox();
  if (DOM.invGrid) buildInventoryPage();
  if (document.getElementById('fishLocContent')) buildFishPage(currentFishLoc);
  if (document.getElementById('craftGrid')) buildCraftPage();
  if (document.getElementById('cookGrid')) buildCookPage();
  updateWeatherWidget();
  updateAchievementBadge();
  var initialHash = window.location.hash.replace('#','');
  if (initialHash === 'inv') switchTab('inv');
  if (initialHash === 'stats') switchTab('stats');
  if (initialHash === 'achievements') switchTab('achievements');
  if (initialHash === 'reset') {
    // show reset modal if present
    if (DOM && DOM.resetModal) {
      DOM.resetModal.classList.add('show');
    } else {
      // fallback: open stats page
      switchTab('stats');
    }
  }
  // Initialize weather if none
  if (!G.weatherEnd || G.weatherEnd <= Date.now()) {
    G.weatherEnd = Date.now() + (WEATHER_MIN_SEC + Math.random() * (WEATHER_MAX_SEC - WEATHER_MIN_SEC)) * 1000;
  }
  setInterval(tick, 500);
  initMusic();
  // Auto-save setiap 30 detik + saat tab/browser ditutup
  setInterval(saveGame, 30000);
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) saveGame();
  });
  window.addEventListener('beforeunload', saveGame);
  // Tampilkan info saat boot
  if (offline) {
    addLog('\uD83D\uDCC2 Progress berhasil dimuat!', 'pos');
    if (offline.elapsed > 5) {
      var sec = offline.elapsed;
      var tStr = sec>=3600
        ? Math.floor(sec/3600)+'j '+(Math.floor((sec%3600)/60))+'m'
        : sec>=60 ? Math.floor(sec/60)+'m' : Math.round(sec)+'d';
      if (offline.ready > 0 || offline.autoHarvested > 0) {
        var parts = [];
        if (offline.ready > 0)        parts.push(offline.ready+' tanaman siap panen');
        if (offline.autoHarvested > 0) parts.push(offline.autoHarvested+' panen otomatis');
        addLog('\u23F0 Offline '+tStr+' \u2014 '+parts.join(', ')+'!', 'pos');
        notify('\u23F0 Offline '+tStr+': '+parts.join(', ')+'!');
      } else if (offline.stages > 0) {
        addLog('\u23F0 Offline '+tStr+' \u2014 '+offline.stages+' tahap tumbuh selesai.', 'pos');
        notify('\u23F0 Offline '+tStr+': tanaman terus tumbuh!');
      } else {
        addLog('\u23F0 Offline '+tStr+' \u2014 tanaman masih tumbuh.', '');
      }
    }
  } else {
    addLog('Selamat datang di Kebon Kosong! \uD83C\uDF3F', 'pos');
    addLog('Mulai dari Toko Bibit untuk pilih tanaman \uD83C\uDF31', '');
  }
}
boot();