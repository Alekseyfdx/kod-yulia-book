#!/usr/bin/env python3
"""Pack Код Юлия into a valid EPUB 3 (author text + chapter images)."""
from __future__ import annotations

import re
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path("/workspace")
BOOK_TS = ROOT / "src/data/book.ts"
IMG = ROOT / "public/book/images"
OUT = ROOT / "artifacts/kod-yulia.epub"


def parse_book() -> tuple[dict, list[dict]]:
    t = BOOK_TS.read_text(encoding="utf-8")
    meta = {
        "title": re.search(r'title: "([^"]+)"', t).group(1),
        "author": re.search(r'author: "([^"]+)"', t).group(1),
        "edition": re.search(r'edition: "([^"]+)"', t).group(1),
        "subtitle": re.search(r'subtitle: "([^"]+)"', t).group(1),
    }
    chapters: list[dict] = []
    parts = re.split(r"\n  \{\n    id: ", t)[1:]
    for part in parts:
        if not part.startswith('"0') and not part.startswith('"1'):
            continue
        cid = part[1:3]
        if not cid.isdigit():
            continue
        title = re.search(r'title: "([^"]+)"', part)
        line = re.search(r'line: "([^"]+)"', part)
        epigraph = re.search(r'epigraph: "([^"]+)"', part)
        image = re.search(r'image: "([^"]+)"', part)
        body = part.split("paragraphs: [", 1)
        if len(body) < 2:
            continue
        rest = body[1].split("\n    ],", 1)[0]
        paras = []
        for kind, text in re.findall(r'kind: "(p|dialog|log)", text: `([^`]*)`', rest):
            paras.append({"kind": kind, "text": text})
        if not title:
            continue
        chapters.append(
            {
                "id": cid,
                "title": title.group(1),
                "line": line.group(1) if line else "",
                "epigraph": epigraph.group(1) if epigraph else "",
                "image": image.group(1) if image else "",
                "paragraphs": paras,
            }
        )
    return meta, chapters


def html_para(p: dict) -> str:
    text = escape(p["text"]).replace("\n", "<br/>")
    cls = p["kind"]
    return f'<p class="{cls}">{text}</p>'


def chapter_xhtml(ch: dict, img_name: str | None) -> str:
    blocks = "\n".join(html_para(p) for p in ch["paragraphs"])
    fig = ""
    if img_name:
        fig = f'<figure><img src="{img_name}" alt="{escape(ch["title"])}"/></figure>'
    return f"""<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru" lang="ru">
<head>
  <meta charset="utf-8"/>
  <title>Глава {ch["id"]}. {escape(ch["title"])}</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <article>
    <p class="epi">{escape(ch["epigraph"])}</p>
    <p class="num">Глава {ch["id"]}</p>
    <h1>{escape(ch["title"])}</h1>
    <p class="line">{escape(ch["line"])}</p>
    {fig}
    {blocks}
  </article>
</body>
</html>
"""


NAV = """<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ru" lang="ru">
<head><meta charset="utf-8"/><title>Оглавление</title><link rel="stylesheet" href="style.css"/></head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Код Юлия</h1>
    <ol>
      <li><a href="title.xhtml">Титул</a></li>
{items}
      <li><a href="end.xhtml">Продолжение следует…</a></li>
    </ol>
  </nav>
</body>
</html>
"""

TITLE = """<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru" lang="ru">
<head><meta charset="utf-8"/><title>{title}</title><link rel="stylesheet" href="style.css"/></head>
<body class="title">
  <p class="epi">{edition}</p>
  <h1>{title}</h1>
  <p class="line">{subtitle}</p>
  <p>{author}</p>
  <figure><img src="cover.jpg" alt="{title}"/></figure>
</body>
</html>
"""

END = """<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru" lang="ru">
<head><meta charset="utf-8"/><title>Продолжение следует…</title><link rel="stylesheet" href="style.css"/></head>
<body class="title">
  <p class="epi">Код Юлия</p>
  <h1>Продолжение следует…</h1>
  <p class="line">YU-7 больше нет. Осталась только Юля.</p>
</body>
</html>
"""

