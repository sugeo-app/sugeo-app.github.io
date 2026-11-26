/* 화면 동작: 검색창, 결과 카드, 최근 기록, 소개 ↔ 검색 화면 전환, 한국어/English */

/* ---------- 언어 ---------- */
let LANG=(()=>{try{const v=localStorage.getItem("lang");if(v==="ko"||v==="en")return v}catch{}return /^ko/i.test(navigator.language||"ko")?"ko":"en"})();
const T={
ko:{
  langBtn:"English",eyebrow:"K-Bin · 분리수거 도우미",
  introH1:"헷갈리는 쓰레기,<br><em>3초면 끝.</em>",
  introLead:"치킨 뼈는 음식물일까? 아이스팩은? 버릴 물건 이름만 치면 어디에, 어떻게 버리는지 바로 알려줘.",
  howTitle:"이렇게 써",
  step1:"<b>버릴 물건 이름을 쳐</b><span>\"컵라면 용기\", \"깨진 접시\"처럼 부르는 대로 쓰면 돼. 오타도 웬만큼 알아들어.</span>",
  step2:"<b>어디에 버리는지 확인해</b><span>플라스틱, 비닐, 음식물처럼 수거함이 색깔로 바로 보여.</span>",
  step3:"<b>부품별로 나눠서 버려</b><span>뚜껑, 라벨, 몸통이 따로 버려야 하면 하나씩 알려줘.</span>",
  demoCap:"예를 들어 '투명 페트병'을 치면 ↓",demoQuery:"투명 페트병",
  feat1:"<b>330개+</b><span>아는 물건</span>",feat2:"<b>부품별</b><span>나눠서 안내</span>",feat3:"<b>오프라인</b><span>인터넷 없어도 돼</span>",
  start:"시작하기",introFoot:"환경부 분리배출 기준이야. 동네마다 세부 규칙은 다를 수 있어.",
  whatIsThis:"이게 뭐야?",appH1:"이거 어디에 버려?",appLead:"헷갈리는 쓰레기, 이름만 치면 어떻게 버리는지 알려줄게.",
  placeholder:"예: 치킨 뼈, 아이스팩",qLabel:"버릴 물건 이름",find:"찾기",installBtn:"홈 화면에 추가",closeHint:"안내 닫기",
  popular:"많이 찾는 것",recent:"최근에 찾은 것",clearAll:"전체 지우기",
  emptyTitle:"여기에 버리는 법이 나와",emptyLead:"왼쪽에 물건 이름을 치거나 많이 찾는 것을 눌러 봐. 색깔은 이렇게 구분돼.",
  foot:"환경부·서울시 분리배출 기준 · 인터넷 없어도 돼 · 동네마다 세부 규칙은 다를 수 있어",
  title:"K-Bin · 이거 어디에 버려?",
  srcMid:"꼬마 AI · 아마 이거야",srcGuess:"꼬마 AI · 추측",safety:"⚠️ 안전 주의 ",tip:"알아두기 ",
  warnHead:"정확하지 않을 수 있어. ",warnMid:x=>`'${x}'(으)로 찾았어. 찾던 게 아니면 이름을 더 자세히 써줘. `,warnGuess:"목록에 없는 물건이라 이름만 보고 추측했어. ",
  warnTail:"확실하지 않으면 사는 구청 홈페이지나 관리사무소에서 확인해 봐.",noEn:"",
  notThis:"이 결과가 아니에요",wrong:"정보가 잘못됐어요",again:"다른 물건 다시 찾기",sources:"출처 보기",
  altQ:"혹시 이 중에 있어?",altNone:"비슷한 걸 못 찾았어. 다른 이름으로 쳐 봐.",
  reportIntro:"뭐가 틀렸는지 알려 줘. 확인하고 고칠게.",reportPh:"예: 우리 구는 이거 플라스틱으로 받아요",
  rQuery:"검색어",rResult:"나온 결과",rBody:"내용",rNone:"(안 적음)",rTitle:"[정보 오류] ",
  sendGh:"GitHub로 보내기",copy:"내용 복사",copied:"복사했어",selected:"선택했어, 복사해 줘",
  ghNote:"GitHub로 보내려면 GitHub 계정이 필요해. 없으면 내용을 복사해서 만든 사람한테 보내 줘.",
  srcIntro:"이 안내는 아래 자료를 바탕으로 정리했어. 동네마다 다를 수 있으니 확실하지 않으면 구청에 물어봐.",
  ambigTitle:x=>`어떤 '${x}'이야?`,ambigLead:"종류에 따라 버리는 곳이 달라. 하나 골라 줘.",
  notTrashTitle:x=>`'${x}'은(는) 버리는 게 아니야 🙂`,notTrashPet:"혹시 이런 걸 찾는 거야?",notTrashLead:"버릴 물건 이름을 써줘. 예: 컵라면 용기, 깨진 접시",
  petChips:["강아지 똥","배변패드","고양이 모래","사료","반려동물 장난감"],
  unknownTitle:x=>`'${x}'은(는) 아직 몰라`,unknownLead:"물건 이름을 더 흔한 말로 바꿔서 쳐 봐. 예: '플라스틱 통', '유리병', '비닐 봉지'",
  maybe:"혹시 이거야?",unknownWarn:"그래도 모르겠으면 사는 구청 홈페이지나 관리사무소에 물어보는 게 제일 정확해.",
  del:x=>x+" 지우기",
  iosHint:"홈 화면에 추가하면 앱처럼 쓸 수 있어. 아래 공유 버튼 → '홈 화면에 추가'를 눌러 봐.",androidHint:"홈 화면에 추가하면 앱처럼 바로 열려. 인터넷이 없어도 돼.",
  season:{winter:["택배 상자","아이스팩","핫팩","귤껍질"],spring:["플라스틱 화분","우산","택배 상자"],summer:["수박껍질","아이스크림 막대","아이스팩","모기향"],fall:["밤 껍질","낙엽","택배 상자"]},
  common:["치킨 뼈","컵라면 용기","깨진 유리컵","보조배터리","우유팩","영수증","계란 껍데기","남은 약","티백","마라탕 용기","페트병"],
},
en:{
  langBtn:"한국어",eyebrow:"K-Bin · Korea recycling helper",
  introH1:"Confusing trash?<br><em>Sorted in 3 seconds.</em>",
  introLead:"Are chicken bones food waste? What about ice packs? Type what you want to throw away and see where and how it goes in Korea.",
  howTitle:"How it works",
  step1:"<b>Type what you're throwing away</b><span>Write it however you call it, like \"cup noodle\" or \"broken plate\". It handles typos too.</span>",
  step2:"<b>See which bin it goes in</b><span>Plastic, plastic film, food waste… each bin has its own color.</span>",
  step3:"<b>Split it into parts</b><span>If the lid, label and body go in different bins, you get each one.</span>",
  demoCap:"For example, type \"clear PET bottle\" ↓",demoQuery:"clear plastic bottle",
  feat1:"<b>330+</b><span>items known</span>",feat2:"<b>By part</b><span>step-by-step</span>",feat3:"<b>Offline</b><span>works without internet</span>",
  start:"Start",introFoot:"Based on Korean Ministry of Environment rules. Details can differ by neighborhood.",
  whatIsThis:"What is this?",appH1:"Where does this go?",appLead:"Type any confusing piece of trash and see how to throw it away.",
  placeholder:"e.g. chicken bones, ice pack",qLabel:"What are you throwing away?",find:"Search",installBtn:"Add to home screen",closeHint:"Close",
  popular:"Popular",recent:"Recent searches",clearAll:"Clear all",
  emptyTitle:"Your answer shows up here",emptyLead:"Type an item on the left or tap a popular one. Bins use these colors.",
  foot:"Korean Ministry of Environment & Seoul rules · Works offline · Details can differ by neighborhood",
  title:"K-Bin · Where does this go?",
  srcMid:"Probably this",srcGuess:"Best guess",safety:"⚠️ Safety ",tip:"Good to know ",
  warnHead:"This may not be exact. ",warnMid:x=>`Showing "${x}". If that's not it, try a more specific name. `,warnGuess:"This item isn't in our list, so this is a guess from its name. ",
  warnTail:"If you're unsure, check your district office website or building manager.",noEn:"No English guide for this item yet, so it's shown in Korean.",
  notThis:"Not what I meant",wrong:"Report a mistake",again:"Search something else",sources:"Sources",
  altQ:"Is it one of these?",altNone:"Couldn't find anything similar. Try another name.",
  reportIntro:"Tell us what's wrong and we'll fix it.",reportPh:"e.g. My district takes this as plastic",
  rQuery:"Search",rResult:"Result",rBody:"Details",rNone:"(none)",rTitle:"[Info error] ",
  sendGh:"Send via GitHub",copy:"Copy text",copied:"Copied",selected:"Selected, please copy",
  ghNote:"Sending via GitHub needs a GitHub account. If you don't have one, copy the text and send it to the maker.",
  srcIntro:"This guide is based on the sources below (in Korean). Rules can differ by neighborhood, so ask your district office if unsure.",
  ambigTitle:x=>`Which "${x}"?`,ambigLead:"It depends on the type. Pick one.",
  notTrashTitle:x=>`"${x}" isn't something you throw away 🙂`,notTrashPet:"Were you looking for one of these?",notTrashLead:"Type an item to throw away, like cup noodle or broken plate.",
  petChips:["dog poop","pee pad","cat litter"],
  unknownTitle:x=>`Don't know "${x}" yet`,unknownLead:"Try a more common name, like \"plastic container\", \"glass bottle\" or \"plastic bag\". Korean works too.",
  maybe:"Did you mean?",unknownWarn:"If you still can't find it, your district office or building manager will know for sure.",
  del:x=>"Remove "+x,
  iosHint:"Add this to your home screen to use it like an app: tap Share → 'Add to Home Screen'.",androidHint:"Add to your home screen to open it like an app, even offline.",
  season:{winter:["delivery box","ice pack","hand warmer","fruit peel"],spring:["umbrella","delivery box","face mask"],summer:["watermelon rind","ice cream stick","ice pack"],fall:["delivery box","eggs","umbrella"]},
  common:["chicken bones","cup noodle","broken glass","power bank","milk carton","receipt","eggshells","medicine","tea bag","pet bottle"],
}};
const t=k=>T[LANG][k]!==undefined?T[LANG][k]:T.ko[k];
const BIN_EN={"플라스틱":"Plastic","비닐":"Plastic film","종이":"Paper","종이팩":"Paper cartons","캔·고철":"Cans & metal","유리병":"Glass bottles","음식물":"Food waste","일반쓰레기":"General waste bag","대형·특수":"Special / bulky","싱크대":"Sink (drain)"};
const binName=b=>LANG==="en"&&BIN_EN[b]?`${BIN_EN[b]} (${b})`:b;
const examples=()=>{const m=new Date().getMonth()+1;const s=m>=11||m<=2?"winter":m<=5?"spring":m<=8?"summer":"fall";return[...new Set([...t("season")[s],...t("common")])].slice(0,6)};

