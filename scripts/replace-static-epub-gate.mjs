import { readFile, writeFile } from "node:fs/promises";

const files = ["site/index.html", "docs/index.html"];
const telegramUrl = "https://t.me/neuralbookk";

for (const path of files) {
  let html = await readFile(path, "utf8");
  const modalStart = html.indexOf('<div class="modal-backdrop" id="epub-modal" hidden>');

  if (modalStart !== -1) {
    const scriptEnd = html.indexOf("</script>", modalStart);
    if (scriptEnd === -1) throw new Error(`Cannot locate legacy modal script in ${path}`);
    html = `${html.slice(0, modalStart)}${html.slice(scriptEnd + "</script>".length)}`;
  }

  html = html
    .replaceAll(
      '<button class="btn primary" type="button" data-epub-gate>EPUB</button>',
      `<a class="btn primary" href="${telegramUrl}">Книга в Telegram</a>`,
    )
    .replaceAll(
      '<button class="btn" type="button" data-epub-gate>Скачать EPUB</button>',
      `<a class="btn" href="${telegramUrl}">Забрать книгу в Telegram</a>`,
    )
    .replaceAll(
      '<button class="btn primary" type="button" data-epub-gate>Скачать книгу · EPUB</button>',
      `<a class="btn primary" href="${telegramUrl}">Подписаться и забрать книгу</a>`,
    );

  await writeFile(path, html);
}
