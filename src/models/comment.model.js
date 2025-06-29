"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";

var commentSchema = new Schema(
  {
    comment_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    comment_userId: {
      type: Number,
      default: "1",
    },
    comment_content: {
      type: String,
      default: "content",
    },
    comment_left: {
      // algo nested set model
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = model(DOCUMENT_NAME, commentSchema);
