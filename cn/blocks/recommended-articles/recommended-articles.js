import { createOptimizedPicture, lookupPages } from '../../scripts/scripts.js';

function createCard(row, style) {
  const card = document.createElement('a');
  card.href = row.path;
  card.classList.add('article-card');
  if (style) card.classList.add(style);

  card.innerHTML = `<h3>${row.title}</h3>`;
  card.prepend(createOptimizedPicture(row.image, row.title));
  return (card);
}

export default async function decorate(block) {
  const pathnames = [...block.querySelectorAll('a')].map((a) => new URL(a.href).pathname);
  block.textContent = '';
  const recommendedArticles = await lookupPages(pathnames);
  if (recommendedArticles.length) {
    recommendedArticles.forEach((row) => {
      block.append(createCard(row, 'recommended'));
    });
  } else {
    block.remove();
  }
}