const $=s=>document.querySelector(s), out=$("#out"), q=$("#q");
// 품목 이름을 지금 언어로 (추천·되묻기 버튼용). 영어 이름도 검색어로 통해.
const EN_NAME=new Map(DB.map(d=>[d.item,d.en&&d.en.name]));
const nameOf=x=>LANG==="en"&&EN_NAME.get(x)||x;
const sugg=x=>[...new Set(suggest(x).map(nameOf))];
let lastQuery="";

/* ---------- 결과를 지금 언어로 바꿔 보여주기 ---------- */
function loc(r){
  if(LANG!=="en") return {item:r.item,parts:r.parts,tip:r.tip};
  if(r.raw) return {item:r.item,parts:r.parts.map(p=>({...p,steps:p.enSteps||p.steps})),tip:""};
  const base=r.src||r, e=base.en;
  if(!e) return {item:r.item,parts:r.parts,tip:r.tip,noEn:true};
  const parts=r.parts.map(p=>{const i=base.parts.indexOf(p),ep=e.parts[i]||{};return {bin:p.bin,name:ep.name||p.name,steps:ep.steps||p.steps}});
  let item=e.name;
  if(r.focus==="part") item=`${e.name} · ${parts[0].name}`;
  else if(r.focus==="empty") item=parts.length===1&&parts[0].name?parts[0].name:"Empty "+e.name.toLowerCase();
  return {item,parts,tip:r.focus?"":e.tip};
}

