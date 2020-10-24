const Cart = require("./cart");
const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.query(
      "INSERT INTO products (title, price, description, imageurl) VALUES ($1, $2, $3, $4) RETURNING *",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  static deleteById(id) {}

  static fetchAll() {
    return db.query("SELECT * FROM products");
  }

  static findById(id) {
    return db.query(`SELECT * FROM products WHERE products.id = $1`, [id]);
  }
};