CSS = """
body { font-family: Georgia, "Times New Roman", serif; font-size: 1.15em; line-height: 1.7; color: #1a1a1a; margin: 1.2em; }
h1 { font-size: 1.8em; font-weight: 500; line-height: 1.25; margin: 0.2em 0 0.6em; }
p { margin: 0 0 0.9em; }
p.epi { font-size: 0.8em; letter-spacing: 0.12em; text-transform: uppercase; color: #555; }
p.num { font-size: 0.85em; letter-spacing: 0.14em; text-transform: uppercase; color: #3d5c58; }
p.line { font-style: italic; color: #333; }
p.dialog { padding-left: 0.8em; border-left: 1px solid #ccc; }
p.log { font-family: "Courier New", monospace; font-size: 0.9em; background: #f3f3f0; padding: 0.6em 0.8em; }
figure { margin: 1em 0; }
img { max-width: 100%; height: auto; }
body.title { text-align: center; padding-top: 2em; }
"""


def build() -> Path:
    meta, chapters = parse_book()
    assert len(chapters) == 10, f"expected 10 chapters, got {len(chapters)}"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    if OUT.exists():
        OUT.unlink()

    manifest = [
        '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
        '<item id="css" href="style.css" media-type="text/css"/>',
        '<item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>',
        '<item id="end" href="end.xhtml" media-type="application/xhtml+xml"/>',
        '<item id="cover-img" href="cover.jpg" media-type="image/jpeg" properties="cover-image"/>',
    ]
    spine = ['<itemref idref="title"/>']
    nav_items = []
    files: dict[str, bytes] = {}

    cover_src = IMG / "cover-kod-yulia.jpg"
    files["OEBPS/cover.jpg"] = cover_src.read_bytes()

    for ch in chapters:
        href = f"ch-{ch['id']}.xhtml"
        img_href = None
        src_name = Path(ch["image"]).name if ch["image"] else ""
        src = IMG / src_name if src_name else None
        if src and src.exists():
            img_href = f"img-{ch['id']}.jpg"
            files[f"OEBPS/{img_href}"] = src.read_bytes()
            manifest.append(
                f'<item id="img-{ch["id"]}" href="{img_href}" media-type="image/jpeg"/>'
            )
        files[f"OEBPS/{href}"] = chapter_xhtml(ch, img_href).encode("utf-8")
        manifest.append(
            f'<item id="ch{ch["id"]}" href="{href}" media-type="application/xhtml+xml"/>'
        )
        spine.append(f'<itemref idref="ch{ch["id"]}"/>')
        nav_items.append(
            f'      <li><a href="{href}">Глава {ch["id"]}. {escape(ch["title"])}</a></li>'
        )

    spine.append('<itemref idref="end"/>')
    files["OEBPS/nav.xhtml"] = NAV.replace("{items}", "\n".join(nav_items)).encode("utf-8")
    files["OEBPS/title.xhtml"] = TITLE.format(
        title=escape(meta["title"]),
        edition=escape(meta["edition"]),
        subtitle=escape(meta["subtitle"]),
        author=escape(meta["author"]),
    ).encode("utf-8")
    files["OEBPS/end.xhtml"] = END.encode("utf-8")
    files["OEBPS/style.css"] = CSS.encode("utf-8")

    opf = f"""<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="3.0" xml:lang="ru">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:uuid:6b0c0c2e-4a11-4f2c-9c8a-kod-yulia-40</dc:identifier>
    <dc:title>{escape(meta["title"])}</dc:title>
    <dc:creator>{escape(meta["author"])}</dc:creator>
    <dc:language>ru</dc:language>
    <dc:publisher>{escape(meta["edition"])}</dc:publisher>
    <dc:description>{escape(meta["subtitle"])}</dc:description>
    <meta property="dcterms:modified">2026-08-15T12:00:00Z</meta>
    <meta name="cover" content="cover-img"/>
  </metadata>
  <manifest>
    {chr(10).join(manifest)}
  </manifest>
  <spine>
    {chr(10).join(spine)}
  </spine>
</package>
"""
    files["OEBPS/content.opf"] = opf.encode("utf-8")
    files["META-INF/container.xml"] = (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n'
        "  <rootfiles>\n"
        '    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>\n'
        "  </rootfiles>\n"
        "</container>\n"
    ).encode("utf-8")

    with zipfile.ZipFile(OUT, "w") as z:
        z.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        for name, data in files.items():
            z.writestr(name, data, compress_type=zipfile.ZIP_DEFLATED)

    return OUT


if __name__ == "__main__":
    path = build()
    print(f"wrote {path} ({path.stat().st_size} bytes)")
