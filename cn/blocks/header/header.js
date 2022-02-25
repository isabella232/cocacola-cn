import { makeLinksRelative, decorateIcons } from '../../scripts/scripts.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

function collapseAllNavSections(sections) {
  sections.querySelectorAll('.nav-section').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}
function dynamicHeaderStyle(block) {
  const header = block.closest('header');
  const observer = new IntersectionObserver((entries) => {
    const isTop = entries[0].isIntersecting;
    if (isTop) header.classList.remove('compact');
    else header.classList.add('compact');
  }, { threshold: 0.5 });
  observer.observe(header);
}

function addSecondaryNav(block) {
  const a = block.querySelector(`.nav-section a[href="${window.location.pathname}"]`);
  if (a) {
    const section = a.closest('.nav-section');
    if (section.querySelector('ul')) {
      const hero = document.querySelector('div.block.hero');
      const secondaryNav = document.createElement('div');
      secondaryNav.classList.add('nav-secondary');
      secondaryNav.innerHTML = section.outerHTML;
      hero.parentElement.append(secondaryNav);
    }
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // fetch nav content
  const resp = await fetch(`${window.hlx.codeBasePath}/nav.plain.html`);
  const html = await resp.text();

  // decorate nav DOM
  const nav = document.createElement('div');
  nav.classList.add('nav');
  const navSections = document.createElement('div');
  navSections.classList.add('nav-sections');
  nav.innerHTML = html;
  decorateIcons(nav);
  makeLinksRelative(nav);
  nav.querySelectorAll(':scope > div').forEach((navSection, i) => {
    if (!i) {
      // first section is the brand section
      const brand = navSection;
      brand.classList.add('nav-brand');
    } else {
      // all other sections
      navSections.append(navSection);
      navSection.classList.add('nav-section');
      const h2 = navSection.querySelector('h2');
      if (h2) {
        h2.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          collapseAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      }
    }
  });
  nav.append(navSections);

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = '<div class="nav-hamburger-icon"></div>';
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    document.body.style.overflowY = expanded ? '' : 'hidden';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  block.append(nav);
  dynamicHeaderStyle(block);

  addSecondaryNav(block);
}
