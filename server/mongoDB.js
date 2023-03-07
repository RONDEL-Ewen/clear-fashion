const fs = require('fs');
const {MongoClient} = require('mongodb');
const {connect} = require('http2');

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

storeProducts();
