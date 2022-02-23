export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const hasPicture = !!cell.querySelector('picture');
      cell.classList.add(hasPicture ? 'image' : 'content');
      if (!hasPicture) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('content-wrapper');
        row.insertBefore(wrapper, cell);
        wrapper.append(cell);
      }
    });
  });
}
