// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrand = "All";

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectSortingType = document.querySelector('#sort-select');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

const sortProducts = ({sortingType}) => {
  const sortedProducts = [];
  if(sortingType == 'price-asc') {
    console.log('1');
    sortedProducts = currentProducts.sort(function compare(a,b) {
      if(a.price < b.price) return -1;
      if(a.price > b.price) return 1;
      return 0;
    });
  }
  if(sortingType == 'price-desc') {
    console.log('2');
    sortedProducts = currentProducts.sort(function compare(a,b) {
      if(a.price < b.price) return 1;
      if(a.price > b.price) return -1;
      return 0;
    });
  }
  if(sortingType == 'date-asc') {
    console.log('3');
    sortedProducts = currentProducts.sort(function compare(a,b) {
      if(a.released < b.released) return 1;
      if(a.released > b.released) return -1;
      return 0;
    });
  }
  if(sortingType == 'date-desc') {
    console.log('4');
    sortedProducts = currentProducts.sort(function compare(a,b) {
      if(a.released < b.released) return -1;
      if(a.released > b.released) return 1;
      return 0;
    });
  }
  setCurrentProducts({sortedProducts, currentPagination});
}

/**
 * Set global value
 * @param {String} brandSelection
 */
const setCurrentBrand = ({brandSelection}) => {
  currentBrand = brandSelection;
}

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand = currentBrand) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}` + (brand!=="All" ? `&brand=${brand}` : "")
    );

    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));
  
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the page to display
 */
selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), currentPagination.pageSize);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the brand to display
 */
selectBrand.addEventListener('change', async (event) => {
  setCurrentBrand(String(event.target.value));

  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectSortingType.addEventListener('change', async (event) => {
  console.log(String(event.target.value));
  sortProducts(String(event.target.value));
  render(currentProducts, currentPagination);
})