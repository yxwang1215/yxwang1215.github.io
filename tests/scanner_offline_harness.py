from pathlib import Path
import re,json
ROOT=Path(__file__).resolve().parents[1]/'tools'/'png-to-pdf'
def mount(page):
    html=(ROOT/'index.html').read_text()
    html=re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]+>','',html)
    html=re.sub(r'<script[^>]*>.*?</script>','',html,flags=re.S)
    html=re.sub(r'<link[^>]+>','',html)
    page.set_content(html)
    page.add_style_tag(content=(ROOT/'style.css').read_text())
    core=re.sub(r'\bexport (?=(?:async )?function)', '', (ROOT/'core.mjs').read_text())
    worker=re.sub(r'^import .*?;\n','', (ROOT/'worker.mjs').read_text())
    app=re.sub(r'^import .*?;\n','', (ROOT/'app.mjs').read_text())
    app=app.replace("new URL('./worker.mjs', import.meta.url)", 'URL.createObjectURL(new Blob(['+json.dumps(core+'\n'+worker)+"], {type: 'text/javascript'}))")
    page.add_script_tag(content=core+'\n'+app)
