// Convert inline onclick attributes to addEventListener handlers
// Safer conversion: parse simple function calls like `fnName(arg1, 'str')`
// and call the mapped function instead of evaluating arbitrary code.
// Use event delegation to handle elements with `data-handler` attribute.
// This works for static and dynamically-created elements.
document.addEventListener('click', function(event){
  var el = event.target.closest('[data-handler]');
  if (!el) return;
  var code = el.getAttribute('data-handler');
  if (!code) return;
  // Prevent default if handler returns false
  var simpleCall = code.trim().match(/^([A-Za-z_$][\w$]*)\s*\(([\s\S]*)\)\s*;?$/);
  if (simpleCall) {
    var fnName = simpleCall[1];
    var argsText = simpleCall[2];
    var args = parseArgs(argsText);
    var win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
    var fn = win[fnName];
    if (typeof fn === 'function') {
      try {
        var res = fn.apply(el, args);
        if (res === false) event.preventDefault();
      } catch (err) { console.error('data-handler error:', fnName, err); }
    } else {
      console.warn('data-handler: function not found ->', fnName, 'code:', code);
    }
    return;
  }

  // Fallback: evaluate complex handler with `event` parameter
  try {
    var f = new Function('event', code);
    var r = f.call(el, event);
    if (r === false) event.preventDefault();
  } catch (err) {
    console.error('data-handler fallback failed:', code, err);
  }

  function parseArgs(text) {
    var args = [];
    var cur = '';
    var inS = false, inD = false, esc = false, depth = 0;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (esc) { cur += ch; esc = false; continue; }
      if (ch === '\\') { esc = true; cur += ch; continue; }
      if (ch === "'") { if (!inD) inS = !inS; cur += ch; continue; }
      if (ch === '"') { if (!inS) inD = !inD; cur += ch; continue; }
      if (!inS && !inD) {
        if (ch === '(' || ch === '[' || ch === '{') { depth++; cur += ch; continue; }
        if (ch === ')' || ch === ']' || ch === '}') { depth--; cur += ch; continue; }
        if (ch === ',' && depth === 0) { args.push(cur.trim()); cur = ''; continue; }
      }
      cur += ch;
    }
    if (cur.trim() !== '') args.push(cur.trim());

    return args.map(function(a){
      if (!a) return undefined;
      // string literal
      if ((a[0] === '"' && a[a.length-1] === '"') || (a[0] === "'" && a[a.length-1] === "'")) {
        try { return a.slice(1,-1).replace(/\\"/g,'"').replace(/\\'/g,"'"); } catch(e) { return a.slice(1,-1); }
      }
      // number
      if (/^-?\d+(?:\.\d+)?$/.test(a)) return parseFloat(a);
      // boolean
      if (/^true$/i.test(a)) return true;
      if (/^false$/i.test(a)) return false;
      // null/undefined
      if (/^null$/i.test(a)) return null;
      if (/^undefined$/i.test(a)) return undefined;
      // try resolve global variable/function name
      try {
        var win = window;
        if (win && typeof win[a] !== 'undefined') return win[a];
      } catch (e) {}
      // fallback: return raw string
      return a;
    });
  }
});
