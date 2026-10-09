# Publishing writing and recommended articles

The blog lives at `/blog`. The homepage displays the newest entry. The blog supports search, My writing and Reading list filters, and internal Markdown articles.

## Link to an existing article

Add an entry to `content/articles.json` with a unique slug, title, description, kind (`writing` for Quadri's work, `reading` for an article he recommends), author, source, HTTPS url, addedAt (`YYYY-MM-DD`), and tags. An optional publishedAt date records the real publication date. Do not invent dates, authorship, or recommendations. Entries sort by publication date when known, otherwise by addition date. The initial LinkedIn entry is a verified public post, not a new article published in October 2026.

## Publish on this site

Add `content/blog/a-descriptive-slug.md`:

```markdown
---
title: Your article title
description: A short summary
publishedAt: "2026-10-09"
tags: [Design practice]
draft: true
---

Your Markdown article goes here.
```

Set draft to false when the article is ready. The page is available at `/blog/a-descriptive-slug`, and its sitemap entry and metadata are generated automatically. Markdown is rendered without raw HTML. Commit and deploy after reviewing the content.

## Tool logos

OpenAI and Claude SVG marks are stored locally from the Lobe Icons static SVG distribution (`@lobehub/icons-static-svg`). They identify tools used by the designer and do not imply endorsement. The marks belong to their respective owners.