/* ---------- 최근 검색 (이 기기에만 저장) ---------- */
function loadRecent(){try{return JSON.parse(localStorage.getItem("recent")||"[]")}catch{return[]}}
function saveRecent(name){
  const list=[name,...loadRecent().filter(x=>x!==name)].slice(0,6);
  try{localStorage.setItem("recent",JSON.stringify(list))}catch{}
  drawRecent();
}
function drawRecent(){
  const list=loadRecent(), box=$("#recent"); box.innerHTML="";
  $("#recentBox").hidden=!list.length;
  list.forEach(x=>{const c=chip(x);c.classList.add("rec");const del=el("span","x","×");del.setAttribute("role","button");del.setAttribute("aria-label",t("del")(x));del.tabIndex=0;
    const rm=e=>{e.stopPropagation();try{localStorage.setItem("recent",JSON.stringify(loadRecent().filter(y=>y!==x)))}catch{}drawRecent()};
    del.onclick=rm;del.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();rm(e)}};c.append(del);box.append(c)});
}
function chip(x){const c=document.createElement("button");c.type="button";c.className="chip";c.textContent=x;c.onclick=()=>{q.value=x;ask()};return c}

/* ---------- 결과 아래: 아니에요 / 잘못됐어요 / 다시 / 출처 ---------- */
const REPO="https://github.com/sugeo-app/sugeo-app.github.io/issues/new";
const GENERAL_SRC=[["서울시 「헷갈리는 분리배출 기준」(2025)","Seoul Metropolitan Government: confusing recycling rules (2025, Korean)","https://news.seoul.go.kr/env/archives/564022"],["환경부 생활폐기물 분리배출 누리집","Ministry of Environment household waste guide (Korean)","https://www.wasteguide.or.kr"]];
const BRIEF=["대한민국 정책브리핑: 부탄가스 안전 안내","Korea.kr policy briefing: butane gas safety (Korean)","https://www.korea.kr/news/policyNewsView.do?newsId=148923719"];
const MED=["서울시: 폐의약품 올바른 배출 방법","Seoul: how to dispose of medicine (Korean)","https://news.seoul.go.kr/env/archives/564807"];
const ITEM_SRC={
  "부탄가스·스프레이":[BRIEF,["서울시: 부탄가스 배출 방법(소방청 안내)","Seoul: butane gas disposal, citing the National Fire Agency (Korean)","https://news.seoul.go.kr/env/archives/558471"]],
  "가스 용기":[BRIEF],"남은 약":[MED],"남은 영양제":[MED],
  "LED 조명":[["LED등 재활용 의무화 관련 기사(2021)","News: LED lights become mandatory recycling items (2021, Korean)","https://www.hapt.co.kr/news/articleView.html?idxno=151712"]],
};
function actions(r,shown,query){
  const box=el("div"), row=el("div","actions"), panel=el("div","panel");panel.hidden=true;
  const btn=(label,f)=>{const b=el("button","link",label);b.type="button";b.onclick=f;row.append(b)};
  const open=fill=>{panel.innerHTML="";fill(panel);panel.hidden=false};
  const base=(r.src||r).item;
  btn(t("notThis"),()=>open(p=>{
    const alt=sugg(query||r.item).filter(x=>x!==shown.item&&x!==r.item);
    p.append(el("p",null,alt.length?t("altQ"):t("altNone")));
    if(alt.length){const c=el("div","chips");alt.forEach(x=>c.append(chip(x)));p.append(c)}
  }));
  btn(t("wrong"),()=>open(p=>{
    p.append(el("p",null,t("reportIntro")));
    const ta=el("textarea");ta.id="reportText";ta.placeholder=t("reportPh");p.append(ta);
    const row2=el("div","row");
    const make=()=>`${t("rQuery")}: ${query||"-"}\n${t("rResult")}: ${shown.item} / ${base} (${[...new Set((r.parts||[]).map(x=>x.bin))].join(", ")})\n${t("rBody")}: ${ta.value.trim()||t("rNone")}\nlang: ${LANG}`;
    const a=el("a","btn2",t("sendGh"));a.target="_blank";a.rel="noopener";
    const upd=()=>{a.href=REPO+"?title="+encodeURIComponent(t("rTitle")+base)+"&body="+encodeURIComponent(make())};upd();ta.oninput=upd;
    const cp=el("button","btn2 ghost",t("copy"));cp.type="button";
    cp.onclick=async()=>{try{await navigator.clipboard.writeText(make());cp.textContent=t("copied")}catch{ta.value=make();ta.select();cp.textContent=t("selected")}};
    row2.append(a,cp);p.append(row2);
    p.append(el("p","foot",t("ghNote")));
  }));
  btn(t("again"),()=>{q.value="";out.innerHTML="";lastQuery="";q.focus();window.scrollTo({top:0,behavior:"smooth"})});
  btn(t("sources"),()=>open(p=>{
    p.append(el("p",null,t("srcIntro")));
    const ul=el("ul");[...(ITEM_SRC[base]||[]),...GENERAL_SRC].forEach(([ko,en,u])=>{const li=el("li"),a=el("a",null,LANG==="en"?en:ko);a.href=u;a.target="_blank";a.rel="noopener";li.append(a);ul.append(li)});p.append(ul);
  }));
  box.append(row,panel);box.style.display="flex";box.style.flexDirection="column";box.style.gap="10px";
  return box;
}
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}

