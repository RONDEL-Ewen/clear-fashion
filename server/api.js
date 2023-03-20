const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {MongoClient} = require('mongodb');
require('dotenv').config({path:'../.env'});

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

// Search for specific products
// Here is an example of a test endpoint:
// http://localhost:8092/products/search?limit=5&brand=Dedicated&price=50
app.get('/products/search', async (request, response) => {

  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const cluster = process.env.MONGODB_CLUSTER;
  const MONGODB_URI = 'mongodb+srv://' +
                      username +
                      ':' +
                      password +
                      '@' +
                      cluster +
                      '?retryWrites=true&writeConcern=majority';
  const MONGODB_DB_NAME = process.env.MONGODB_NAME;

  try {

    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db(MONGODB_DB_NAME);

    const collection = db.collection('products');

    let limitSearch = request.query.limit || 12;
    let brandSearch = request.query.brand || undefined;
    let priceSearch = request.query.price || undefined;

    let query = {};
    if(brandSearch !== undefined) {
      query.brand = brandSearch;
    }
    if(priceSearch !== undefined) {
      query.price = {$lte: parseInt(priceSearch)};
    }

    let endpointResult = await collection
                .find(query)
                .limit(parseInt(limitSearch))
                .sort({price: 1})
                .toArray();

    response.send({result: endpointResult});

  } catch(e) {
    response.send({error: "Incorrect arguments"});
    console.log(e);
  }

});

// Fetch a specific product
// Here is an example of a test endpoint:
// http://localhost:8092/products/0ac4944c353098057c484ece
app.get('/products/:id', async (request, response) => {

  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const cluster = process.env.MONGODB_CLUSTER;
  const MONGODB_URI = 'mongodb+srv://' +
                      username +
                      ':' +
                      password +
                      '@' +
                      cluster +
                      '?retryWrites=true&writeConcern=majority';
  const MONGODB_DB_NAME = process.env.MONGODB_NAME;

  try {

    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db(MONGODB_DB_NAME);

    const collection = db.collection('products');

    const productId = request.params.id;

    var query = {};
    query._id = productId;
    const endpointResult = await collection.find(query).toArray();

    if(endpointResult.length > 0) {
      response.send({result: endpointResult});
    } else {
      response.send({error: 'Product ID not found'});
    }

  } catch(e) {
    response.status(500).send({ error: 'Internal server error' });
    console.log(e);
  }

});




















app.listen(PORT);
//module.exports = app;
console.log(`📡 Running on port ${PORT}`);