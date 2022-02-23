import { loadPage } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const template = block.querySelector(':scope > div > div:nth-of-type(2)').textContent || '..';
  const parent = await fetch(new URL(`${template}/${window.location.pathname.split('/').slice(-2, -1)[0]}.plain.html`, window.location.href));
  const blocks = document.querySelectorAll('.block');
  blocks.forEach((bl) => {
    bl.dataset.blockStatus = '';
    bl.classList.remove('block');
  });

  window.contents = document.body.innerHTML;
  const newbody = await parent.text();
  const main = document.querySelector('main');
  main.innerHTML = newbody;
  await loadPage(document);
}
