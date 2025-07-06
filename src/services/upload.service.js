"use strict";

const cloudinary = require("../configs/cloudinary.config");

const uploadImageFromUrl = async () => {
  try {
    const urlImg =
      "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m63ft740rrdjfa.webp";
    const folderName = "product/8409",
      newFileName = "testDemo";

    const result = await cloudinary.uploader.upload(urlImg, {
      folder: folderName,
      public_id: newFileName,
    });
    return result;
  } catch (error) {
    console.log("Upload cloudinary error::", error);
  }
};

const uploadImageFromLocal = async ({ path, folderName = "product/8049" }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: folderName,
      public_id: "thumb",
    });
    return {
      img_url: result.secure_url,
      shop_id: 8409,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: "webp",
      }),
    };
  } catch (error) {
    console.log("Upload cloudinary error::", error);
  }
};

const uploadImagesFromLocal = async ({
  files,
  folderName = "product/8049",
}) => {
  try {
    if (!files?.length) return;
    const uploadedUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });

      uploadedUrls.push({
        img_url: result.secure_url,
        shop_id: 8409,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: "webp",
        }),
      });
    }
    return uploadedUrls;
  } catch (error) {
    console.log("Upload cloudinary error::", error);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImagesFromLocal,
};
