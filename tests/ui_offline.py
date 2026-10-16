"""Packaging helper for sandbox-only DOM tests; production HTTP/CSP is tested by CI.
No pixels, import parsers or compression algorithms are mocked. ES modules are
packaged as data URLs; PDF workers use the repository's actual code in a Blob.
"""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import quote
import re, json

def inline_css(path: Path) -> str:
    css=path.read_text()
    return re.sub(r'@import\s+(?:url\()?([\"\'])(.*?)\1\)?\s*;', lambda m:inline_css((path.parent/m[2].split('?')[0]).resolve()),css)

def module_uri(path: Path, cache=None) -> str:
    cache={} if cache is None else cache
    path=path.resolve()
    if path in cache:return cache[path]
    text=path.read_text()
    pattern=r'\b(from\s*|import\s*)([\"\'])(\.[^\"\']+)\2'
    text=re.sub(pattern,lambda m:m[1]+m[2]+module_uri(path.parent/m[3].split('?')[0],cache)+m[2],text)
    # A data: URL cannot be a relative worker base; the app already catches the
    # Worker constructor error and uses its real synchronous pixel pipeline.
    uri='data:text/javascript;charset=utf-8,'+quote(text)
    cache[path]=uri
    return uri

def load_dom(page, root: Path, route: str):
    path=root/route.strip('/')/'index.html'
    soup=BeautifulSoup(path.read_text(),'html.parser')
    css=[];scripts=[]
    for meta in soup.select('meta[http-equiv="Content-Security-Policy"]'):meta.decompose()
    for link in soup.select('link[rel="stylesheet"]'):
        css.append((path.parent/link['href'].split('?')[0]).resolve());link.decompose()
    for script in soup.find_all('script'):
        if script.get('src'):scripts.append(((path.parent/script['src'].split('?')[0]).resolve(),script.get('type')))
        script.decompose()
    page.set_content(str(soup))
    for style in css:page.add_style_tag(content=inline_css(style))
    if route not in ['/tools/','/tools/png-to-pdf-simple/']:
        worker='\n'.join((root/p).read_text() for p in ['tools/pdf-kit/pdf-lib.min.js','tools/pdf-engine.js','tools/pdf-kit/core.js'])+'\n'+re.sub(r'importScripts\([^\n]+\);','',(root/'tools/pdf-kit/worker.js').read_text())
        page.evaluate("""source=>{const NativeWorker=window.Worker;const blob=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));window.Worker=class extends NativeWorker{constructor(url){super(blob);}};const s=document.createElement('script');s.type='application/x-test-placeholder';s.setAttribute('data-workbench','');s.src='https://test.invalid/tools/pdf-kit/app.js';document.head.append(s);}""",worker)
    for source,kind in scripts:
        if kind=='module':page.add_script_tag(type='module',content='import('+json.dumps(module_uri(source))+');')
        else:
            text=source.read_text()
            if source.name=='tool-switcher.js':
                # about:blank has no test route. Only this address value is supplied.
                text='(()=>{const location={pathname:'+json.dumps(route)+',hash:"",origin:"https://test.invalid"};'+text+'})();'
            page.add_script_tag(content=text)
