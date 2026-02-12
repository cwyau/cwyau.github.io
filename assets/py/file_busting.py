import os
import re
import subprocess

HASHES = {}
ASSET_FOLDER = 'assets'
HOST = r'''(?P<HOST>(?:cwyau.hk|www.cwyau.hk|localhost:4000|))'''
PATH = rf'''(?P<PATH>{ASSET_FOLDER}\/[^"\']+)'''
EXT = (
    r'(?P<EXTN>'
    r'7z|avi|avif|apk|bin|bmp|bz2|class|css|csv|doc|docx|dmg|ejs|eot|eps|exe|'
    r'flac|gif|gz|ico|iso|jar|jpg|jpeg|js|mid|midi|mkv|mp3|mp4|ogg|otf|pdf|'
    r'pict|pls|png|ppt|pptx|ps|rar|svg|svgz|swf|tar|tif|tiff|ttf|webm|webp|'
    r'woff|woff2|xls|xlsx|zip|zst)'
)

# "http://localhost:4000/assets/images/bio.webp?h=9ae2b76"
p0 = re.compile(rf'''(?P<p1>["\']((?:http|https)://)?{HOST}/)(?P<p2>{PATH}.{EXT})(?P<p3>["\'])''')
# <meta property="og:image" content="https://cwyau.hk/assets/images/bio.webp">
p1 = re.compile(rf'''(?P<p1><meta\s+[^>]*?content=["\'][^"\']*/)(?P<p2>{PATH}\.{EXT})(?P<p3>["\'][^>]*>)''')
# <script type="application/ld+json"> { ... "image": "http://cwyau.hk/assets/images/bio.webp" ... }</script>
p2 = re.compile(rf'''<script\s+type=["\']application/ld\+json["\']>.*?</script>''', re.DOTALL)
# <img src="/assets/images/qr_code/qr_youtube.webp">
# <script src="/assets/js/main.min.js">
# <link ... href="/assets/webfonts/fa-regular-400.woff2" ...>
p3 = re.compile(rf'''(?P<p1>(?:href|src)=["\']/)(?P<p2>{PATH}\.{EXT})(?P<p3>["\'])''')
# < ... style="... url('/assets/images/banner/home-2048.webp'); --bg-src-md: url('/assets/images/banner/home-1024.webp');">
p4 = re.compile(r'''<[^>]*?style=["\'][^"\']*url\([^\)]*?\)[^"\']*["\'][^>]*>''')

def replacer(match):
    def _replacer(match):
        print(match)
        p1 = match.group('p1')
        p2 = match.group('p2')
        p3 = match.group('p3')

        if (h := HASHES.get(p2)) or (p2.endswith('.css') and (h := HASHES.get(f'{p2[:-4]}.scss'))):
            return f'{p1}{p2}?h={h}{p3}'
        else:
            return match.group(0)
    if 'p1' in match.groupdict():
        return _replacer(match)
    else:
        return p0.sub(_replacer, match.group(0))

cmd = ['git', 'log', '--format=%h', '--name-only', '--', ASSET_FOLDER]
for line in subprocess.check_output(cmd, text=True).splitlines():
    if re.match(r'[a-f0-9]{6}', line):
        last_hash = line
    elif re.match(rf'^{ASSET_FOLDER}', line):
        HASHES[line] = last_hash

for root, dirs, files in os.walk('_site'):
    for file in files:
        if not file.endswith('.html'):
            continue
        path = os.path.join(root, file)

        with open(path, 'r') as f:
            content = f.read()

        # for pattern in [p1, p2, p3, p4]:
        for pattern in [p4]:
            content = pattern.sub(replacer, content)

        with open(path, 'w') as f:
            f.write(content)