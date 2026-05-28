// Explicit handler registrations for static elements.
// This file replaces dynamic `data-handler` parsing: prefer explicit listeners.
(function(){
  function safeCall(fnOrName, args){
    try {
      var fn = (typeof fnOrName === 'function') ? fnOrName : (window[fnOrName] || null);
      if (typeof fn === 'function') return fn.apply(null, args || []);
      console.warn('init-handlers: function not found', fnOrName);
    } catch (e) { console.error('init-handlers call error', fnOrName, e); }
  }

  function on(idOrEl, event, handler){
    var el = (typeof idOrEl === 'string') ? document.getElementById(idOrEl) : idOrEl;
    if (!el) return;
    el.addEventListener(event, handler);
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Header
    on('btnAchHud','click', function(){
      try {
        if (typeof switchTab === 'function' && document.getElementById('page-achievements')) { switchTab('achievements'); return; }
      } catch (e) {}
      window.location.href = 'kebun.html#achievements';
    });
    on('tab-stats','click', function(){
      if (typeof switchTab === 'function') { try { switchTab('stats'); return; } catch(e){} }
      window.location.href = 'kebun.html#stats';
    });
    on('btnMusic','click', function(){ safeCall('toggleMusic'); });
    on('btnResetHud','click', function(){
      // Prefer in-game modal; if not available on this page, use native confirm fallback.
      if (typeof confirmReset === 'function') {
        try { confirmReset(); return; } catch (e) { /* fallback below */ }
      }
      if (confirm('⚠️ Reset Game? Semua progress akan dihapus permanen. Lanjutkan?')) {
        try { if (typeof doReset === 'function') doReset(); } catch (e) { console.error('reset failed', e); }
      }
    });

    // Kebun page: main tabs
    on('tab-garden','click', function(){ safeCall(function(){ switchTab && switchTab('garden'); }); });
    on('tab-fishing','click', function(){ safeCall(function(){ switchTab && switchTab('fishing'); }); });
    on('tab-craft','click', function(){ safeCall(function(){ switchTab && switchTab('craft'); }); });
    on('tab-inv','click', function(){
      try {
        if (document.getElementById('page-inv')) { safeCall(function(){ switchTab && switchTab('inv'); }); return; }
      } catch(e){}
      window.location.href = 'inventory.html';
    });
    on('tab-cook','click', function(){ safeCall(function(){ switchTab && switchTab('cook'); }); });

    // Selected seed box -> shop
    on('selectedSeedBox','click', function(){ safeCall(function(){ switchTab && switchTab('shop'); }); });

    // Plant / harvest / auto-slot
    on('btnPlantAll','click', function(){ safeCall('plantAll'); });
    on('btnHarvestAll','click', function(){ safeCall('harvestAll'); });
    on('btnActivateAutoSlot','click', function(){ safeCall('activateAutoSlotMode'); });

    // Inventory tabs
    on('invTabHarvest','click', function(){ safeCall(function(){ switchInvTab && switchInvTab('harvest'); }); });
    on('invTabFish','click', function(){ safeCall(function(){ switchInvTab && switchInvTab('fish'); }); });
    on('invTabEgg','click', function(){ safeCall(function(){ switchInvTab && switchInvTab('egg'); }); });
    on('invTabLoot','click', function(){ safeCall(function(){ switchInvTab && switchInvTab('loot'); }); });

    // Inventory sell-all buttons
    on('invSellAllBtn','click', function(){ safeCall('sellAll'); });
    on('fishSellAllBtn','click', function(){ safeCall('sellAllFish'); });
    on('eggSellAllBtn','click', function(){ safeCall('sellAllEggs'); });
    on('lootSellAllBtn','click', function(){ safeCall('sellAllLoot'); });

    // Bait selector
    on('selectedBaitBox','click', function(){ safeCall('openBaitSelector'); });

    // Joran selector
    on('selectedJoranBox','click', function(){ safeCall('openJoranSelector'); });
    on('joranChooserCancelBtn','click', function(){ safeCall('closeJoranSelector'); });

    // Fish location tabs
    on('fishTab-sungai','click', function(){ safeCall(function(){ switchFishLoc && switchFishLoc('sungai'); }); });
    on('fishTab-danau','click', function(){ safeCall(function(){ switchFishLoc && switchFishLoc('danau'); }); });
    on('fishTab-laut','click', function(){ safeCall(function(){ switchFishLoc && switchFishLoc('laut'); }); });
    on('fishTab-kolam','click', function(){ safeCall(function(){ switchFishLoc && switchFishLoc('kolam'); }); });

    // Modals: cancel/confirm buttons
    on('addFishCancelBtn','click', function(){ safeCall('closeAddFishModal'); });
    on('autoSlotCancelBtn','click', function(){ safeCall('closeAutoSlotModal'); });
    on('baitChooserCancelBtn','click', function(){ safeCall('closeBaitChooser'); });

    on('resetConfirmBtn','click', function(){ safeCall('doReset'); });
    on('resetCancelBtn','click', function(){ safeCall('closeModal'); });

    on('buySlotConfirmBtn','click', function(){ safeCall('confirmBuySlotFromModal'); });
    on('buySlotCancelBtn','click', function(){ safeCall('closeBuySlotModal'); });

    // Sell modal adjustments
    on('sellQtyMinus10Btn','click', function(){ safeCall(function(){ sellModalAdj && sellModalAdj(-10); }); });
    on('sellQtyMinus1Btn','click', function(){ safeCall(function(){ sellModalAdj && sellModalAdj(-1); }); });
    on('sellQtyPlus1Btn','click', function(){ safeCall(function(){ sellModalAdj && sellModalAdj(1); }); });
    on('sellQtyPlus10Btn','click', function(){ safeCall(function(){ sellModalAdj && sellModalAdj(10); }); });
    on('sellConfirmBtn','click', function(){ safeCall('confirmSellModal'); });
    on('sellConfirmAllBtn','click', function(){ safeCall('sellModalAll'); });
    on('sellCancelBtn','click', function(){ safeCall('closeSellModal'); });

    // Inventory filter selects (formerly inline onchange)
    on('invFilterCat','change',        function(){ safeCall('applyInvFilter'); });
    on('invFilterRarity','change',     function(){ safeCall('applyInvFilter'); });
    on('invFilterGrade','change',      function(){ safeCall('applyInvFilter'); });
    on('invFilterFishLoc','change',    function(){ safeCall('applyFishInvFilter'); });
    on('invFilterFishRarity','change', function(){ safeCall('applyFishInvFilter'); });
    on('invFilterFishGrade','change',  function(){ safeCall('applyFishInvFilter'); });
  });
})();
