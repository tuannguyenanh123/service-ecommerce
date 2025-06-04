"use strict";

const { Created } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    const shop = await AccessService.signUp(req.body);
    return new Created({
      message: "Registered Ok!",
      metadata: shop,
      options: {
        limit: 10
      }
    }).send(res);
  };
}

module.exports = new AccessController();