// 안전 품목: 결과 위에 경고 (공식 안내의 요지만)
const SAFETY=(()=>{
  const S=(ko,en)=>({ko,en});
  const gas=S("구멍을 뚫지 마. 남은 가스 때문에 폭발·중독 사고가 날 수 있어.","Don't puncture it. Leftover gas can cause explosions and poisoning.");
  const bat=S("종량제 봉투에 넣으면 수거차·선별장에서 불이 날 수 있어. 꼭 전용 수거함에 넣어.","In a general waste bag it can start fires in garbage trucks and sorting plants. Always use the special bin.");
  const med=S("변기나 하수구에 버리지 마. 물이 오염돼.","Don't flush it or pour it down the drain. It pollutes water.");
  const sharp=S("신문지로 단단히 싸고 겉에 표시해 줘. 수거하는 사람이 다칠 수 있어.","Wrap it well in newspaper and label it. Collectors can get hurt.");
  return {"부탄가스·스프레이":gas,"가스 용기":gas,"건전지":bat,"보조배터리":bat,"단추형 전지":bat,"전자담배":bat,"무선 이어폰·헤드셋":bat,
    "남은 약":med,"안약·연고":med,"주사기·바늘":S("바늘은 뚜껑을 씌워 단단한 통에 모아. 그냥 버리면 수거하는 사람이 찔릴 수 있어.","Cap needles and collect them in a hard container. Loose needles can stab collectors."),
    "형광등":S("수은이 들어 있어. 깨지지 않게 전용 수거함에 넣어.","It contains mercury. Keep it unbroken and use the special bin."),"폐식용유":S("하수구에 부으면 배관이 막히고 물이 오염돼.","Pouring it down the drain clogs pipes and pollutes water."),
    "소화기":S("압력이 남아 있어서 종량제 봉투에 넣으면 위험해.","It's still under pressure, so a general waste bag is dangerous."),"페인트·화학약품":S("하수구에 버리지 마. 많이 남았으면 구청에 물어봐.","Don't pour it down the drain. If there's a lot left, ask your district office."),
    "깨진 유리·유리컵":sharp,"깨진 유리병":sharp,"가위·칼":sharp};
})();
const SRC={mid:["srcMid","--pack"],guess:["srcGuess","--warn"]};

