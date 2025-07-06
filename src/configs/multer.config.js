"use strict";

const multer = require("multer");

const uploadDiskStorage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

const uploadMemorystorage = multer({
  storage: multer.memoryStorage(),
});

module.exports = {
  uploadDiskStorage,
  uploadMemorystorage,
};
