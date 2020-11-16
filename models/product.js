const getDb = require("../util/mongo").getDb;
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOperation;
    if (this._id) {
      dbOperation = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOperation = db.collection("products").insertOne(this);
    }
    // create a collection
    return dbOperation
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static fetchAll() {
    const db = getDb();
    // mongo find does not return a promise, but a handler.
    // except if you use the toArray method. only use if you know there
    // are not many products in the collection.
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((result) => {
        console.log("product deleted");
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = Product;
