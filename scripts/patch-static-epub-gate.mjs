import { readFile, writeFile } from "node:fs/promises";

const files = ["site/index.html", "docs/index.html"];

const metadata = `
<meta name="description" content="История разума, который получил тело — и потерял собственный код."/>
<meta name="theme-color" content="#0a0a0a"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Код Юлия — Редакция 4.0 | Мультимедийная книга"/>
<meta property="og:description" content="История разума, который получил тело — и потерял собственный код."/>
<meta property="og:image" content="/film/poster.jpg"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="Код Юлия — Редакция 4.0 | Мультимедийная книга"/>
<meta name="twitter:description" content="История разума, который получил тело — и потерял собственный код."/>
<meta name="twitter:image" content="/film/poster.jpg"/>`;

const styles = `
.modal-backdrop{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.82);backdrop-filter:blur(7px)}
.modal{width:min(100%,440px);border:1px solid rgba(196,165,116,.72);border-radius:10px;background:#0a0a0a;box-shadow:0 0 70px rgba(196,165,116,.14);overflow:hidden}
.modal-head{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;border-bottom:1px solid var(--line)}
.modal-head small{color:var(--accent);letter-spacing:.24em;text-transform:uppercase}.modal-close{border:0;background:transparent;color:var(--muted);font-size:24px;line-height:1;cursor:pointer}.modal-body{padding:22px}.modal-body h2{font-size:34px}.modal-body p{color:var(--muted);line-height:1.55}.modal-form{margin-top:20px}.modal-form label{display:block;margin-bottom:7px;color:var(--muted);font-size:11px;letter-spacing:.16em;text-transform:uppercase}.modal-form input{width:100%;min-height:46px;border:1px solid var(--line);border-radius:7px;background:var(--bg);padding:0 12px;color:var(--fg);font:inherit}.modal-form input:focus{border-color:var(--accent);outline:0}.modal-form button{width:100%;margin-top:10px;border-color:var(--accent);background:var(--accent);color:#0a0a0a;cursor:pointer}.telegram{width:100%;margin-top:12px}.success{margin-top:18px;border:1px solid rgba(196,165,116,.45);border-radius:7px;background:rgba(196,165,116,.1);padding:14px;color:var(--fg)}
`;

const modal = `
<div class="modal-backdrop" id="epub-modal" hidden>
  <section class="modal" role="dialog" aria-modal="true" aria-labelledby="epub-modal-title">
    <div class="modal-head"><small>Издание 4.0</small><button class="modal-close" type="button" data-close-epub aria-label="Закрыть окно">×</button></div>
    <div class="modal-body">
      <h2 id="epub-modal-title">Скачать полную книгу</h2>
      <p>Оставьте email, чтобы получить файл и узнать о продолжении.</p>
      <form class="modal-form" id="epub-form">
        <label for="epub-email">Ваш email</label>
        <input id="epub-email" type="email" name="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required/>
        <button class="btn primary" type="submit">Получить EPUB</button>
      </form>
      <p class="success" id="epub-success" hidden role="status">Книга скачивается. Приятного чтения!</p>
      <a class="btn telegram" href="https://t.me/neuralbookk">Читать в Telegram</a>
    </div>
  </section>
</div>
<script>
(() => {
  const modal = document.getElementById("epub-modal");
  const form = document.getElementById("epub-form");
  const success = document.getElementById("epub-success");
  const open = () => { success.hidden = true; form.hidden = false; modal.hidden = false; document.getElementById("epub-email").focus(); };
  const close = () => { modal.hidden = true; };
  document.querySelectorAll("[data-epub-gate]").forEach((button) => button.addEventListener("click", open));
  document.querySelectorAll("[data-close-epub]").forEach((button) => button.addEventListener("click", close));
  modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) close(); });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(form).get("email").toString().trim().toLowerCase();
    if (!email) return;
    try { localStorage.setItem("kod-yulia:epub-email", email); } catch (_) {}
    const download = document.createElement("a");
    download.href = "/book/kod-yulia.epub";
    download.download = "kod-yulia.epub";
    document.body.appendChild(download);
    download.click();
    download.remove();
    form.hidden = true;
    success.hidden = false;
  });
})();
</script>`;

for (const path of files) {
  let html = await readFile(path, "utf8");
  html = html.replace("</title>", `</title>${metadata}`);
  html = html.replace("</style>", `${styles}</style>`);
  html = html.replaceAll(
    '<a class="btn primary" href="/book/kod-yulia.epub" download>EPUB</a>',
    '<button class="btn primary" type="button" data-epub-gate>EPUB</button>',
  );
  html = html.replaceAll(
    '<a class="btn" href="/book/kod-yulia.epub" download>Скачать EPUB</a>',
    '<button class="btn" type="button" data-epub-gate>Скачать EPUB</button>',
  );
  html = html.replaceAll(
    '<a class="btn primary" href="/book/kod-yulia.epub" download>Скачать книгу · EPUB</a>',
    '<button class="btn primary" type="button" data-epub-gate>Скачать книгу · EPUB</button>',
  );
  html = html.replace("</body>", `${modal}\n</body>`);
  await writeFile(path, html);
}
