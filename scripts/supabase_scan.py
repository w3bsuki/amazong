from pathlib import Path
root = Path('J:/amazong')
paths = 'app lib hooks components'.split()
froms = set()
rpcs = set()

def extract(text, keyword):
    idx = 0
    names = set()
    while True:
        pos = text.find(keyword, idx)
        if pos == -1:
            break
        start = pos + len(keyword)
        if start >= len(text):
            break
        quote = text[start]
        if quote not in ('"', "'"):
            idx = start
            continue
        i = start + 1
        name_chars = []
        while i < len(text):
            ch = text[i]
            if ch == '\\' and i + 1 < len(text):
                i += 2
                continue
            if ch == quote:
                break
            name_chars.append(ch)
            i += 1
        if name_chars:
            names.add(''.join(name_chars))
        idx = i + 1
    return names

for p in paths:
    base = root / p
    if not base.exists():
        continue
    for path in base.rglob('*'):
        if path.is_file():
            try:
                text = path.read_text(encoding='utf-8')
            except Exception:
                continue
            froms.update(extract(text, '.from('))
            rpcs.update(extract(text, '.rpc('))
print('TABLES:')
for name in sorted(froms):
    print(name)
print('\nRPCS:')
for name in sorted(rpcs):
    print(name)
