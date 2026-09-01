const fs = require('fs');
const css = fs.readFileSync('assets/tailwind.css', 'utf8');
const files = ['index.html', 'm3u8-player.html', 'mp4-player.html', 'hls-player.html', 'dash-player.html', '404.html'];

let miss = 0, checked = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const tokens = new Set();
  // class="..." attributes
  let m;
  const re = /class="([^"]+)"/g;
  while ((m = re.exec(html))) m[1].trim().split(/\s+/).forEach(t => t && tokens.add(t));
  // className = '...' JS assignments
  const re2 = /className = '([^']+)'/g;
  while ((m = re2.exec(html))) m[1].trim().split(/\s+/).forEach(t => t && tokens.add(t));
  for (const t of tokens) {
    checked++;
    // CSS 选择器中特殊字符前有字面反斜杠：sm:grid-cols-2 → sm\:grid-cols-2
    if (t === 'input-group') continue; // 页面内联 <style> 自定义类，非 Tailwind
    const cssForm = '.' + t.replace(/([:.\/#\[\]%,()])/g, '\\$1');
    if (!css.includes(cssForm)) { miss++; console.log('MISS', f, t); }
  }
}
console.log('checked', checked, 'classes, missing', miss);

// JSON-LD validation
let jl = 0;
for (const f of files.slice(0, 5)) {
  const html = fs.readFileSync(f, 'utf8');
  const blocks = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g) || [];
  for (const b of blocks) { jl++; JSON.parse(b.replace(/<\/?script[^>]*>/g, '')); }
}
console.log('JSON-LD blocks parsed OK:', jl);

// residual browser build check
let residual = 0;
for (const f of files) {
  if (fs.readFileSync(f, 'utf8').includes('@tailwindcss/browser')) { residual++; console.log('RESIDUAL', f); }
}
console.log('residual browser-build refs:', residual);
