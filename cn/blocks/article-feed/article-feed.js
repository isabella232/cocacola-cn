import { createOptimizedPicture, lookupPages, readBlockConfig } from '../../scripts/scripts.js';

function createCard(row, style) {
  const card = document.createElement('a');
  card.href = row.path;
  card.classList.add('article-card');
  if (style) card.classList.add(style);

  card.innerHTML = `<h2>${row.title}</h2>`;
  card.prepend(createOptimizedPicture(row.image, row.title));
  return (card);
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const featured = Array.isArray(config.featured) ? config.featured : [config.featured];
  const pathnames = featured.map((link) => new URL(link).pathname);
  block.textContent = '';
  const featuredArticles = await lookupPages(pathnames);
  featuredArticles.forEach((row) => {
    block.append(createCard(row, 'featured'));
  });
  const allArticles = window.pageIndex.data;
  const remaining = allArticles.filter((e) => !pathnames.includes(e.path) && e.path.includes('/news/'));
  for (let i = 0; i < Math.min(+config.limit - featuredArticles.length, remaining.length); i += 1) {
    const row = remaining[i];
    block.append(createCard(row));
  }
}
