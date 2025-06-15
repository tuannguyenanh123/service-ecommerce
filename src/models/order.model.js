"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

var orderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      required: true,
    },
    order_tracking_number: {
      type: String,
      default: "#00001182025",
    },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
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

module.exports = model(DOCUMENT_NAME, orderSchema);
