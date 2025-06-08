"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service.xxx");

class ProductController {
  createProduct = async (req, res, next) => {
    const { product_type } = req.body;
    return new SuccessResponse({
      message: "Create product success!",
      metadata: await ProductFactory.createProduct(product_type, {
        ...req.body,
        product_shop: req.user.userId
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
