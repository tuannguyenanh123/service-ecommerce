"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

var userSchema = new Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },
    user_slug: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      default: "",
    },
    user_password: {
      type: String,
      default: "",
    },
    user_salf: {
      type: String,
      default: "",
    },
    user_email: {
      type: String,
      required: true,
    },
    user_phone: {
      type: String,
      default: "",
    },
    user_sex: {
      type: String,
      default: "",
    },
    user_avatar: {
      type: String,
      default: "",
    },
    user_date_of_birth: {
      type: Date,
      default: null,
    },
    user_role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    user_status: {
      type: String,
      enum: ["active", "pending", "block"],
      default: "pending",
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
);

module.exports = model(DOCUMENT_NAME, userSchema);
