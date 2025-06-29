"use strict";

const { SuccessResponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
  getNotiByUser = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get noti by user Success",
      metadata: await NotificationService.listNotiByUser(req.query)
    }).send(res);
  };
}

module.exports = new NotificationController();
