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
  header.site-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  header.site-header a.home {
    text-decoration: none;
    font-weight: 600;
    color: var(--fg);
  }
  header.site-header nav a {
    text-decoration: none;
    color: var(--muted);
    margin-left: 1rem;
    font-size: 0.9rem;
  }
  header.site-header nav a:hover { color: var(--fg); }
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

  section.topics, section.related {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }
  section.topics h2, section.related h2 {
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--muted);
    margin-bottom: 1rem;
  }
  .topic-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .topic-badge {
    font-size: 0.85rem;
    padding: 0.25rem 0.6rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--accent);
  }
  .topic-count { color: var(--muted); }
  section.related .post-list { margin: 0; }

  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  .favorite-card {
    display: block;
    text-decoration: none;
    color: var(--fg);
    padding: 1.25rem;
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .favorite-card:hover { border-color: var(--accent); }
  .favorite-card .date { display: block; font-size: 0.8rem; color: var(--muted); margin-bottom: 0.4rem; }
  .favorite-card h2 { font-size: 1.1rem; margin: 0 0 0.4rem; }
  .favorite-card .subtitle { font-size: 0.9rem; color: var(--muted); margin: 0 0 0.6rem; }
  .favorite-card .favorite-meta { font-size: 0.78rem; color: var(--muted); }
</style>
</head>
<body>
<header class="site-header">
<a class="home" href="/">← writing</a>
<nav><a href="/favorites/">Favorites</a></nav>
</header>
<main>
${body}
</main>
</body>
</html>
`;
}
