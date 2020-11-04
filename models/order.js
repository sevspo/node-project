const { Sequelize, DataTypes } = require("sequelize");

const db = require("../util/database");

const Order = db.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;
