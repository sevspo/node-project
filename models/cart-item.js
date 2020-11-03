const { Sequelize, DataTypes } = require("sequelize");

const db = require("../util/database");

const CartItem = db.define("cartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
});

module.exports = CartItem;
