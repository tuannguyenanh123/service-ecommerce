"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  addToCart,
  addToCartV2,
  deleteUserCart,
  getListCart,
} = require("../services/cart.service");

class CheckoutController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Add to cart success",
      metadata: await addToCart(req.body),
    }).send(res);
  };

  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Update cart success",
      metadata: await addToCartV2(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "Update cart success",
      metadata: await deleteUserCart(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list cart success",
      metadata: await getListCart(req.query),
    }).send(res);
  };
}

module.exports = new CheckoutController();
