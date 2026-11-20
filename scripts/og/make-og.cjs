// 공유 썸네일(1200×630) 만들기: node scripts/og/make-og.cjs  (Playwright 필요, 배포 때는 안 돌려도 돼)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});
await p.goto('file://'+path.join(__dirname,'card.html'));await p.evaluate(()=>document.fonts.ready);
await p.screenshot({path:path.join(__dirname,'../../static/og.png')});await b.close();console.log('static/og.png 완료')})();
