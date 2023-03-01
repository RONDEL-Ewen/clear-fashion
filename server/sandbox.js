/* eslint-disable no-console, no-process-exit */
const fs = require('fs');

const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimart = require('./eshops/montlimart');
const circlesportswear = require('./eshops/circlesportswear');

async function sandbox() {
  try {
    console.log(`🕵️‍♀️  browsing...`);

    const eshop1 = 'https://www.dedicatedbrand.com/en/men/all-men';
    const eshop2 = 'https://www.montlimart.com/99-vetements';
    const eshop3 = 'https://shop.circlesportswear.com/collections/collection-homme';

    const products1 = await dedicatedbrand.scrape(eshop1);
    const products2 = await montlimart.scrape(eshop2);
    const products3 = await circlesportswear.scrape(eshop3);

    const products = (products1.concat(products2)).concat(products3);

    console.log(products);
    console.log('done');

    const json_data = JSON.stringify(products);
    fs.writeFileSync('products.json', json_data);

    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
