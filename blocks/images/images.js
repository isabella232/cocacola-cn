import { buildFigure } from '../../scripts/scripts.js';

function buildColumns(row, count) {
  const columns = Array.from(row.children);
  columns.forEach((column) => {
    const figure = buildFigure(column);
    column.remove();
    row.append(figure);
  });
  row.classList.add('images-list', `images-list-${count}`);
}

export default function decorateImages(blockEl) {
  const blockCount = blockEl.firstChild.childElementCount;
  if (blockCount > 1) {
    buildColumns(blockEl.firstChild, blockCount);
  } else {
    const figure = buildFigure(blockEl.firstChild.firstChild);
    blockEl.innerHTML = '';
    blockEl.append(figure);
  }
}
