/* eslint-disable object-curly-newline */
import { toClassName } from '../../scripts/scripts.js';

function getAnimation(animations, width) {
  const idealBreakpoint = width < 600 ? 'mobile' : 'desktop';
  const animationIndex = animations.findIndex((e) => e.breakpoint === idealBreakpoint);
  const animation = animationIndex < 0 ? animations[0] : animations[animationIndex];
  return animation;
}

function createAnimation(animation) {
  const { breakpoint, poster, video, still } = animation;
  const div = document.createElement('div');
  div.className = `animation-${breakpoint}`;

  poster.className = 'animation-poster';
  div.append(poster);

  if (video) {
    const { pathname } = new URL(video);
    if (pathname.endsWith('.mp4')) {
      const observer = new IntersectionObserver((events) => {
        if (events.some((e) => e.isIntersecting)) {
          observer.disconnect();
          const vid = document.createElement('video');
          ['playsinline', 'loop', 'muted', 'autoplay'].forEach((p) => vid.setAttribute(p, ''));
          vid.innerHTML = `<source src="./${pathname}" type="video/mp4">`;
          div.append(vid);
          vid.classList.add('animation-unhide');
          vid.addEventListener('canplay', () => {
            vid.muted = true;
            vid.play();
          });
          if (still) {
            still.className = 'animation-still';
            div.append(still);
          }
        }
      });
      observer.observe(poster);
    }
  }

  return (div);
}

export default async function decorate(block) {
  const rows = [...block.children];
  const animations = [];
  rows.forEach((row) => {
    const [breakpoint, poster, video, still] = [...row.children].map((e, i) => {
      if (i === 0) return toClassName(e.textContent);
      if (i === 2) return e.textContent;
      return e;
    });
    animations.push({ poster, video, still, breakpoint });
  });
  block.textContent = '';
  block.append(createAnimation(getAnimation(animations, window.innerWidth)));
  window.addEventListener('resize', () => {
    const animation = getAnimation(animations, window.innerWidth);
    if (!block.querySelector(`.animation-${animation.breakpoint}`)) {
      block.textContent = '';
      block.append(createAnimation(animation));
    }
  });
  const section = block.closest('.section');
  const h1 = section.querySelector('h1');
  if (!block.parentElement.previousElementSibling && h1) {
    section.classList.add('hero-section');
  }
  if (h1 && h1.closest('.block')) {
    section.classList.add('hero-section-wide');
  }
}
