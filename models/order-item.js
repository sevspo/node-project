const { Sequelize, DataTypes } = require("sequelize");

const db = require("../util/database");

const OrderItem = db.define("orderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
});

module.exports = OrderItem;
