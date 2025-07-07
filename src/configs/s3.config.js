"use strict";

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } = require("@aws-sdk/client-s3");

const config = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
  },
};

const s3 = new S3Client(config);

module.exports = {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteBucketCommand
};
