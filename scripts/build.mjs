// npm run build → docs/ 폴더에 배포용 사이트를 만들어 (GitHub Pages가 docs/를 보여줘)
import { mkdirSync, writeFileSync, cpSync, rmSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { read, engineSource } from './lib.mjs';

const OUT = new URL('../docs/', import.meta.url);
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const script = engineSource() + '\n' + read('src/app.js');
const html = read('src/index.template.html')
  .replace('{{STYLE}}', () => read('src/styles.css'))
  .replace('{{SCRIPT}}', () => script);
if (html.includes('{{')) throw new Error('템플릿에 안 채워진 칸이 있어');
writeFileSync(new URL('index.html', OUT), html);
cpSync(new URL('../static/', import.meta.url), OUT, { recursive: true });
writeFileSync(new URL('.nojekyll', OUT), '');

// 서비스워커: 사이트 파일 전체의 지문(해시)을 버전으로 써서, 내용이 바뀌면 캐시도 자동으로 새로 받게 해
const files = [];
const walk = (dir, pre = '') => readdirSync(dir).forEach(f => {
  const p = new URL(f, dir); if (f.startsWith('.') || f === 'og.png' || f === '404.html' || f.endsWith('.txt')) return;
  statSync(p).isDirectory() ? walk(new URL(f + '/', dir), pre + f + '/') : files.push(pre + f);
});
walk(OUT);
const hash = createHash('sha256'); files.sort().forEach(f => hash.update(f).update(readFileSync(new URL(f, OUT))));
const version = hash.digest('hex').slice(0, 10);
const sw = read('src/sw.js').replace('{{VERSION}}', version).replace('{{FILES}}', JSON.stringify(['./', ...files.filter(f => f !== 'index.html')]));
writeFileSync(new URL('sw.js', OUT), sw);
console.log(`빌드 완료: docs/ (index.html ${(html.length / 1024).toFixed(0)}KB, 오프라인 저장 파일 ${files.length}개, 버전 ${version})`);
