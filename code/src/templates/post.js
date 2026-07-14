export function postPage({ title, dateLabel, html }) {
  return `<article>
<header>
<h1>${title}</h1>
<span class="date">${dateLabel}</span>
</header>
${html}
<a class="back-link" href="/">← back to all posts</a>
</article>`;
}
