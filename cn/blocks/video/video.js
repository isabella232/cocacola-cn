export default function decorate(block) {
  const poster = block.querySelector('img') ? `poster="${block.querySelector('img').src}"` : '';
  const a = block.querySelector('a');
  block.textContent = '';
  const videoSrc = a.href;
  const video = document.createElement('div');
  video.classList.add('video-wrapper');
  video.innerHTML = `<video controls preload="none" ${poster}>
    <source src="${videoSrc}" type="video/mp4">
  </video>`;
  block.innerHTML = '<figure class="figure"></figure>';
  block.append(video);
}
