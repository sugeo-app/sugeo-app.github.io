// 앱 아이콘 만들기: node scripts/icons/make-icons.cjs (Playwright 필요, 배포 때는 안 돌려도 돼)
const {chromium}=require('playwright');const path=require('path');const out=p=>path.join(__dirname,'../../static/icons',p);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:512,height:512}});
await p.goto('file://'+path.join(__dirname,'icon.html'));await p.evaluate(()=>document.fonts.ready);
const shot=async(cls,file,size)=>{await p.evaluate(c=>{document.getElementById('c').className='i '+c},cls);
  await p.setViewportSize({width:512,height:512});const buf=await p.locator('#c').screenshot({omitBackground:true});
  if(size===512){require('fs').writeFileSync(out(file),buf);return}
  const p2=await b.newPage({viewport:{width:size,height:size}});await p2.setContent(`<body style="margin:0"><img src="data:image/png;base64,${buf.toString('base64')}" style="width:${size}px;height:${size}px;display:block">`);
  await p2.screenshot({path:out(file),omitBackground:true});await p2.close()};
await shot('round','icon-512.png',512);await shot('round','icon-192.png',192);
await shot('mask','icon-maskable-512.png',512);await shot('','apple-touch-icon.png',180);
await b.close();console.log('아이콘 완료')})();
