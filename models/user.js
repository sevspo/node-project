const { Sequelize, DataTypes } = require("sequelize");

const db = require("../util/database");

const User = db.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
});

module.exports = User;
