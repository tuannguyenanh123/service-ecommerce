"use strict";

const { SuccessResponse } = require("../core/success.response");

const profiles = [
  {
    user_id: 1,
    user_name: "xxx",
  },
  {
    user_id: 2,
    user_name: "xxx1",
  },
  {
    user_id: 3,
    user_name: "xxx2",
  },
];

class ProfileController {
  // admin
  profiles = async (req, res, next) => {
    return new SuccessResponse({
      message: "View all profile",
      metadata: profiles,
    }).send(res);
  };

  //shop
  profile = async (req, res, next) => {
    return new SuccessResponse({
      message: "View profile",
      metadata: {
        user_id: 5,
        user_name: "xxx",
      },
    }).send(res);
  };
}

module.exports = new ProfileController();
