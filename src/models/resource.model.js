"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Resource";
const COLLECTION_NAME = "Resources";

var resourceSchema = new Schema(
  {
    src_slug: {
      type: String,
      required: true,
    },
    src_name: {
      type: String,
      required: true,
    },
    src_description: {
      type: String,
      default: "",
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, resourceSchema);
