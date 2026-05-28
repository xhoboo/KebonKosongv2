// ══════════════════════════════════════════════════════
//  GRADE SYSTEM
// ══════════════════════════════════════════════════════

// Grade definitions: label, badge colors, sell price multiplier
var GRADES = {
  SS: { label:'SS', color:'#ff4500', textColor:'#fff', mult:1.50 },
  S:  { label:'S',  color:'#ffd700', textColor:'#111', mult:1.25 },
  A:  { label:'A',  color:'#a8e6a3', textColor:'#111', mult:1.10 },
  B:  { label:'B',  color:'#4caf50', textColor:'#fff', mult:1.00 },
  C:  { label:'C',  color:'#555',    textColor:'#aaa', mult:0.90 }
};

var GRADE_ORDER = ['SS','S','A','B','C'];

// ── Probability table ──────────────────────────────────
// Level 1    : C=70%  B=25%  A=5%   S=0%   SS=0%
// Level 1000 : C=1%   B=10%  A=44%  S=40%  SS=5%
// Linear interpolation between the two endpoints over 999 levels.
function getGradeProbs(level) {
  // bonus: 0 at level 1, 1 at level 1000
  var bonus = Math.max(0, Math.min(level, 1000) - 1) / 999;
  return {
    SS: bonus * 0.05,
    S:  bonus * 0.40,
    A:  0.05 + bonus * 0.39,
    B:  0.25 - bonus * 0.15,
    C:  0.70 - bonus * 0.69
  };
}

// Roll a grade for one harvest at the given player level
function rollGrade(level) {
  var p = getGradeProbs(level);
  var r = Math.random();
  if (r < p.SS)                         return 'SS';
  if (r < p.SS + p.S)                   return 'S';
  if (r < p.SS + p.S + p.A)             return 'A';
  if (r < p.SS + p.S + p.A + p.B)       return 'B';
  return 'C';
}

// Sell price for a single item at a given grade
function gradePrice(baseReward, grade) {
  var g = GRADES[grade];
  return Math.max(1, Math.round(baseReward * (g ? g.mult : 1)));
}

// Total sell value of a plant's inventory given its grade breakdown { C:n, B:n, A:n, S:n, SS:n }
function calcInvValue(baseReward, gradeData) {
  var total = 0;
  for (var i = 0; i < GRADE_ORDER.length; i++) {
    var cnt = gradeData[GRADE_ORDER[i]] || 0;
    if (cnt > 0) total += cnt * gradePrice(baseReward, GRADE_ORDER[i]);
  }
  return total;
}
