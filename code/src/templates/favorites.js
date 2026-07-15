export function favoritesPage({ posts }) {
  if (posts.length === 0) {
    return `<h1>Favorites</h1><p>No essays yet — add some to <code>publish/essays/</code>.</p>`;
  }

  const cards = posts
    .map(
      (p) => `<a class="favorite-card" href="${p.url}">
<span class="date">${p.dateLabel}</span>
<h2>${p.title}</h2>
${p.description ? `<p class="subtitle">${p.description}</p>` : ""}
<span class="favorite-meta">${p.wordCount} words · ${p.readingTime}m read</span>
</a>`
    )
    .join("\n");

  return `<h1>Favorites</h1>
<div class="favorites-grid">
${cards}
</div>`;
}
