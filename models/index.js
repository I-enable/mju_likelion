const Sequelize = require("sequelize");
const User = require("./user");  // 1
const General = require("./general");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.Genralname,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;  // 2
db.General = General;

User.init(sequelize);  // 3
General.init(sequelize);

User.associate(db);  // 4
General.associate(db);

module.exports = db;

