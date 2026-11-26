"""한 번만 돌리는 폰트 준비 스크립트 (구글 폰트 대신 사이트 안에 폰트를 넣기 위해)
- Noto Sans KR(가변 폰트)에서 400·500·700 굵기를 뽑고
- 자주 쓰는 한글 2,350자(KS X 1001) + 사이트·데이터에 나오는 모든 글자만 남겨서 용량을 줄여
- Black Han Sans는 제목에 쓰는 글자만 남겨
원본 폰트는 SIL Open Font License(OFL)라 이렇게 줄여서 같이 배포해도 돼.
사용법: pip install fonttools brotli && python3 scripts/make-fonts.py <원본폰트폴더>
"""
import sys, os, glob, io
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

src = sys.argv[1] if len(sys.argv) > 1 else '.fontsrc'
out = 'static/fonts'
os.makedirs(out, exist_ok=True)

# KS X 1001 완성형 한글 2,350자
ksx = ''.join(bytes([hi, lo]).decode('euc-kr') for hi in range(0xB0, 0xC9) for lo in range(0xA1, 0xFF))
site_text = ''
for f in glob.glob('src/*') + glob.glob('data/*.json'):
    site_text += open(f, encoding='utf-8').read()
basic = ''.join(chr(c) for c in range(0x20, 0x7F)) + '·…→←↑↓×「」『』‘’“”–—•※○●□■▲△♻️✝'
body_chars = set(ksx + site_text + basic)
body_chars = ''.join(sorted(c for c in body_chars if ord(c) >= 0x20))

def save(font, chars, path):
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.name_IDs = ['*']
    s = subset.Subsetter(opts); s.populate(text=chars); s.subset(font)
    font.flavor = 'woff2'; font.save(path)
    print(path, os.path.getsize(path) // 1024, 'KB')

for w in (400, 500, 700):
    vf = TTFont(os.path.join(src, 'NotoSansKR[wght].ttf'))
    f = instancer.instantiateVariableFont(vf, {'wght': w})
    save(f, body_chars, f'{out}/noto-sans-kr-{w}.woff2')

display = '쓰윽 이거 어디에 버려? 헷갈리는 쓰레기, 3초면 끝. 분리수거 도우미 ' + ''.join(chr(c) for c in range(0x20, 0x7F)) + '’'
save(TTFont(os.path.join(src, 'BlackHanSans-Regular.ttf')), display, f'{out}/black-han-sans.woff2')
