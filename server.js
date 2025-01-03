require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db = require("./src/database/db_connect");

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());
//----------**********Cookie concept implemented start
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY || "vraj123")); // Replace with a strong secret

app.get("/set-cookie", (req, res) => {
  res.cookie("username", "JohnDoe", { maxAge: 10 * 60 * 1000, httpOnly: true });
  res.send("Cookie has been set!");
});

app.get("/get-cookie", (req, res) => {
  const username = req.cookies.username;
  res.send(username ? `Hello, ${username}` : "No cookie found");
});

app.get("/clear-cookie", (req, res) => {
  res.clearCookie("username");
  res.send("Cookie has been cleared!");
});
//----------**********Cookie concept implemented end

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the Node.js application with Sequelize and MySQL!");
});

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY || "vraj",
    resave: false, // Prevents session from being saved if unmodified
    saveUninitialized: false, // Avoids saving uninitialized sessions
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 5 * 1000, // Session expiration time in milliseconds // 5 seconds in milliseconds // 10 * 60 * 1000 // 10 minutes in milliseconds
    },
  })
);

// Test Route for Session
app.get("/session-test", (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`Number of views: ${req.session.views}`);
  } else {
    req.session.views = 1;
    res.send("Welcome! This is your first visit.");
  }
});

// Start the server
app.listen(PORT, async () => {
  try {
    await db.authenticate();
    console.log("Database connection has been established successfully.");

    // Synchronize models with the database
    await db.sync();
    console.log("Database synchronized successfully.");

    // For development purposes: Force sync to recreate tables
    // Uncomment the line below to enable force syncing
    // await db.sync({ force: true });
    // console.log('Database force-synchronized successfully.');

    // To alter tables without dropping them
    // Uncomment the line below to enable altering
    // await db.sync({ alter: true });
    // console.log('Database altered successfully to match models.');
  } catch (error) {
    console.error("Unable to connect to the database or synchronize:", error);
  } finally {
    // Uncomment this line if you want to close the connection after starting the server
    // await db.close();
    // console.log('Database connection closed.');
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
