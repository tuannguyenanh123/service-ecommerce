"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

//book mark
//ORDER-001 => order success
//ORDER-002 => order fail
//SHOP-001 => new product
//PROMOTION-001 => new promotion
// ...

var notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "SHOP-001", "PROMOTION-001"],
      require: true,
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Shop'
    },
    noti_receivedId: {
      type: Number,
      require: true,
    },
    noti_content: {
      type: String,
      require: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
