import { decoratePictures } from '../../scripts/scripts.js';

function centerSelected(carousel) {
  const products = [...carousel.children];
  const index = products.findIndex((e) => e.classList.contains('selected'));
  const targetIndex = Math.floor((products.length - 1) / 2);
  let delta = targetIndex - index;
  while (delta) {
    if (delta > 0) {
      carousel.prepend(carousel.lastChild);
      delta -= 1;
    } else {
      carousel.append(carousel.firstChild);
      delta += 1;
    }
  }
  const centeredProducts = [...carousel.children];
  centeredProducts.forEach((product, i) => {
    if ((i > targetIndex - 3) && (i < targetIndex + 3)) {
      product.classList.remove('hidden');
    } else {
      product.classList.add('hidden');
    }
  });

  if (products.length === 1) {
    carousel.classList.add('single');
  }

  if (products.length === 2) {
    carousel.classList.add('double');
  }

  if (products.length > 2) {
    carousel.classList.add('many');
  }
}

function showHidePanels(block, spans) {
  spans.forEach((span) => {
    const panel = block.querySelector(`.${span.dataset.target}`);
    if (span.classList.contains('selected')) panel.classList.remove('hidden');
    else panel.classList.add('hidden');
  });
}

function selectProduct(block, id, products) {
  const carousel = block.querySelector('.products-carousel');
  block.querySelectorAll('.products-carousel-product').forEach((a) => a.classList.remove('selected'));
  document.getElementById(id).classList.add('selected');
  centerSelected(carousel);
  const productInfo = block.querySelector('.products-info');
  const selectedPath = carousel.querySelector('.selected').dataset.path;
  const selectedProduct = products.querySelector(`[data-path="${selectedPath}"]`);
  const title = selectedProduct.querySelector('h1').textContent;
  document.title = title;
  const ps = selectedProduct.querySelectorAll(':scope > div > p');
  let description = '';
  ps.forEach((p) => {
    if (p.textContent) description = p.textContent;
  });
  productInfo.innerHTML = `<div class="products-description"><h2>${title}</h2><p>${description}</p></div>
  <div class="products-details"><div class="products-details-switcher"><span data-target="nutrition-facts" class="selected">Nutrition</span><span data-target="ingredients">Ingredients</span></div></div>`;
  const productDetails = productInfo.querySelector('.products-details');
  productDetails.append(selectedProduct.querySelector('.nutrition-facts').cloneNode(true));
  productDetails.append(selectedProduct.querySelector('.ingredients').cloneNode(true));
  const spans = productInfo.querySelectorAll('.products-details-switcher span');
  spans.forEach((span) => {
    span.addEventListener('click', () => {
      spans.forEach((sp) => sp.classList.remove('selected'));
      span.classList.add('selected');
      showHidePanels(block, spans);
    });
  });
  showHidePanels(block, spans);
}

export default async function decorate(block) {
  const as = [...block.querySelectorAll('a')];
  const products = document.createElement('main');
  block.textContent = '';
  const productname = window.location.href.split('/').pop();
  if (window.contents) {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = window.contents;
    div.dataset.path = window.location;
    decoratePictures(div);
    products.append(div);
  } else {
    const firstProductURL = new URL(as[0].href);
    // forward to the first product in the brand
    window.location = new URL(firstProductURL.pathname, window.location.href);
  }

  const carousel = document.createElement('div');
  carousel.className = 'products-carousel';
  const parser = new DOMParser();

  await Promise.all(as
    .map((a) => fetch(a.href))
    .filter(async (resp) => resp.ok)
    .map(async (resp) => {
      const body = await (await resp).text();
      const path = (await resp).url;
      const doc = parser.parseFromString(body, 'text/html');
      const image = new URL(doc.querySelector('meta[property="og:image"]').getAttribute('content'));
      const imageurl = new URL(image.pathname, window.location.href);

      const picture = document.createElement('picture');

      const img = document.createElement('img');
      img.src = imageurl.href;

      const a = document.createElement('a');
      a.id = `product-${path.split('/').pop()}`;
      a.href = path.split('/').pop();
      a.className = 'products-carousel-product';
      a.dataset.path = path;

      picture.append(img);
      a.append(picture);
      decoratePictures(a);
      carousel.append(a);

      if (window.location.href !== path) {
        // stash that content
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = doc.body.innerHTML;
        div.dataset.path = path;
        decoratePictures(div);
        products.append(div);
      }

      a.onclick = (e) => {
        e.preventDefault();
        window.history.pushState({ product: a.id }, '', a.href);
        selectProduct(block, a.id, products);
      };

      return a;
    }));

  block.append(carousel);

  window.onpopstate = ({ state }) => {
    selectProduct(block, state.product, products);
  };

  const productInfo = document.createElement('div');
  productInfo.className = 'products-info';
  block.append(productInfo);
  selectProduct(block, `product-${productname}`, products);
}
