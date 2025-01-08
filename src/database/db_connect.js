require("dotenv").config();
const mysql = require("mysql2");
const { Sequelize } = require("sequelize");

const cloudconfig = {
  user: "1friends_user",
  database: "1friends_db",
  password: "000FodApi000",
  socketPath: "/cloudsql/fod-api:us-central1:fod-api-db",
  multipleStatements: true,
  charset: "utf8mb4",
};

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
//Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
const localconfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_DATBASE || "ebook_portal",
  multipleStatements: true,
  insecureAuth: true,
  charset: "utf8mb4",
};

let dbConnection = function () {
  console.error("---DB connecting:--");
  const dbconnect = mysql.createConnection(localconfig);
  dbconnect.connect((err) => {
    if (err) {
      console.log("error connecting db" + err.stack);
      return;
    }
    console.log("db connected as id", dbconnect.threadId);
  });
  return dbconnect;
};

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
    logging: false,
    define: {
      charset: "utf8mb4",
    },
  }
);

module.exports = { dbConnection, sequelize };
