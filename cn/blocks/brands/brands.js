import { getMetadataJson, createOptimizedPicture } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const as = [...block.querySelectorAll('a')];
  block.textContent = '';
  for (let i = 0; i < as.length; i += 1) {
    const a = as[i];
    const brandLink = new URL(a.href).pathname;
    // eslint-disable-next-line no-await-in-loop
    const meta = JSON.parse(await getMetadataJson(brandLink));
    const picture = createOptimizedPicture(meta['og:image']);
    const card = document.createElement('a');
    card.className = 'brands-card';
    card.href = brandLink;
    card.innerHTML = `${picture.outerHTML}
    <div class="brands-card-body">
      <h3>${meta['og:title']}</h3>
      <p>${meta.description}</p>
    </div>`;
    block.append(card);
  }
}