function render(r,src,query,o=out){
  o.innerHTML="";
  const v0=loc(r), parts=Array.isArray(v0.parts)?v0.parts:[];
  const top=el("div","top");
  top.append(el("p","item",v0.item||"?"));
  const bins=new Set(parts.map(p=>p.bin));
  if(SRC[src]){const [key,color]=SRC[src];
    const s=el("span","src");const dot=el("i");dot.style.setProperty("--c",`var(${color})`);s.append(dot,document.createTextNode(t(key)));top.append(s);}
  o.append(top);
  if(v0.noEn) o.append(el("p","noen",t("noEn")));
  const v=el("p","verdict");v.append(el("span","arrow","→"));
  [...bins].forEach((b,i)=>{if(i)v.append(el("span","plus","+"));const s=el("span","v",binName(b||"일반쓰레기"));s.style.setProperty("--c",`var(${BINS[b]||"--general"})`);v.append(s)});
  o.append(v);
  const warn=SAFETY[(r.src||r).item]; if(warn&&src!=="example"){const a=el("p","alert");a.append(el("b",null,t("safety")),document.createTextNode(warn[LANG]||warn.ko));o.append(a)}
  if(src==="mid"||src==="guess"){const w=el("p","warn");
    const note=LANG==="en"?r.noteEn:r.note;
    w.append(el("b",null,t("warnHead")),document.createTextNode((note?note+" ":src==="mid"?t("warnMid")(v0.item):t("warnGuess"))+t("warnTail")));o.append(w)}
  const list=el("div","parts");
  parts.forEach(p=>{
    const c=`var(${BINS[p.bin]||"--general"})`;
    const row=el("div","part");
    const d=el("span","dot"); d.style.setProperty("--c",c);
    const ph=el("div","ph");
    if(parts.length>1&&p.name) ph.append(el("span","pname",p.name));
    if(parts.length>1){const b=el("span","bin",binName(p.bin||"일반쓰레기")); b.style.setProperty("--c",c); ph.append(b);}
    const ol=el("ol"); (p.steps||[]).forEach(x=>ol.append(el("li",null,x)));
    if(parts.length>1) row.append(d,ph,ol); else {row.classList.add("solo");row.append(ol);} list.append(row);
  });
  o.append(list);
  if(v0.tip){const tp=el("p","tip");tp.append(el("b",null,t("tip")),document.createTextNode(v0.tip));o.append(tp)}
  if(o===out&&src!=="example") o.append(actions(r,v0,query));
  return v0;
}

