'use strict'

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");
const ProductFactory = require("../services/product.service.xxx");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create success code generations!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get list all discount code!",
      metadata: await DiscountService.getAllDiscountOfShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get discount amount success!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getListDiscountCodeWithProducts = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get list all discount with product success!",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
        // shopId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
