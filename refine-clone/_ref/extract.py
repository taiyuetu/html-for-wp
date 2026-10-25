import re
raw = open('listpage.html', encoding='utf-8').read()
i = raw.find('projects = [')
seg = raw[i:i+90000]
chunks = re.split(r'\{\s*id:', seg)
print('chunks', len(chunks))
for c in chunks[1:40]:
    name = re.search(r"name:\s*'([^']+)'", c)
    year = re.search(r"year:\s*'([^']+)'", c)
    taxs = re.search(r"taxs:\s*\[(.*?)\]", c, re.S)
    tags = []
    if taxs:
        for t in re.findall(r"'([^']+)'", taxs.group(1)):
            if t not in tags:
                tags.append(t)
    if name:
        print((year.group(1) if year else '?'), '|', name.group(1), '|', ', '.join(tags))
