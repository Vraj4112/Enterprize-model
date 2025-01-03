require("dotenv").config();
const { Sequelize } = require("sequelize");

// Database Configuration
const sequelize = new Sequelize(
  process.env.DB_DATBASE || "ebook_portal",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "123456",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      multipleStatements: true,
      insecureAuth: true,
    },
    define: {
      charset: "utf8mb4",
    },
  }
);

module.exports = sequelize;
