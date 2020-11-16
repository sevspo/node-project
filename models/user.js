const getDb = require("../util/mongo").getDb;
const mongodb = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // { items: []}
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOps;
    if (this._id) {
      dbOps = db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOps = db.collection("users").insertOne(this);
    }

    return dbOps
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // in monogo, the cart is now enbeded in the user, to create a connection
  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((item) => {
      // we need type conversion because _id is not really a string?

      return item.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => {
      return item.productId;
    });
    // use to array to not receive a cursor
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (item) => item.productId.toString() === product._id.toString()
            )?.quantity,
          };
        });
      });
  }

  deleteItemFromCart(prductId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== prductId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        // we also need info about the user, so we again create duplicate data and embed the user
        const order = {
          items: products,
          // here duplicate data is ok. Duplicate data can also act as a snapshot
          user: {
            _id: this._id,
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
      });
  }

  getOrders() {
    const db = getDb();
    // here we define a path to a nested prperty
    return db.collection("orders").find({ "user._id": this._id }).toArray();
  }

  static findById(userId) {
    const db = getDb();
    return (
      db
        .collection("users")
        .find({ _id: new mongodb.ObjectId(userId) })
        // find returns a cursor and we can call next on it to get the next user
        // you could also use findOne here
        .next()
        .then((user) => {
          console.log(user);
          return user;
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }
}

module.exports = User;
