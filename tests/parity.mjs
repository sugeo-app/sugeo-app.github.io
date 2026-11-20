// 구조 분리 전(tests/fixtures/index.before.html)과 후(data + src)가 똑같이 답하는지 비교
import { readFileSync, readdirSync } from 'node:fs';
import { loadEngine } from '../scripts/lib.mjs';

const before = readFileSync(new URL('./fixtures/index.before.html', import.meta.url), 'utf8');
const oldSrc = before.match(/<script>([\s\S]*?)<\/script>/)[1].split('/* ================================================================ */')[0];
const A = loadEngine(oldSrc), B = loadEngine();

const qs = new Set();
const dir = new URL('./cases/', import.meta.url);
for (const f of readdirSync(dir)) JSON.parse(readFileSync(new URL(f, dir), 'utf8')).forEach(([q]) => qs.add(q));
const nCases = qs.size;
A.DB.forEach(d => { qs.add(d.item); d.n.forEach(x => { qs.add(x); qs.add('다 쓴 ' + x); qs.add(x + ' 어디에 버려'); qs.add(x.slice(0, -1)); }); });
Object.values(A.AMBIG).flat().forEach(x => qs.add(x));
['', ' ', 'ㅋㅋㅋ', 'asdf', '사탄', '사람', '!!!', '🍕', 'a'.repeat(80)].forEach(x => qs.add(x));

let same = 0; const diff = [];
for (const q of qs) {
  const a = JSON.stringify([A.miniAI(q), A.suggest(q)]), b = JSON.stringify([B.miniAI(q), B.suggest(q)]);
  if (a === b) same++; else diff.push(q);
}
console.log(`비교한 질문 ${qs.size}개 (시험 문제 ${nCases}개 + 모든 별칭·변형·되묻기 선택지·이상한 입력)`);
console.log(`분리 전과 똑같은 답: ${same}/${qs.size}`);
if (diff.length) { console.log('다른 답:', diff.slice(0, 20)); process.exit(1); }
