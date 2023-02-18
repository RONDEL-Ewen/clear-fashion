const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  var current_date = new Date();
  var formated_date = current_date.getDate() + "/" + 
                      (current_date.getMonth() + 1) + "/" + 
                      current_date.getFullYear();

  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ')
        .toUpperCase();
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );
      const brand = 'DEDICATED';
      const link = 'https://www.dedicatedbrand.com' +
        $(element)
          .find('.productList-link')
          .attr('href');
      /*
      const image = $(element)
        .find('.productList-link .productList-image .js-lazy')
        .find('.js-lazy entered loaded')
        .attr('src');
      */
      const date = formated_date;

      return {name, price, brand, link, date};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
