const fs = require('fs');
const {MongoClient} = require('mongodb');
const {connect} = require('http2');
const moment = require('moment');
require('dotenv').config();

const brandsList = ['Dedicated','Montlimart','Circles Sportswear'];

async function storeProducts() {

  //username: ewenrondel
  //password: zCDm8kceZKiNrizU
  //cluster-url: clearfashion.j40ik1r.mongodb.net

  const MONGODB_URI = 'mongodb+srv://ewenrondel:zCDm8kceZKiNrizU@clearfashion.j40ik1r.mongodb.net?retryWrites=true&writeConcern=majority';
  const MONGODB_DB_NAME = 'clearfashion';

  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);

  const collection = db.collection('products');

  await collection.deleteMany({});

  let data = fs.readFileSync('products.json');
  const products = JSON.parse(data);
  products.map(product => {
    product._id = product.uuid;
    delete product.uuid;
  });

  const result = await collection.insertMany(products);
  console.log(result);

  process.exit(0);

}

async function fetchProductsMongoDB(brand = undefined, maxPrice = undefined, sortedByPrice = undefined, sortedByDate = undefined, recent = undefined) {

  const MONGODB_URI = 'mongodb+srv://ewenrondel:zCDm8kceZKiNrizU@clearfashion.j40ik1r.mongodb.net?retryWrites=true&writeConcern=majority';
  const MONGODB_DB_NAME = 'clearfashion';

  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);

  const collection = db.collection('products');

  var query = {};
  var sorting = {};

  //If the brand is defined and is available, search by brand
  //If not, search in all brands
  if(brand != undefined && brandsList.includes(brand)) {
    query.brand = brand;
  }

  //If the maxPrice is defined and positive, search by maximum price
  //If not, search without limit of price
  if(maxPrice != undefined && maxPrice > 0) {
    query.price = {'$lte': maxPrice};
  }

  //If sortedByPrice is set to true, sort all products from less to most expensive
  //If it is set to false, doesn't sort products
  if(sortedByPrice == true) {
    sorting.price = 1;
  }

  //If sortedByDate is set to true, sort all products from most to less recent
  //If it is set to false, doesn't sort products
  if(sortedByDate == true) {
    sorting.date = -1;
  }

  //If recent is set to true, search all products scraped in the last 2 weeks
  //If it is set to false, search all products
  const twoWeeks = 1000 * 60 * 60 * 24 * 14;
  const recentDate = new Date(Date.now() - twoWeeks);
  if(recent == true) {
    query.date = {'$gt': moment(recentDate).format('DD/MM/YYYY')};
  }

  const products = await collection.find(query).sort(sorting).toArray();

  console.log(products);

  process.exit(0);

}

//storeProducts();

//fetchProductsMongoDB("Dedicated", 50, true, true, true);

console.log(env.MONGO_DB_USERNAME);