// 빌드와 테스트가 함께 쓰는 부분: 데이터 + 판단 엔진을 하나의 자바스크립트로 묶기
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

export function loadItems() {
  const items = JSON.parse(read('data/items.json'));
  for (const [i, x] of items.entries()) {
    if (!x.name || !Array.isArray(x.aliases) || !x.aliases.length || !Array.isArray(x.parts) || !x.parts.length)
      throw new Error(`data/items.json ${i}번째 품목 형식이 잘못됐어: ${JSON.stringify(x).slice(0, 80)}`);
    for (const p of x.parts) if (!p.bin || !Array.isArray(p.steps)) throw new Error(`${x.name}: parts 형식 오류`);
  }
  return items;
}

// 화면 코드가 쓰는 내부 모양(n, item, parts, tip)으로 바꿔서 DB로 넣어
export function engineSource(items = loadItems()) {
  const db = `const DB=${JSON.stringify(items)}.map(x=>({n:x.aliases,item:x.name,parts:x.parts,tip:x.tip||""}));\n`;
  return db + read('src/engine.js');
}

// 테스트용: 브라우저 없이 엔진만 실행
export function loadEngine(source = engineSource()) {
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(source + '\n;this.api={miniAI,suggest,rank,norm,DB,AMBIG};', ctx);
  return ctx.api;
}
