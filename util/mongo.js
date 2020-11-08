const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect("mongodb://mongo:27017")
    .then((client) => {
      console.log("connected");
      // here we define a nome for our collection, but why here?
      _db = client.db("shop");
      callback();
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

// with mongo db connection pooling is included
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error("No Database found");
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
