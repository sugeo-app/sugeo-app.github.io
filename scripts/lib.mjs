// 빌드와 테스트가 함께 쓰는 부분: 데이터 + 판단 엔진을 하나의 자바스크립트로 묶기
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

export function loadItems() {
  const items = JSON.parse(read('data/items.json'));
  // 영어 번역(data/en.json)을 한국어 이름으로 찾아 붙이기
  const en = JSON.parse(read('data/en.json'));
  const names = new Set(items.map(x => x.name));
  for (const k of Object.keys(en)) if (!names.has(k)) throw new Error(`data/en.json: '${k}' 품목이 data/items.json에 없어`);
  for (const x of items) {
    const e = en[x.name]; if (!e) continue;
    if (!e.name || !Array.isArray(e.aliases) || !Array.isArray(e.parts) || e.parts.length !== x.parts.length)
      throw new Error(`data/en.json '${x.name}': name/aliases가 없거나 parts 개수(${e.parts && e.parts.length})가 한국어(${x.parts.length})랑 달라`);
    x.en = e;
  }
  for (const [i, x] of items.entries()) {
    if (!x.name || !Array.isArray(x.aliases) || !x.aliases.length || !Array.isArray(x.parts) || !x.parts.length)
      throw new Error(`data/items.json ${i}번째 품목 형식이 잘못됐어: ${JSON.stringify(x).slice(0, 80)}`);
    for (const p of x.parts) if (!p.bin || !Array.isArray(p.steps)) throw new Error(`${x.name}: parts 형식 오류`);
  }
  return items;
}

// 화면 코드가 쓰는 내부 모양(n, item, parts, tip)으로 바꿔서 DB로 넣어
export function engineSource(items = loadItems()) {
  const db = `const DB=${JSON.stringify(items)}.map(x=>({n:x.en?x.aliases.concat(x.en.aliases,[x.en.name]):x.aliases,item:x.name,parts:x.parts,tip:x.tip||"",en:x.en}));\n`;
  return db + read('src/engine.js');
}

// 테스트용: 브라우저 없이 엔진만 실행
export function loadEngine(source = engineSource()) {
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(source + '\n;this.api={miniAI,suggest,rank,norm,DB,AMBIG};', ctx);
  return ctx.api;
}
