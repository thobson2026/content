export function postPage({
  title,
  dateLabel,
  html,
  wordCount,
  readingTime,
  topics = [],
  related = [],
}) {
  const meta = [dateLabel, wordCount ? `${wordCount} words` : "", readingTime ? `${readingTime}m read` : ""]
    .filter(Boolean)
    .join(" · ");

  const topicsHtml = topics.length
    ? `<section class="topics">
<h2>Related Topics</h2>
<div class="topic-badges">
${topics.map((t) => `<span class="topic-badge">${t.name}${t.count ? ` <span class="topic-count">${t.count}</span>` : ""}</span>`).join("\n")}
</div>
</section>`
    : "";

  const relatedHtml = related.length
    ? `<section class="related">
<h2>Related Essays</h2>
<ul class="post-list">
${related
  .map(
    (r) => `<li>
<span class="date">${r.dateLabel}</span>
<a href="${r.url}">${r.title}</a>
</li>`
  )
  .join("\n")}
</ul>
</section>`
    : "";

  return `<article>
<header>
<h1>${title}</h1>
<span class="date">${meta}</span>
</header>
${html}
${topicsHtml}
${relatedHtml}
<a class="back-link" href="/">← back to all posts</a>
</article>`;
}
