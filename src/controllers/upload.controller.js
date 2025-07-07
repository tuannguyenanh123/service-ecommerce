"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImagesFromLocal,
  uploadImageFromLocalAws,
} = require("../services/upload.service");

class UploadController {
  uploadFile = async (req, res, next) => {
    // const { file } = req.body;
    return new SuccessResponse({
      message: "Upload file success!",
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    return new SuccessResponse({
      message: "Upload file thumb success!",
      metadata: await uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };

  uploadFiles = async (req, res, next) => {
    const { files } = req;
    if (!files.length) {
      throw new BadRequestError("Files missing");
    }
    return new SuccessResponse({
      message: "Upload files success!",
      metadata: await uploadImagesFromLocal({
        files,
        // ...req.body
      }),
    }).send(res);
  };

  //S3
  uploadFileS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    return new SuccessResponse({
      message: "Upload file S3 success!",
      metadata: await uploadImageFromLocalAws({ file }),
    }).send(res);
  };
}

module.exports = new UploadController();
