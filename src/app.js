/* 화면 동작: 검색창, 결과 카드, 최근 기록, 소개 ↔ 검색 화면 전환 */
const SEASON={winter:["택배 상자","아이스팩","핫팩","귤껍질"],spring:["플라스틱 화분","우산","택배 상자"],summer:["수박껍질","아이스크림 막대","아이스팩","모기향"],fall:["밤 껍질","낙엽","택배 상자"]};
const COMMON=["치킨 뼈","컵라면 용기","깨진 유리컵","보조배터리","우유팩","영수증","계란 껍데기","남은 약","티백","마라탕 용기","페트병"];
const EXAMPLES=(()=>{const m=new Date().getMonth()+1;const s=m>=11||m<=2?"winter":m<=5?"spring":m<=8?"summer":"fall";return[...new Set([...SEASON[s],...COMMON])].slice(0,6)})();
const $=s=>document.querySelector(s), out=$("#out"), q=$("#q");

function loadRecent(){try{return JSON.parse(localStorage.getItem("recent")||"[]")}catch{return[]}}
function saveRecent(name){
  const list=[name,...loadRecent().filter(x=>x!==name)].slice(0,6);
  try{localStorage.setItem("recent",JSON.stringify(list))}catch{}
  drawRecent();
}
function drawRecent(){
  const list=loadRecent(), box=$("#recent"); box.innerHTML="";
  $("#recentBox").hidden=!list.length;
  list.forEach(x=>{const c=chip(x);c.classList.add("rec");const del=el("span","x","×");del.setAttribute("role","button");del.setAttribute("aria-label",x+" 지우기");del.tabIndex=0;
    const rm=e=>{e.stopPropagation();try{localStorage.setItem("recent",JSON.stringify(loadRecent().filter(y=>y!==x)))}catch{}drawRecent()};
    del.onclick=rm;del.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();rm(e)}};c.append(del);box.append(c)});
}
function chip(x){const c=document.createElement("button");c.type="button";c.className="chip";c.textContent=x;c.onclick=()=>{q.value=x;ask()};return c}

