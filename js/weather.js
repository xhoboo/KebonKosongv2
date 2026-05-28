// ══════════════════════════════════════════════════════
//  SISTEM CUACA
// ══════════════════════════════════════════════════════

var WEATHERS = {
  cerah:   { emoji:'☀️',  label:'Cerah',   desc:'Cerah! Panen lebih berkualitas (+grade), kolam bertelur 30% lebih cepat.',                                          growMult:1.0,  fishMult:1.0,  eggMult:1.3, gradeBonus: 0.08 },
  berawan: { emoji:'⛅',  label:'Berawan', desc:'Berawan. Tanaman tumbuh 15% lebih lambat, grade panen menurun, ikan & kolam sedikit terhambat.',               growMult:0.85, fishMult:0.85, eggMult:0.9, gradeBonus:-0.06 },
  hujan:   { emoji:'🌧️', label:'Hujan',   desc:'Hujan deras! Tanaman tumbuh 1.5× lebih cepat, grade panen meningkat, ikan mudah dipancing, kolam +50%.',       growMult:1.5,  fishMult:1.3,  eggMult:1.5, gradeBonus: 0.06 },
  badai:   { emoji:'⛈️', label:'Badai',   desc:'Badai! Tanaman sangat lambat, grade panen anjlok, ikan sulit dipancing, kolam hampir berhenti bertelur.',       growMult:0.7,  fishMult:0.5,  eggMult:0.2, gradeBonus:-0.15 },
};

// Pool cuaca: lebih banyak cerah agar tidak terlalu ekstrem
var WEATHER_POOL = ['cerah','cerah','cerah','berawan','berawan','hujan','hujan','badai'];

// Durasi cuaca dalam detik
var WEATHER_MIN_SEC = 180; // 3 menit
var WEATHER_MAX_SEC = 480; // 8 menit
