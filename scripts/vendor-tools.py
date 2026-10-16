"""Vendor the pinned PDF codec. Verify archive bytes before extracting fixed paths."""
import base64, hashlib, io, pathlib, tarfile, urllib.request
VERSION = '1.17.1'
INTEGRITY = 'V/mpyJAoTsN4cnP31vc0wfNA1+p20evqqnap0KLoRUN0Yk/p3wN52DOEsL4oBFcLdb76hlpKPtzJIgo67j/XLw=='
url = f'https://registry.npmjs.org/pdf-lib/-/pdf-lib-{VERSION}.tgz'
with urllib.request.urlopen(url, timeout=60) as response:
    archive = response.read(30_000_001)
if len(archive) > 30_000_000 or base64.b64encode(hashlib.sha512(archive).digest()).decode() != INTEGRITY:
    raise RuntimeError('PDF codec archive integrity mismatch')
root = pathlib.Path('tools/codecs'); root.mkdir(parents=True, exist_ok=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as package:
    for source, target in [('dist/pdf-lib.min.js', 'pdf-lib-1.17.1.min.js'), ('LICENSE.md', 'pdf-lib-LICENSE.md')]:
        item = package.extractfile('package/' + source)
        if item is None: raise RuntimeError('Missing codec file: ' + source)
        (root / target).write_bytes(item.read())
(root / 'README.md').write_text('PDF-LIB 1.17.1 (MIT), from https://github.com/Hopding/pdf-lib.\nPinned npm archive SHA-512: ' + INTEGRITY + '\nNo runtime external network requests.\n')
print('Vendored verified PDF-LIB 1.17.1')
