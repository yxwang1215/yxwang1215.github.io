"""Verify that the public Pages entry and editor assets equal this checkout."""
from pathlib import Path
from hashlib import sha256
from urllib.request import Request, urlopen
import json, os, time
ROOT=Path(__file__).resolve().parents[1]
PATHS=['tools/index.html','tools/studio.css','tools/studio.mjs','tools/studio-utils.mjs','tools/studio-compression.mjs','tools/pdf-workspace.mjs']
base='https://yxwang1215.top/'
revision=os.environ.get('GITHUB_SHA','studio-release')
last_error=None
for attempt in range(16):
    try:
        checked=[]
        for path in PATHS:
            url=base+('tools/' if path=='tools/index.html' else path)+'?release='+revision
            request=Request(url,headers={'Cache-Control':'no-cache','User-Agent':'Paper-Studio-release-check'})
            with urlopen(request,timeout=20) as response:
                content=response.read();mime=response.headers.get('Content-Type','')
                assert response.status==200, f'{path}: HTTP {response.status}'
                if path.endswith('.mjs'):assert 'javascript' in mime,f'{path}: unexpected MIME {mime}'
            assert sha256(content).digest()==sha256((ROOT/path).read_bytes()).digest(),f'{path}: old or different published content'
            checked.append(path)
        out=ROOT/'.editor-checks';out.mkdir(exist_ok=True)
        (out/'published.json').write_text(json.dumps({'revision':revision,'site':base+'tools/','matched':checked},ensure_ascii=False,indent=2))
        print('Public deployment verified:',json.dumps(checked));break
    except Exception as error:
        last_error=error
        print(f'Waiting for Pages ({attempt+1}/16): {error}',flush=True)
        time.sleep(12)
else:raise RuntimeError(f'Public deployment not verified: {last_error}')
