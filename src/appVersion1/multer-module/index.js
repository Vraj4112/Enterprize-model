const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const route = express.Router();

const FOLDERNAME = "./public/Images/vehicleImages";

//Create image folder date wise
let createFolder = function (req, res, next) {
  try {
    const d = new Date();
    let year = d.getUTCFullYear();
    let month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    let day = ("0" + d.getUTCDate()).slice(-2);

    ImageFolder = `${FOLDERNAME}/${year}-${month}-${day}`;

    if (!fs.existsSync(ImageFolder)) {
      fs.mkdir(ImageFolder, () => {});
    }
    req.ImageFolder = ImageFolder;
    next();
  } catch (err) {
    console.error(err);
  }
};

//*******------  Multer configure START ------*******
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, req.ImageFolder);
  },
  filename: function (req, file, cb) {
    let filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({
  storage: storage,
  limit: { fileSize: 5 * 1024 * 1024 },
});
//*******------  Multer configure END ------*******

// Define routes
route.post(
  "/upload_image",
  createFolder,
  upload.array("image_field_name", 10),
  (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "file upload failed" });
    }
    return res.status(200).json({ message: "File uploaded successfully!" });
  }
);

module.exports = route;
