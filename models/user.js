// const { Sequelize, DataTypes } = require("sequelize");

// const db = require("../util/database");

// const User = db.define("user", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: { type: DataTypes.STRING },
//   email: { type: DataTypes.STRING },
// });

const getDb = require("../util/mongo").getDb;
const mongodb = require("mongodb");

class User {
  constructor(username, email, id) {
    this.name = username;
    this.email = email;
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
