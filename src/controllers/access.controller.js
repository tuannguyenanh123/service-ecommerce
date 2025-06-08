"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  login = async (req, res, next) => {
    return new SuccessResponse({
      message: "Login Success",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    return new SuccessResponse({
      message: "Logout Success",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    const shop = await AccessService.signUp(req.body);
    return new Created({
      message: "Registered Ok!",
      metadata: shop,
      options: {
        limit: 10,
      },
    }).send(res);
  };

  handlerRefreshToken = async (req, res, next) => {
    // const { refreshToken } = req.body;
    // return new SuccessResponse({
    //   message: "Get Token Success!",
    //   metadata: await AccessService.handlerRefreshToken(refreshToken),
    // }).send(res);

    // v2 fixed, no need AT
    return new SuccessResponse({
      message: "Get Token Success!",
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      }),
    }).send(res);
  };
}

module.exports = new AccessController();
