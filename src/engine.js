/* ================================================================
   꼬마 AI — 분리배출 판단기 (화면 없이도 돌아가는 부분)
   빌드할 때 data/items.json 이 DB 로 들어오고, 이 파일이 그 뒤에 붙어.
   테스트(tests/)도 이 파일을 그대로 불러서 써.
   ================================================================ */
const BINS={"플라스틱":"--plastic","비닐":"--vinyl","종이":"--paper","종이팩":"--pack","캔·고철":"--can","유리병":"--glass","음식물":"--food","일반쓰레기":"--general","대형·특수":"--special","싱크대":"--sink"};

// 재질 단어로 추측 (사전에 없을 때)
const GUESS=[
  [/배터리|건전지|형광등|충전|전자|전기|가전|폰|약/,"대형·특수",["따로 수거하는 품목일 수 있어","주민센터나 구청에 확인하기"]],
  [/유리|글라스/,"유리병",["병이면 비우고 헹궈서 유리병으로","컵·그릇이면 신문지에 싸서 일반쓰레기로"]],
  [/캔|알루미늄|철|스텐|스테인리스|금속|쇠|구리/,"캔·고철",["비우고 헹구기","고철로 배출"]],
  [/비닐|봉지|봉투|랩|필름|포장지/,"비닐",["이물질 털고 비닐류로"]],
  [/팩/,"종이팩",["헹궈서 펼쳐 말리기","종이팩 수거함에"]],
  [/종이|박스|상자|책|노트|신문|카드/,"종이",["테이프·비닐 떼기","납작하게 묶어서 종이류로"]],
  [/플라스틱|페트|용기|통|컵|뚜껑|트레이/,"플라스틱",["내용물 비우고 헹구기","플라스틱으로"]],
  [/껍질|껍데기|뼈|씨|가시/,"일반쓰레기",["딱딱하면 일반쓰레기","부드러운 과일 껍질이면 음식물"]],
  [/음식|반찬|과일|채소|야채|고기|생선|국물|소스/,"음식물",["물기 빼고 음식물로"]],
];

