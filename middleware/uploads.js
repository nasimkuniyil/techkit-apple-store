const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");
const { v4:uuidv4} = require('uuid')

//setting storage for file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `product_image-${uuidv4()}.jpg`);
  },
});

//create multer instance
const upload = multer({ storage });

module.exports = upload;
