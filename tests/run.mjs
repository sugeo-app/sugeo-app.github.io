// npm test → 665문제 시험. 하나라도 틀리면 실패(종료 코드 1)
// 정답 표기: 수거함 이름("a+b"는 둘 다 나와야 함) | "!" 쓰레기 아님 | "?" 모른다고 해야 함 | "~" 되물어야 함
import { readdirSync, readFileSync } from 'node:fs';
import { loadEngine } from '../scripts/lib.mjs';

const { miniAI } = loadEngine();
const dir = new URL('./cases/', import.meta.url);
let total = 0, pass = 0;
for (const f of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
  const T = JSON.parse(readFileSync(new URL(f, dir), 'utf8'));
  let ok = 0; const fails = [];
  for (const [q, exp] of T) {
    const r = miniAI(q); let good, got;
    if (!r) { got = '(모름)'; good = exp === '?'; }
    else if (r.ambig) { got = '[되묻기]'; good = exp === '~'; }
    else if (r.notTrash) { got = '[쓰레기 아님]'; good = exp === '!' || exp === '?'; }
    else if (r.egg) { got = '[이스터에그]'; good = false; }
    else {
      const bins = new Set(r.parts.map(p => p.bin)); got = `${r.item} [${r.conf}] ${[...bins].join('+')}`;
      good = exp === '?' ? r.conf === 'guess' : exp !== '!' && exp !== '~' && exp.split('+').every(b => bins.has(b)) && r.conf !== 'guess';
    }
    if (good) ok++; else fails.push(`  ✗ ${q}  기대: ${exp}  결과: ${got}`);
  }
  console.log(`${f.padEnd(18)} ${ok}/${T.length}`); fails.forEach(x => console.log(x));
  total += T.length; pass += ok;
}
console.log(`\n합계 ${pass}/${total}`);
if (pass !== total) process.exit(1);
