/* eslint-disable no-console, no-process-exit */
const fs = require('fs');

const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimart = require('./eshops/montlimart');
const circlesportswear = require('./eshops/circlesportswear');

async function sandbox() {
  try {
    console.log(`[Scraping...]\n`);

    const dedi1 = 'https://www.dedicatedbrand.com/en/men/all-men';
    const dedi2 = 'https://www.dedicatedbrand.com/en/women/all-women';

    const dediprod1 = await dedicatedbrand.scrape(dedi1);
    const dediprod2 = await dedicatedbrand.scrape(dedi2);

    const dediprod = dediprod1.concat(dediprod2);

    const mont1 = 'https://www.montlimart.com/99-vetements';
    const mont2 = 'https://www.montlimart.com/14-chaussures';
    const mont3 = 'https://www.montlimart.com/15-accessoires';

    const montprod1 = await montlimart.scrape(mont1);
    const montprod2 = await montlimart.scrape(mont2);
    const montprod3 = await montlimart.scrape(mont3);

    const montprod = (montprod1.concat(montprod2)).concat(montprod3);

    const circ1 = 'https://shop.circlesportswear.com/collections/collection-homme';
    const circ2 = 'https://shop.circlesportswear.com/collections/collection-femme';

    const circprod1 = await circlesportswear.scrape(circ1);
    const circprod2 = await circlesportswear.scrape(circ2);

    const circprod = circprod1.concat(circprod2);

    const products = (dediprod.concat(montprod)).concat(circprod);

    console.log(products);

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
