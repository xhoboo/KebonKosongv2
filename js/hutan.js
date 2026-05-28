(function(){
  const meterEl = document.getElementById('meter');
  const recordEl = document.getElementById('record');
  const jalanBtn = document.getElementById('jalanBtn');
  const hpText = document.getElementById('hpText');
  const hpFill = document.getElementById('hpFill');
  const journal = document.getElementById('journal');
  const SAVE_KEY = 'kebunGame_v5';
  let meters = 0;
  let recordMeter = 0;
  let hp = 100;
  const maxHp = 100;
  const regenIntervalMs = 15 * 60 * 1000;
  let lastHpRegen = Date.now();
  let regenTimer = null;
  const savedState = loadSaveData();
  if (savedState && typeof savedState.hp === 'number') {
    hp = Math.max(0, Math.min(maxHp, savedState.hp));
  }
  if (savedState && typeof savedState.lastHpRegen === 'number') {
    lastHpRegen = savedState.lastHpRegen;
  } else if (savedState && typeof savedState.savedAt === 'number') {
    lastHpRegen = savedState.savedAt;
  }
  if (savedState && typeof savedState.recordMeter === 'number') {
    recordMeter = savedState.recordMeter;
  }
  recordEl.textContent = recordMeter;

  // Default pools (dipakai jika `js/hutan_pools.js` tidak menyediakan pool sendiri).
  const defaultEnemies = [
    {name: 'Rusa Galak', quip: 'ternyata cuma kesal karena kehilangan selfie stick.'},
    {name: 'Babi Hutan Berambut', quip: 'ia menatapmu dengan ekspresi meminjam gula.'},
    {name: 'Kepiting Liar', quip: 'meminta kompensasi atas tanah yang diinjaknya.'},
    {name: 'Naga Kecil', quip: 'sangat kecil. Seperti naga, tapi minta izin dulu.'},
    {name: 'Kancil Hipster', quip: 'menghakimi pilihan sepatu kamu.'}
  ];

  const defaultLoots = [
    {key: 'jamur_ajaib', name: 'Jamur Ajaib', desc: 'rasanya seperti kue lapis nostalgia.'},
    {key: 'koin_tua', name: 'Koin Tua', desc: 'mungkin dari zaman ketika warkop masih buka 24 jam.'},
    {key: 'peta_misterius', name: 'Peta Misterius', desc: 'dengan tulisan "sesat di sini".'},
    {key: 'roti_basah', name: 'Sepotong Roti Basah', desc: 'tetapi tetap bergengsi.'}
  ];

  const defaultEmpties = [
    'Hanya angin yang sedang berlatih monolog stand-up.',
    'Daun berguguran seperti undangan reuni yang tidak pernah datang.',
    'Kamu berdiri, dan momen itu menatap balik.'
  ];

  // Jika ada file eksternal `js/hutan_pools.js` yang menetapkan `window.hutanPools`,
  // gunakan pool tersebut. Jika tidak, gunakan default.
  const hutanPools = (typeof window !== 'undefined' && window.hutanPools) ? window.hutanPools : {};
  const enemies = Array.isArray(hutanPools.enemies) && hutanPools.enemies.length ? hutanPools.enemies : defaultEnemies;
  const loots = Array.isArray(hutanPools.loots) && hutanPools.loots.length ? hutanPools.loots : defaultLoots;
  const empties = Array.isArray(hutanPools.empties) && hutanPools.empties.length ? hutanPools.empties : defaultEmpties;

  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  // Hitungan kerusakan encounter berbasis meter (tidak bergantung narasi).
  // Meter 0-4 => 1 HP, 5-9 => 2 HP, 10-14 => 3 HP, dst. (naik tiap 5 meter)
  function computeEncounterDamage(meters){
    return 1 + Math.floor(meters / 5);
  }

  function applyOfflineRegen(){
    if (hp >= maxHp) return;
    const now = Date.now();
    const ticks = Math.floor((now - lastHpRegen) / regenIntervalMs);
    if (ticks > 0) {
      hp = Math.min(maxHp, hp + ticks);
      lastHpRegen += ticks * regenIntervalMs;
    }
  }
  function chance(p){ return Math.random() < p; }

  function loadSaveData(){
    var raw;
    try { raw = localStorage.getItem(SAVE_KEY); } catch(e) { return {}; }
    if (!raw) return {};
    try { return JSON.parse(raw) || {}; } catch(e) { return {}; }
  }

  function saveSaveData(data){
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch(e) {}
  }

  function saveHpToSave(){
    var save = loadSaveData();
    if (!save || typeof save !== 'object') save = {};
    save.hp = hp;
    save.lastHpRegen = lastHpRegen;
    save.recordMeter = recordMeter;
    save.lootInventory = save.lootInventory && typeof save.lootInventory==='object' ? save.lootInventory : {};
    save.savedAt = Date.now();
    saveSaveData(save);
  }

  function writeLootToSave(key, qty){
    var save = loadSaveData();
    if (!save || typeof save !== 'object') save = {};
    save.lootInventory = save.lootInventory && typeof save.lootInventory==='object' ? save.lootInventory : {};
    save.lootInventory[key] = (save.lootInventory[key] || 0) + qty;
    save.hp = hp;
    save.lastHpRegen = lastHpRegen;
    save.savedAt = Date.now();
    saveSaveData(save);
  }

  function writeBaitToSave(rarity, qty){
    var save = loadSaveData();
    if (!save || typeof save !== 'object') save = {};
    save.baitInventory = save.baitInventory && typeof save.baitInventory==='object' ? save.baitInventory : {};
    save.baitInventory[rarity] = (save.baitInventory[rarity] || 0) + qty;
    save.hp = hp;
    save.lastHpRegen = lastHpRegen;
    save.savedAt = Date.now();
    saveSaveData(save);
  }

  // Rentang meter dimana setiap rarity umpan bisa didapat.
  // Beberapa rarity overlap supaya makin jauh, makin banyak pilihan.
  const BAIT_DROP_RANGES = [
    { rarity: 'common',    label: 'Common',    min: 10,   max: 500   },
    { rarity: 'uncommon',  label: 'Uncommon',  min: 100,  max: 1000  },
    { rarity: 'rare',      label: 'Rare',      min: 250,  max: 1800  },
    { rarity: 'veryrare',  label: 'Very Rare', min: 500,  max: 3000  },
    { rarity: 'epic',      label: 'Epic',      min: 1000, max: 5000  },
    { rarity: 'legendary', label: 'Legendary', min: 2000, max: 8000  },
    { rarity: 'mythical',  label: 'Mythical',  min: 4000, max: Infinity }
  ];

  function pickBaitForMeter(meters){
    var pool = BAIT_DROP_RANGES.filter(function(r){ return meters >= r.min && meters <= r.max; });
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function startRegenTimer(){
    if (regenTimer || hp >= maxHp) return;
    regenTimer = setInterval(checkHpRegen, 60000);
  }

  function stopRegenTimer(){
    if (regenTimer !== null){
      clearInterval(regenTimer);
      regenTimer = null;
    }
  }

  function checkHpRegen(){
    if (hp >= maxHp) {
      stopRegenTimer();
      return;
    }
    const now = Date.now();
    const ticks = Math.floor((now - lastHpRegen) / regenIntervalMs);
    if (ticks <= 0) return;
    hp = Math.min(maxHp, hp + ticks);
    lastHpRegen += ticks * regenIntervalMs;
    updateHp();
  }

  function updateHp(){
    hp = Math.max(0, hp);
    hpText.textContent = `${hp} / ${maxHp}`;
    hpFill.style.width = `${(hp / maxHp) * 100}%`;
    if(hp <= 35){
      hpFill.style.background = 'linear-gradient(90deg,#ff5f64,#ff8a5c)';
    } else {
      hpFill.style.background = 'linear-gradient(90deg,#72efdb,#38bdf8)';
    }
    jalanBtn.disabled = hp <= 0;
    saveHpToSave();
    if (hp < maxHp) startRegenTimer(); else stopRegenTimer();
  }

  function appendEntry(html){
    const div = document.createElement('div');
    div.className = 'hutan-entry';
    div.innerHTML = html;
    journal.insertBefore(div, journal.firstChild);
    journal.scrollTop = 0;
  }

  function encounter(){
    // decide type: enemy 55%, loot 20%, bait 15%, empty 10%
    const r = Math.random();
    if(r < 0.55){ // enemy
      const e = rand(enemies);
      const damage = computeEncounterDamage(meters);
      const lines = [];
      lines.push(`<span class="meter">[${meters}m]</span> Kamu bertemu <strong>${e.name}</strong> — ${e.quip}`);
      lines.push(`<div class="small">Pertarungan singkat: kamu kehilangan ${damage} HP.</div>`);
      hp -= damage;
      appendEntry(lines.join(''));
      updateHp();
      if(hp <= 0){
        jalanBtn.disabled = true;
        appendEntry(`<span class="meter">[${meters}m]</span> Kamu terkapar — hutan terlalu liar untuk dilanjutkan. Kembali ke rumah untuk pulih.`);
        window.location.href = 'index.html';
        return;
      }
    } else if(r < 0.75){ // loot
      const meterLoots = loots.filter(function(l){ return meters >= (l.minMeter||0) && meters <= (l.maxMeter===undefined?Infinity:l.maxMeter); });
      const l = rand(meterLoots.length ? meterLoots : loots);
      const baseLootQty = Math.floor(meters / 30) + 1;
      const qty = baseLootQty + Math.floor(Math.random() * 2);
      appendEntry(`<span class="meter">[${meters}m]</span> Kamu menemukan <strong>${qty}× ${l.name}</strong> — <span class="small">${l.desc}</span>`);
      writeLootToSave(l.key, qty);
    } else if(r < 0.90){ // bait
      const bait = pickBaitForMeter(meters);
      if (bait) {
        const qty = 1 + Math.floor(Math.random() * 2); // 1-2 umpan
        appendEntry(`<span class="meter">[${meters}m]</span> 🪱 Kamu menemukan <strong>${qty}× Umpan ${bait.label}</strong> tersangkut di akar pohon.`);
        writeBaitToSave(bait.rarity, qty);
      } else {
        // Belum cukup dalam untuk menemukan umpan apapun
        appendEntry(`<span class="meter">[${meters}m]</span> ${rand(empties)}`);
      }
    } else { // empty
      appendEntry(`<span class="meter">[${meters}m]</span> ${rand(empties)}`);
    }
  }

  function walkStep(){
    jalanBtn.disabled = true;
    // simulate small delay for walking animation
    setTimeout(()=>{
      meters += 1;
      meterEl.textContent = meters;
      
      // Update record if current meter exceeds record
      if (meters > recordMeter) {
        recordMeter = meters;
        recordEl.textContent = recordMeter;
        saveHpToSave();
        appendEntry(`<span class="meter">[${meters}m]</span> 🏆 <strong>Rekor Baru!</strong> Kamu mencapai jarak terjauh sejauh ${recordMeter} meter!`);
      }
      
      encounter();
      // tiny flavor entry for stepping
      if(chance(0.12)){
        appendEntry(`<span class="meter">[${meters}m]</span> Kamu bernyanyi lagu hutan yang entah rasanya seperti rindu.`);
      }
      jalanBtn.disabled = false;
    }, 220);
  }

  jalanBtn.addEventListener('click', walkStep);

  // ── Musik ──────────────────────────────────────────────────────
  (function(){
    var audio = document.getElementById('bgMusic');
    if (!audio) return;
    audio.volume = 0.2;
    var saved = null;
    try { saved = localStorage.getItem('kebunMusic'); } catch(e) {}
    var musicOn = saved !== 'off';

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

    function saveMusicTime() {
      try { sessionStorage.setItem('kebunMusicTime', audio.currentTime); } catch(e) {}
    }
    window.addEventListener('pagehide', saveMusicTime);
    window.addEventListener('beforeunload', saveMusicTime);

    if (musicOn) {
      var startOnce = function() {
        audio.play().catch(function(){});
        document.removeEventListener('click', startOnce);
        document.removeEventListener('keydown', startOnce);
      };
      document.addEventListener('click', startOnce);
      document.addEventListener('keydown', startOnce);
    }
  })();

  // initial state
  applyOfflineRegen();
  updateHp();
  if (meters === 0 && hp === 0) {
    appendEntry('<span class="meter">[0m]</span> HP kamu habis, jadi kamu tidak bisa jalan. Pulang dulu untuk pulih.');
  } else {
    appendEntry('<span class="meter">[0m]</span> Kamu memulai perjalanan: sepatu nyaman, hati waspada. Selamat menikmati olok-olok hutan.');
  }
})();
