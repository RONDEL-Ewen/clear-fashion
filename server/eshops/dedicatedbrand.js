function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

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

  return $('#filterItems .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseFloat($(element)
        .find('.productList-price')
        .text());
      const brand = "Dedicated";
      const link = "https://www.dedicatedbrand.com" + $(element)
        .find('.productList-link')
        .attr('href');
      const image = $(element)
        .find('.productList-image img')[0]
        .attribs['data-src'];
      const date = formated_date;
      const uuid = create_UUID();

      return {name, price, brand, link, image, date, uuid};
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
