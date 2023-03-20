/*
function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}
*/

function create_UUID() {
  const characters = 'abcdef0123456789';
  let uuid = '';

  for (let i = 0; i < 24; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uuid += characters[randomIndex];
  }

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

  return $('.products-list__block')
    .map((i, element) => {
      const name = $(element)
        .find('.text-reset')
        .text()
        .toUpperCase();
      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );
      const brand = 'Montlimart';
      const link = $(element)
        .find('.text-reset')
        .attr('href');
      const image = $(element)
        .find('.w-100')
        .attr('data-full-size-image-url');
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
