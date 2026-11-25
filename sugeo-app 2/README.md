# 이거 어디에 버려? · 분리수거 도우미

헷갈리는 쓰레기 이름을 치면 어느 수거함에, 어떤 순서로 버리는지 알려주는 웹앱이야.
사이트: https://sugeo-app.github.io

## 폴더 구조

| 위치 | 내용 |
|---|---|
| `data/items.json` | 품목 데이터 (한 줄에 품목 하나: `name`, `aliases`, `parts[{name, bin, steps}]`, `tip`) |
| `src/engine.js` | 꼬마 AI 판단 로직 (오타 교정, 꾸밈말, 되묻기, 쓰레기 아닌 말 등) |
| `src/app.js` | 화면 동작 (검색, 결과 카드, 최근 기록, 소개 ↔ 검색 화면) |
| `src/styles.css`, `src/index.template.html` | 화면 모양과 뼈대 |
| `static/` | 그대로 복사되는 파일: 폰트(OFL), 공유 썸네일 `og.png`, 앱 아이콘, `manifest.webmanifest`, `404.html` |
| `src/sw.js` | 오프라인 저장(서비스워커). 빌드 때 파일 내용으로 버전이 정해져서, 새로 배포하면 자동으로 최신이 돼 |
| `scripts/` | 빌드·폰트·썸네일 만드는 스크립트 |
| `tests/cases/*.json` | 시험 문제 665개 (`["질문", "정답"]`) |
| `tests/parity.mjs` | 구조 분리 전 파일(`tests/fixtures/`)과 답이 똑같은지 비교 |
| `docs/` | **빌드 결과물 = 실제 사이트.** GitHub Pages가 이 폴더를 보여줘. 직접 고치지 말고 `npm run build`로 만들어 |

## 명령어 (Node 18 이상, 따로 설치할 패키지 없음)

```bash
npm test             # 665문제 시험. 하나라도 틀리면 실패
npm run test:parity  # P-1 구조 분리 확인용 (이후 이스터에그 등 의도된 변경은 다르게 나와)
npm run build        # docs/ 에 사이트 만들기
```

시험 정답 표기: 수거함 이름(`"a+b"`는 둘 다 나와야 함), `"!"` 쓰레기 아님, `"?"` 모른다고 해야 함, `"~"` 되물어야 함.

## 품목 고치는 순서

1. `data/items.json`에서 품목을 고치거나 별칭을 추가해
2. `tests/cases/basic.json`에 그 질문과 정답을 한 줄 추가해
3. `npm test` → `npm run build` → `docs/`까지 같이 올려

## 개인정보

- 서버, 로그인, 통계 도구 없음. 밖으로 자동 요청을 보내지 않아 (폰트도 사이트 안에 있어)
- 기기에만 저장: 최근 검색 6개(`recent`, 화면에서 지울 수 있어), 홈 화면 안내를 닫았는지(`installHint`), 오프라인용 사이트 파일(서비스워커 저장소)
- 신고는 사용자가 직접 GitHub Issues 링크를 눌러야만 열려

폰트: Noto Sans KR, Black Han Sans — SIL Open Font License 1.1 (`static/fonts/OFL.txt`)