/* ---------- 결과 아래: 아니에요 / 잘못됐어요 / 다시 / 출처 ---------- */
const REPO="https://github.com/sugeo-app/sugeo-app.github.io/issues/new";
const GENERAL_SRC=[["서울시 「헷갈리는 분리배출 기준」(2025)","https://news.seoul.go.kr/env/archives/564022"],["환경부 생활폐기물 분리배출 누리집","https://www.wasteguide.or.kr"]];
const ITEM_SRC={
  "부탄가스·스프레이":[["대한민국 정책브리핑: 부탄가스 안전 안내","https://www.korea.kr/news/policyNewsView.do?newsId=148923719"],["서울시: 부탄가스 배출 방법(소방청 안내)","https://news.seoul.go.kr/env/archives/558471"]],
  "가스 용기":[["대한민국 정책브리핑: 부탄가스 안전 안내","https://www.korea.kr/news/policyNewsView.do?newsId=148923719"]],
  "남은 약":[["서울시: 폐의약품 올바른 배출 방법","https://news.seoul.go.kr/env/archives/564807"]],
  "남은 영양제":[["서울시: 폐의약품 올바른 배출 방법","https://news.seoul.go.kr/env/archives/564807"]],
  "LED 조명":[["LED등 재활용 의무화 관련 기사(2021)","https://www.hapt.co.kr/news/articleView.html?idxno=151712"]],
};
function actions(r,query){
  const box=el("div"), row=el("div","actions"), panel=el("div","panel");panel.hidden=true;
  const btn=(t,f)=>{const b=el("button","link",t);b.type="button";b.onclick=f;row.append(b)};
  const open=fill=>{panel.innerHTML="";fill(panel);panel.hidden=false};
  btn("이 결과가 아니에요",()=>open(p=>{
    const alt=suggest(query||r.item).filter(x=>x!==r.item);
    p.append(el("p",null,alt.length?"혹시 이 중에 있어?":"비슷한 걸 못 찾았어. 다른 이름으로 쳐 봐."));
    if(alt.length){const c=el("div","chips");alt.forEach(x=>c.append(chip(x)));p.append(c)}
  }));
  btn("정보가 잘못됐어요",()=>open(p=>{
    p.append(el("p",null,"뭐가 틀렸는지 알려 줘. 확인하고 고칠게."));
    const ta=el("textarea");ta.id="reportText";ta.placeholder="예: 우리 구는 이거 플라스틱으로 받아요";p.append(ta);
    const row2=el("div","row");
    const make=()=>`검색어: ${query||"-"}\n나온 결과: ${r.item} (${[...new Set((r.parts||[]).map(x=>x.bin))].join(", ")})\n내용: ${ta.value.trim()||"(안 적음)"}`;
    const a=el("a","btn2","GitHub로 보내기");a.target="_blank";a.rel="noopener";
    const upd=()=>{a.href=REPO+"?title="+encodeURIComponent("[정보 오류] "+r.item)+"&body="+encodeURIComponent(make())};upd();ta.oninput=upd;
    const cp=el("button","btn2 ghost","내용 복사");cp.type="button";
    cp.onclick=async()=>{try{await navigator.clipboard.writeText(make());cp.textContent="복사했어"}catch{ta.value=make();ta.select();cp.textContent="선택했어, 복사해 줘"}};
    row2.append(a,cp);p.append(row2);
    p.append(el("p","foot","GitHub로 보내려면 GitHub 계정이 필요해. 없으면 내용을 복사해서 만든 사람한테 보내 줘."));
  }));
  btn("다른 물건 다시 찾기",()=>{q.value="";out.innerHTML="";q.focus();window.scrollTo({top:0,behavior:"smooth"})});
  btn("출처 보기",()=>open(p=>{
    p.append(el("p",null,"이 안내는 아래 자료를 바탕으로 정리했어. 동네마다 다를 수 있으니 확실하지 않으면 구청에 물어봐."));
    const ul=el("ul");[...(ITEM_SRC[r.item]||[]),...GENERAL_SRC].forEach(([t,u])=>{const li=el("li"),a=el("a",null,t);a.href=u;a.target="_blank";a.rel="noopener";li.append(a);ul.append(li)});p.append(ul);
  }));
  box.append(row,panel);box.style.display="flex";box.style.flexDirection="column";box.style.gap="10px";
  return box;
}
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
const SRC={high:["꼬마 AI","--accent"],mid:["꼬마 AI · 아마 이거야","--pack"],guess:["꼬마 AI · 추측","--warn"],example:["예시","--line"]};
function render(r,src,query,o=out){
  o.innerHTML="";
  const parts=Array.isArray(r.parts)?r.parts:[];
  const top=el("div","top");
  top.append(el("p","item",r.item||"물건"));
  const bins=new Set(parts.map(p=>p.bin));
  if(src!=="example"&&src!=="high"){const [label,color]=SRC[src]||SRC.high;
  const s=el("span","src");const dot=el("i");dot.style.setProperty("--c",`var(${color})`);s.append(dot,document.createTextNode(label));top.append(s);}
  o.append(top);
  const v=el("p","verdict");v.append(el("span","arrow","→"));
  [...bins].forEach((b,i)=>{if(i)v.append(el("span","plus","+"));const t=el("span","v",b||"일반쓰레기");t.style.setProperty("--c",`var(${BINS[b]||"--general"})`);v.append(t)});
  o.append(v);
  if(src==="mid"||src==="guess"){const w=el("p","warn");w.append(el("b",null,"정확하지 않을 수 있어. "),document.createTextNode((r.note?r.note+" ":src==="mid"?`'${r.item}'(으)로 찾았어. 찾던 게 아니면 이름을 더 자세히 써줘. `:"목록에 없는 물건이라 이름만 보고 추측했어. ")+"확실하지 않으면 사는 구청 홈페이지나 관리사무소에서 확인해 봐."));o.append(w)}
  const list=el("div","parts");
  parts.forEach(p=>{
    const c=`var(${BINS[p.bin]||"--general"})`;
    const row=el("div","part");
    const d=el("span","dot"); d.style.setProperty("--c",c);
    const ph=el("div","ph");
    if(parts.length>1&&p.name) ph.append(el("span","pname",p.name));
    if(parts.length>1){const b=el("span","bin",p.bin||"일반쓰레기"); b.style.setProperty("--c",c); ph.append(b);}
    const ol=el("ol"); (p.steps||[]).forEach(x=>ol.append(el("li",null,x)));
    if(parts.length>1) row.append(d,ph,ol); else {row.classList.add("solo");row.append(ol);} list.append(row);
  });
  o.append(list);
  if(r.tip){const t=el("p","tip");t.append(el("b",null,"알아두기 "),document.createTextNode(r.tip));o.append(t)}
  if(o===out&&src!=="example") o.append(actions(r,query));
}
function status(t){out.innerHTML="";const p=el("p","status");p.append(el("span","spin"),document.createTextNode(t));out.append(p)}
function msg(t){out.innerHTML="";out.append(el("p","err",t))}

