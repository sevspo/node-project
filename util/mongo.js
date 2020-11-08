const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect("mongodb://mongo:27017")
    .then((client) => {
      console.log("connected");
      callback(client);
    })
    .catch((err) => console.error(err));
};

module.exports = mongoConnect;
