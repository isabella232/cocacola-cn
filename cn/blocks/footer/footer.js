import { decorateIcons } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const resp = await fetch(`${window.hlx.codeBasePath}/footer.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;
  decorateIcons(footer);
  const sections = ['brand', 'links', 'social', 'rights'];
  sections.forEach((e, i) => {
    footer.children[i].classList.add(e);
  });
  block.append(footer);
}
