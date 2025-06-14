"use strict";

const { SuccessResponse } = require("../core/success.response");
const { checkoutReview } = require("../services/checkout.service");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get checkout review success',
        metadata: await checkoutReview(req.body)
    }).send(res)
  }
}

module.exports = new CheckoutController();
