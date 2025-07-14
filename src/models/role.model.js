"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

var roleSchema = new Schema(
  {
    role_slug: {
      type: String,
      required: true,
    },
    role_name: {
      type: String,
      default: "user",
      enum: ["admin", "user", "shop"],
    },
    role_status: {
      type: String,
      default: "active",
      enum: ["active", "pending", "block"],
    },
    role_description: {
      type: String,
      default: "",
    },
    role_grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [
          {
            type: String,
            required: true,
          },
        ],
        attributes: {
          type: String,
          default: "*",
        },
      },
    ],
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, roleSchema);