/* ---------- 검색 ---------- */
let firstTouch=true;
q.addEventListener("focus",()=>{if(firstTouch){q.select();firstTouch=false}});
function ask(){
  const item=q.value.trim();
  if(!item){q.focus();return}
  if(matchMedia("(pointer:coarse)").matches) q.blur();
  const r=miniAI(item);
  if(r&&r.egg){out.innerHTML="";const b=el("div","egg");b.append(el("span","egg-e",r.egg.e),el("p","item",r.egg.t),el("p","lead",r.egg.d));out.append(b);show();return}
  if(r&&r.notTrash){notTrash(r);show();return}
  if(r&&r.ambig){ambig(r);show();return}
  if(r&&r.conf!=="guess"){render(r,r.conf,item);saveRecent(r.item);show();return}
  if(r){render(r,"guess",item);show();return}
  unknown(item);
}
function ambig(r){
  out.innerHTML="";
  out.append(el("p","item",`어떤 '${r.item}'이야?`));
  out.append(el("p","lead","종류에 따라 버리는 곳이 달라. 하나 골라 줘."));
  const c=el("div","chips");r.options.forEach(x=>c.append(chip(x)));out.append(c);
}
function notTrash(r){
  out.innerHTML="";
  out.append(el("p","item",`'${r.item}'은(는) 버리는 게 아니야 🙂`));
  out.append(el("p","lead",r.pet?"혹시 이런 걸 찾는 거야?":"버릴 물건 이름을 써줘. 예: 컵라면 용기, 깨진 접시"));
  if(r.pet){const c=el("div","chips");["강아지 똥","배변패드","고양이 모래","사료","반려동물 장난감"].forEach(x=>c.append(chip(x)));out.append(c)}
}
function show(){const t=out.getBoundingClientRect();if(t.top<0||t.top>innerHeight*.6)out.scrollIntoView({behavior:"smooth",block:"start"})}
function unknown(item){
  out.innerHTML="";
  out.append(el("p","item",`'${item}'은(는) 아직 몰라`));
  out.append(el("p","lead","물건 이름을 더 흔한 말로 바꿔서 쳐 봐. 예: '플라스틱 통', '유리병', '비닐 봉지'"));
  const sg=suggest(item);
  if(sg.length){out.append(el("p","label","혹시 이거야?"));const c=el("div","chips");sg.forEach(x=>c.append(chip(x)));out.append(c)}
  out.append(el("p","warn","그래도 모르겠으면 사는 구청 홈페이지나 관리사무소에 물어보는 게 제일 정확해."));
  show();
}

$("#f").addEventListener("submit",e=>{e.preventDefault();ask()});
EXAMPLES.forEach(x=>$("#chips").append(chip(x)));
drawRecent();
$("#clearRecent").onclick=()=>{try{localStorage.removeItem("recent")}catch{}drawRecent()};
Object.entries(BINS).forEach(([n,v])=>{const li=el("li"),i=el("i");i.style.setProperty("--c",`var(${v})`);li.append(i,document.createTextNode(n));$("#legend").append(li)});
/* ---------- 소개 ↔ 앱 화면 전환 ---------- */
render(miniAI("투명 페트병"),"example","",document.getElementById("demo"));
function view(name){
  const app=name==="app";
  $("#intro").hidden=app; $("#app").hidden=!app;
  window.scrollTo(0,0);
}
function route(){view(location.hash==="#app"?"app":"intro")}
function go(h){try{if(location.hash==="#"+h){view(h);return}location.hash=h}catch{view(h)}}
document.querySelectorAll("[data-start]").forEach(b=>b.onclick=()=>{go("app");setTimeout(()=>q.focus({preventScroll:true}),50)});
$("#toIntro").onclick=()=>go("intro");
window.addEventListener("hashchange",route);
route();