/* ---------- 검색 ---------- */
let firstTouch=true;
q.addEventListener("focus",()=>{if(firstTouch){q.select();firstTouch=false}});
function ask(keepScroll){
  const item=q.value.trim();
  if(!item){q.focus();return}
  lastQuery=item;
  if(!keepScroll&&matchMedia("(pointer:coarse)").matches) q.blur();
  const r=miniAI(item), done=()=>{if(!keepScroll)show()};
  if(r&&r.egg){out.innerHTML="";const g=LANG==="en"&&r.egg.en?{...r.egg,...r.egg.en}:r.egg;const b=el("div","egg");b.append(el("span","egg-e a-"+(g.a||"holy"),g.e),el("p","item",g.t),el("p","lead",g.d));
    if(g.chips){const c=el("div","chips");g.chips.forEach(x=>c.append(chip(x)));b.append(c)}out.append(b);done();return}
  if(r&&r.notTrash){notTrash(r);done();return}
  if(r&&r.ambig){ambig(r);done();return}
  if(r&&r.conf!=="guess"){const v=render(r,r.conf,item);saveRecent(v.item);done();return}
  if(r){render(r,"guess",item);done();return}
  unknown(item);
}
function ambig(r){
  out.innerHTML="";
  out.append(el("p","item",t("ambigTitle")(r.item)));
  out.append(el("p","lead",t("ambigLead")));
  const c=el("div","chips");[...new Set(r.options.map(nameOf))].forEach(x=>c.append(chip(x)));out.append(c);
}
function notTrash(r){
  out.innerHTML="";
  out.append(el("p","item",t("notTrashTitle")(r.item)));
  out.append(el("p","lead",r.pet?t("notTrashPet"):t("notTrashLead")));
  if(r.pet){const c=el("div","chips");t("petChips").forEach(x=>c.append(chip(x)));out.append(c)}
}
function show(){const b=out.getBoundingClientRect();if(b.top<0||b.top>innerHeight*.6)out.scrollIntoView({behavior:"smooth",block:"start"})}
function unknown(item){
  out.innerHTML="";
  out.append(el("p","item",t("unknownTitle")(item)));
  out.append(el("p","lead",t("unknownLead")));
  const sg=sugg(item);
  if(sg.length){out.append(el("p","label",t("maybe")));const c=el("div","chips");sg.forEach(x=>c.append(chip(x)));out.append(c)}
  out.append(el("p","warn",t("unknownWarn")));
  show();
}

