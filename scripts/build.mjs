// npm run build → docs/ 폴더에 배포용 사이트를 만들어 (GitHub Pages가 docs/를 보여줘)
import { mkdirSync, writeFileSync, cpSync, rmSync, readdirSync } from 'node:fs';
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
console.log('빌드 완료: docs/ →', readdirSync(OUT).join(', '), `(index.html ${(html.length / 1024).toFixed(0)}KB)`);
