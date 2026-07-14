export function layout({ title, description = "", body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
${description ? `<meta name="description" content="${description}">` : ""}
<style>
  :root {
    color-scheme: light dark;
    --fg: #1a1a1a;
    --bg: #ffffff;
    --muted: #666666;
    --accent: #444444;
    --border: #e5e5e5;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --fg: #e8e8e8;
      --bg: #121212;
      --muted: #9a9a9a;
      --accent: #cccccc;
      --border: #2a2a2a;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--fg);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Georgia, serif;
    line-height: 1.6;
  }
  main {
    max-width: 640px;
    margin: 0 auto;
    padding: 3rem 1.5rem 6rem;
  }
  a { color: var(--accent); }
  header.site-header {
    max-width: 640px;
    margin: 0 auto;
    padding: 2rem 1.5rem 0;
  }
  header.site-header a.home {
    text-decoration: none;
    font-weight: 600;
    color: var(--fg);
  }
  .post-list { list-style: none; padding: 0; margin: 2rem 0; }
  .post-list li { margin-bottom: 1.25rem; }
  .post-list .date {
    display: block;
    font-size: 0.85rem;
    color: var(--muted);
  }
  .post-list a { text-decoration: none; font-size: 1.05rem; }
  .post-list a:hover { text-decoration: underline; }
  article header { margin-bottom: 2rem; }
  article h1 { margin-bottom: 0.25rem; }
  article .date { color: var(--muted); font-size: 0.9rem; }
  .back-link { display: inline-block; margin-top: 3rem; font-size: 0.9rem; }
  pre { overflow-x: auto; padding: 1rem; background: var(--border); border-radius: 6px; }
  code { font-family: ui-monospace, Menlo, monospace; }
</style>
</head>
<body>
<header class="site-header"><a class="home" href="/">← writing</a></header>
<main>
${body}
</main>
</body>
</html>
`;
}
