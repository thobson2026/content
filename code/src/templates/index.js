export function indexPage({ posts }) {
  const items = posts
    .map(
      (p) => `<li>
<span class="date">${p.dateLabel}</span>
<a href="${p.url}">${p.title}</a>
</li>`
    )
    .join("\n");

  return `<ul class="post-list">
${items}
</ul>`;
}
