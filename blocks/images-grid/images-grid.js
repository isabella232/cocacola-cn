export default function decorate(block) {
  block.querySelectorAll(':scope > div').forEach((row) => {
    const cells = [...row.children];
    const picture = cells[0].querySelector('picture');
    picture.classList.add('bg-picture');
    const overlay = cells[1];
    const styleHints = cells[2].textContent.split(',').map((e) => e.toLowerCase().trim()).filter((e) => e !== '');
    overlay.classList.add('overlay');
    cells[2].textContent = '';
    styleHints.push('row');
    row.classList.add(...styleHints);
  });
}
