import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

import { layout } from "./src/templates/layout.js";
import { postPage } from "./src/templates/post.js";
import { indexPage } from "./src/templates/index.js";
import { favoritesPage } from "./src/templates/favorites.js";

const WORDS_PER_MINUTE = 200;
const MAX_RELATED = 5;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLISH_DIR = path.join(ROOT, "publish");
const DIST_DIR = path.join(ROOT, "dist");
const CONTENT_DIRS = ["essays", "logs"];

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify);

function walkMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

function slugFromFilename(filePath) {
  return path
    .basename(filePath, ".md")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseDate(frontmatter) {
  const raw = frontmatter.date || frontmatter.time;
  const d = raw ? new Date(raw) : null;
  return d && !isNaN(d) ? d : null;
}

function formatDateLabel(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function rimraf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function countWords(markdown) {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`~\-\[\]()!]/g, " ");
  const words = stripped.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function parseTopics(frontmatter) {
  const raw = frontmatter.topics;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String);
  return String(raw)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function relatedEssays(post, allEssays) {
  if (post.topics.length === 0) return [];
  const scored = allEssays
    .filter((other) => other.slug !== post.slug)
    .map((other) => {
      const shared = other.topics.filter((t) => post.topics.includes(t));
      return { post: other, sharedCount: shared.length };
    })
    .filter((entry) => entry.sharedCount > 0);

  scored.sort((a, b) => {
    if (b.sharedCount !== a.sharedCount) return b.sharedCount - a.sharedCount;
    return (b.post.date?.getTime() || 0) - (a.post.date?.getTime() || 0);
  });

  return scored.slice(0, MAX_RELATED).map((entry) => entry.post);
}

async function build() {
  rimraf(DIST_DIR);
  fs.mkdirSync(DIST_DIR, { recursive: true });

  const posts = [];

  for (const contentDir of CONTENT_DIRS) {
    const files = walkMarkdownFiles(path.join(PUBLISH_DIR, contentDir));
    for (const file of files) {
      const raw = fs.readFileSync(file, "utf-8");
      const { data, content } = matter(raw);

      const slug = slugFromFilename(file);
      const date = parseDate(data);
      const title = data.title || slugFromFilename(file).replace(/-/g, " ");
      const wordCount = countWords(content);

      const htmlTree = await processor.process(content);
      const bodyHtml = String(htmlTree);

      posts.push({
        slug,
        title,
        date,
        dateLabel: formatDateLabel(date),
        bodyHtml,
        description: data.description || "",
        section: contentDir, // "essays" or "logs"
        topics: parseTopics(data),
        wordCount,
        readingTime: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
      });
    }
  }

  // newest first; undated posts sort last
  posts.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

  const essays = posts.filter((p) => p.section === "essays");

  const topicCounts = {};
  for (const essay of essays) {
    for (const topic of essay.topics) {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    }
  }

  for (const post of posts) {
    const outDir = path.join(DIST_DIR, post.slug);
    fs.mkdirSync(outDir, { recursive: true });
    const related =
      post.section === "essays" ? relatedEssays(post, essays) : [];
    const html = layout({
      title: post.title,
      description: post.description,
      body: postPage({
        title: post.title,
        dateLabel: post.dateLabel,
        html: post.bodyHtml,
        wordCount: post.wordCount,
        readingTime: post.readingTime,
        topics: post.topics.map((t) => ({ name: t, count: topicCounts[t] || 0 })),
        related: related.map((r) => ({
          title: r.title,
          dateLabel: r.dateLabel,
          url: `/${r.slug}/`,
        })),
      }),
    });
    fs.writeFileSync(path.join(outDir, "index.html"), html);
  }

  const homeHtml = layout({
    title: "writing",
    body: indexPage({
      posts: posts.map((p) => ({
        title: p.title,
        dateLabel: p.dateLabel,
        url: `/${p.slug}/`,
      })),
    }),
  });
  fs.writeFileSync(path.join(DIST_DIR, "index.html"), homeHtml);

  const favoritesDir = path.join(DIST_DIR, "favorites");
  fs.mkdirSync(favoritesDir, { recursive: true });
  const favoritesHtml = layout({
    title: "favorites — writing",
    body: favoritesPage({
      posts: essays.map((p) => ({
        title: p.title,
        dateLabel: p.dateLabel,
        description: p.description,
        wordCount: p.wordCount,
        readingTime: p.readingTime,
        url: `/${p.slug}/`,
      })),
    }),
  });
  fs.writeFileSync(path.join(favoritesDir, "index.html"), favoritesHtml);

  copyDir(path.join(PUBLISH_DIR, "assets"), path.join(DIST_DIR, "assets"));

  console.log(`Built ${posts.length} post(s) to ${DIST_DIR}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
