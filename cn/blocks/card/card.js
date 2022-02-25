export default async function decorate(block) {
  if ([...block.classList].includes('horizontal')) {
    block.firstChild.firstChild.classList.add('card-header');
    block.firstChild.lastChild.classList.add('card-body');
  }
}