/* ---------- 화면 글자 채우기 (언어 바꿀 때마다) ---------- */
function applyLang(){
  document.documentElement.lang=LANG;
  document.title=t("title");
  document.querySelectorAll("[data-i18n]").forEach(e=>{e.textContent=t(e.dataset.i18n)});
  document.querySelectorAll("[data-i18n-html]").forEach(e=>{e.innerHTML=t(e.dataset.i18nHtml)});
  document.querySelectorAll("[data-i18n-ph]").forEach(e=>{e.placeholder=t(e.dataset.i18nPh)});
  document.querySelectorAll("[data-i18n-aria]").forEach(e=>{e.setAttribute("aria-label",t(e.dataset.i18nAria))});
  const chips=$("#chips");chips.innerHTML="";examples().forEach(x=>chips.append(chip(x)));
  const lg=$("#legend");lg.innerHTML="";Object.entries(BINS).forEach(([n,v])=>{const li=el("li"),i=el("i");i.style.setProperty("--c",`var(${v})`);li.append(i,document.createTextNode(LANG==="en"?BIN_EN[n]:n));lg.append(li)});
  render(miniAI(t("demoQuery")),"example","",$("#demo"));
  drawRecent();
  installText();
}
document.querySelectorAll("[data-lang-toggle]").forEach(b=>b.onclick=()=>{
  LANG=LANG==="ko"?"en":"ko";try{localStorage.setItem("lang",LANG)}catch{}
  applyLang();
  if(lastQuery&&out.childElementCount){q.value=lastQuery;ask(true)}
});

$("#f").addEventListener("submit",e=>{e.preventDefault();ask()});
$("#clearRecent").onclick=()=>{try{localStorage.removeItem("recent")}catch{}drawRecent()};

/* ---------- 소개 ↔ 앱 화면 전환 ---------- */
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

/* ---------- 앱처럼 쓰기: 오프라인 저장 + 홈 화면 추가 안내 (한 번만, 닫으면 다시 안 보임) ---------- */
if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol)){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
let installMode="";
function installText(){const x=$("#installText");if(installMode)x.textContent=t(installMode==="ios"?"iosHint":"androidHint")}
(()=>{
  const box=$("#install"),btn=$("#installBtn");
  const standalone=matchMedia("(display-mode: standalone)").matches||navigator.standalone;
  let closed=false;try{closed=localStorage.getItem("installHint")==="closed"}catch{}
  if(standalone||closed)return;
  const close=()=>{box.hidden=true;try{localStorage.setItem("installHint","closed")}catch{}};
  $("#installClose").onclick=close;
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)&&/safari/i.test(navigator.userAgent)&&!/crios|fxios|edgios/i.test(navigator.userAgent);
  if(ios){installMode="ios";installText();box.hidden=false;return}
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();
    installMode="android";installText();btn.hidden=false;box.hidden=false;
    btn.onclick=async()=>{e.prompt();try{await e.userChoice}catch{}close()};
  });
})();

applyLang();
route();