// "치킨뼈 어디에 버려?" 같은 말꼬리는 떼고 비교 (단, "고양이"의 '이'처럼 이름 끝 글자는 안 건드림)
const norm=s=>s.toLowerCase().replace(/[\s·.,!?~'"()\-]/g,"").replace(/껍데기|껍대기/g,"껍질").replace(/반려견|애견/g,"강아지").replace(/반려묘/g,"고양이").replace(/메론/g,"멜론").replace(/씨앗/g,"씨").replace(/막대기/g,"막대").replace(/(?:(?:을|를|은|는)?(?:어디에?|어떻게|어디로))?(?:버려요?|버리나요|버리지|버릴까|버리는법|버리는방법|분리수거|분리배출|버리기)$/,"").replace(/(?:을|를|은|는)?(?:어디에?|어떻게|어디로)$/,"");
const grams=s=>{const g=[];if(s.length<2)return[s];for(let i=0;i<s.length-1;i++)g.push(s.slice(i,i+2));return g};
function dice(a,b){const A=grams(a),B=grams(b).slice(),total=A.length+B.length;let m=0;A.forEach(x=>{const k=B.indexOf(x);if(k>=0){m++;B.splice(k,1)}});return 2*m/total}
function sim(q,a){
  let s=dice(q,a);
  if(a.length>=2&&q.includes(a)) s=Math.max(s,.62+.38*a.length/q.length);
  if(q.length>=2&&a.includes(q)) s=Math.max(s,.55+.35*q.length/a.length);
  return s;
}
// 오타 잡기: 한글을 자음·모음으로 쪼개서 한 번 더 비교 (칫숄 → 칫솔)
const CHO="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ",JUNG="ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ",JONG=" ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";
const jamo=s=>[...s].map(c=>{const k=c.charCodeAt(0)-0xAC00;if(k<0||k>11171)return c;return CHO[Math.floor(k/588)]+JUNG[Math.floor(k%588/28)]+(k%28?JONG[k%28]:"")}).join("");
// "다 쓴 건전지", "고장난 이어폰" 같은 앞말은 떼고 찾기
// "고양이 사료 캔"처럼 끝에 담는 그릇 이름이 붙으면 그걸 보고 판단
const CONT={"캔":["캔·고철",["비우고 헹구기","찌그러뜨려서 캔류로"]],"봉지":["비닐",["털고 헹궈서 비닐류로"]],"봉투":["비닐",["비닐이면 비닐류, 종이면 종이류로"]],"상자":["종이",["테이프 떼고 펼쳐서 종이류로"]],"박스":["종이",["테이프 떼고 펼쳐서 종이류로"]],"팩":["종이팩",["헹궈서 펼쳐 말리기","종이팩 수거함에"]]};
const MATERIAL=/^(스티로폼|플라스틱|유리|종이|비닐|알루미늄|스텐|철)$/;
// 자음·모음 기준 편집거리 (max를 넘으면 바로 포기)
function lev(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;let prev=[...Array(b.length+1).keys()];for(let i=1;i<=a.length;i++){const cur=[i];let lo=i;for(let j=1;j<=b.length;j++){cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));lo=Math.min(lo,cur[j])}if(lo>max)return max+1;prev=cur}return prev[b.length]}
// 버리는 물건이 아닌 말
const NOT_TRASH=new Set(["사람","나","너","저","우리","엄마","아빠","부모님","할머니","할아버지","형","누나","오빠","언니","동생","친구","선생님","쌤","남친","여친","남자친구","여자친구","강아지","개","고양이","반려동물","햄스터","물고기","금붕어","토끼","학교","학원","집","숙제","시험","공부","사랑","돈","지구","하늘","시간","인생","미래","꿈","행복","스트레스","기분","월요일"]);
// 숨은 재미 (이스터에그)
const EGG={"사탄":{e:"✝️",t:"사탄은 어느 수거함에도 안 들어가…",d:"십자가로 퇴치 완료! 이제 진짜 버릴 물건을 알려줘."},"악마":{e:"✝️",t:"악마는 분리수거 대상이 아니야",d:"십자가로 쫓아냈어. 버릴 물건 이름을 써 줘."}};
const PET=/^(강아지|개|고양이|반려동물|햄스터|물고기|금붕어|토끼)$/;
// 뜻이 여러 개인 말은 단정하지 말고 되묻기
const AMBIG={
  "유리":["유리병","유리컵","깨진 유리","거울","글라스락"],
  "껍질":["과일 껍질","채소 껍질","계란 껍데기","조개 껍데기","양파 껍질","견과류 껍질"],
  "용기":["배달 음식 용기","컵라면 용기","플라스틱 용기","글라스락","스티로폼","알루미늄 용기"],
  "컵":["플라스틱 컵","종이컵","유리컵","머그컵","텀블러"],
  "배터리":["건전지","보조배터리","휴대폰","노트북","단추전지"],
  "페트병":["투명 페트병","유색페트병","막걸리병"],
  "종이":["A4","택배 상자","종이컵","영수증","코팅지","책"],
  "우유병":["우유팩","바나나우유","유리병"],
  "병":["유리병","투명 페트병","소주병","약통","향수병"],
  "가전":["드라이기","전자레인지","냉장고","휴대폰","선풍기"],
  "전자제품":["충전기","드라이기","전자레인지","냉장고","휴대폰"],
  "전기제품":["충전기","드라이기","전자레인지","냉장고","휴대폰"],
  "가스":["부탄가스","스프레이","캠핑가스","소화기"],
  "통":["플라스틱 통","약통","샴푸통","분유캔","휴지통"],
  "뚜껑":["페트병 뚜껑","컵 뚜껑","금속 뚜껑","플라스틱 뚜껑"],
  "전구":["백열전구","LED 전구","형광등"],
  "그릇":["배달 그릇","깨진 그릇","글라스락","냄비"],
  "씨":["복숭아 씨","과일 씨","호두 껍질"],
  "팩":["우유팩","아이스팩","마스크팩","두유팩"],
  "카드":["신용카드","포토카드","생일카드"],
  "스프레이":["에어로졸 스프레이","분무기","세정제 스프레이"],
  "화분":["플라스틱 화분","도자기 화분","화분 흙","식물"],
};
const INDEX=DB.map(d=>({d,keys:d.n.map(n=>{const k=norm(n);return {k,j:jamo(k),w:n.split(/\s+/).map(norm)}})}));
function rank(raw){
  const q=norm(raw), qj=jamo(q), list=[];
  const tol=q.length<=2?1:2;
  for(const e of INDEX){let best=0,key="";for(const {k,j,w} of e.keys){let s=sim(q,k);
    // 두 글자 이하는 딱 맞거나 낱말 단위로 맞을 때만 인정 ("다리"가 "다리미"로 가지 않게)
    if(q.length<=2&&s<.95&&!w.includes(q)&&!(k.startsWith(q)&&/^(통|병|용기|팩|곽|봉지|봉투|캔|박스|상자|컵|껍질|뚜껑|케이스|심|병뚜껑)$/.test(k.slice(q.length))))s=Math.min(s,.5);
    if(s<.72&&q.length>=2&&q[0]===k[0]&&Math.abs(q.length-k.length)<=1&&lev(qj,j,tol)<=tol)s=.72;if(s>best){best=s;key=k}}list.push({d:e.d,s:best,key})}
  return list.sort((a,b)=>b.s-a.s);
}
// 앞에 붙는 꾸밈말 ("먹다 남은", "고장난" …) — 여러 개 붙어도 다 떼기
const MODS=/^(다\s*쓴|다\s*먹은|다\s*마신|먹다\s*남은|먹고\s*남은|마시다\s*남은|먹던|마시던|쓰던|입던|안\s*쓰는|안\s*입는|못\s*입는|작아진|고장\s*난|망가진|부러진|찢어진|낡은|오래된|더러운|상한|썩은|쉰|식은|불은|퉁퉁\s*불은|곰팡이\s*핀|유통기한\s*지난|우리\s*집|헌\s+|빈\s+)\s*/;
const TAIL=/\s*(남은\s*거|남은\s*것|버리는\s*법|버리는\s*방법)$/;
const LEFT=/남은|먹다|마시다|상한|썩은|쉰|식은|불은|곰팡이|유통기한/;
// "빈", "다 쓴" 이 붙으면 내용물(남은 약·음료 등) 안내는 빼기
const EMPTY=/(^|\s)(빈|다\s*쓴|다\s*먹은|다\s*마신|비운|깨끗한)(\s|$)/;
function emptied(d,conf,orig){
  if(!EMPTY.test(orig))return {...d,conf};
  const keep=d.parts.filter(p=>!/남은|내용물|고인|국물|음료|^술$|^약$|알약|물약/.test(p.name||"")&&p.bin!=="싱크대"&&p.bin!=="음식물");
  return keep.length&&keep.length<d.parts.length?{...d,item:keep.length===1&&keep[0].name?keep[0].name:"빈 "+d.item,parts:keep,conf}:{...d,conf};
}
function stripMods(t){let p;do{p=t;t=t.replace(MODS,"").replace(TAIL,"").trim()}while(t!==p);return t}
// 남은 음식 얘기면 음식물·싱크대 쪽 답에 가산점
function pick(q,leftover){const l=rank(q);if(leftover)l.forEach(x=>{if(x.d.parts.some(p=>p.bin==="음식물"||p.bin==="싱크대"))x.s=Math.min(1,x.s+.12)});l.sort((a,b)=>b.s-a.s);return l[0]}
function miniAI(text){
  const orig=text.trim(), leftover=LEFT.test(orig);
  const raw=stripMods(orig)||orig;
  if(!norm(raw)) return null;
  if(EGG[norm(raw)]) return {egg:EGG[norm(raw)]};
  if(NOT_TRASH.has(norm(raw))) return {notTrash:true,item:raw,pet:PET.test(norm(raw))};
  if(AMBIG[norm(raw)]) return {ambig:true,item:raw,options:AMBIG[norm(raw)]};
  const words=raw.split(/\s+/), last=words.length>1?words[words.length-1]:null;
  const full=pick(raw,leftover);
  if(full&&full.s>=.95) return emptied(full.d,"high",orig);
  // 1) 물건의 일부를 물으면 그 부분만: "케이크 플라스틱 칼", "참치캔 뚜껑"
  for(let i=words.length-1;i>=1;i--){
    const head=words.slice(0,i).join(" "), tail=norm(words.slice(i).join(""));
    const t=pick(head,leftover);
    if(t&&t.s>=.7&&!t.key.includes(tail)&&!MATERIAL.test(t.key)){
      const part=t.d.parts.find(p=>{const n=p.name&&norm(p.name);return n&&(n===tail||(tail.length>=2&&n.includes(tail))||(n.length>=2&&tail.includes(n)))});
      if(part) return {item:`${t.d.item} · ${part.name}`,parts:[part],tip:"",conf:t.s>=.8?"high":"mid"};
    }
  }
  // 2) 전체 문장으로 찾기, 3) 뒷부분 핵심어가 딱 맞으면 그걸로 ("유통기한 지난 약" → 약)
  let top=full;
  for(let k=1;k<words.length;k++){const t=pick(words.slice(k).join(" "),leftover);if(t&&t.s>=.95&&(!top||t.s>top.s+.05))top=t}
  if(top&&top.s>=.56&&top.s<.8&&!(leftover&&top.d.parts.some(p=>p.bin==="음식물"||p.bin==="싱크대"))){
    const near=rank(raw).filter(x=>x.d!==top.d&&x.s>=top.s-.03&&x.s>=.56);
    const binsOf=x=>[...new Set(x.d.parts.map(p=>p.bin))].sort().join();
    if(near.length&&near.some(x=>binsOf(x)!==binsOf(top))) return {ambig:true,item:raw,options:[top,...near].slice(0,4).map(x=>x.d.item)};
  }
  if(top&&top.s>=.56){
    const conf=top.s>=.8?"high":"mid";
    if(last&&!top.key.includes(norm(last))&&!MATERIAL.test(top.key)&&CONT[last]&&top.s<.95)
      return {item:raw,parts:[{name:"",bin:CONT[last][0],steps:CONT[last][1]}],tip:"",conf:"mid",note:`끝에 붙은 '${last}'을 보고 판단했어.`};
    return emptied(top.d,conf,orig);
  }
  // 4) 끝말이 담는 그릇이면 그걸로 ("강아지 간식 봉지" → 비닐)
  if(last&&CONT[last]) return {item:raw,parts:[{name:"",bin:CONT[last][0],steps:CONT[last][1]}],tip:"",conf:"mid",note:`끝에 붙은 '${last}'을 보고 판단했어.`};
  for(const [re,bin,steps] of GUESS) if(re.test(raw)) return {item:raw,parts:[{name:"",bin,steps}],tip:"",conf:"guess"};
  return null;
}
function suggest(text){return rank(text.trim()).filter(x=>x.s>=.4).slice(0,3).map(x=>x.d.item)}
