export default async function decorateArticleHeader(block) {
  const styles = ['article-title', 'article-info', 'article-picture'];
  styles.forEach((style, i) => {
    if (block.children[i]) block.children[i].classList.add(style);
  });

  const infoStyles = ['article-readtime', 'article-publication-date'];
  const infos = [...block.querySelectorAll('.article-info p')];
  infoStyles.forEach((style, i) => {
    if (infos[i]) infos[i].classList.add(style);
  });
}
