"use strict";

const notificationModel = require("../models/notification.model");

class NotificationService {
  static async pushNotiToSystem({
    type = 'SHOP-001',
    receivedId = 1,
    senderId = 1,
    options = {}
  }) {
    let notiContent
    if(type === 'SHOP-001') {
      notiContent = `@@@ Vừa mới thêm một sản phẩm mới: @@@@`
    } else if(type === 'PROMOTION-001') {
      notiContent = `@@@ Vừa mới thêm một một voucher: @@@@@`
    }

    const newNoti = notificationModel.create({
      noti_type: type,
      noti_content: notiContent,
      noti_receivedId: receivedId,
      noti_senderId: senderId,
      noti_options: options
    })

    return newNoti
  }

  static async listNotiByUser({
    userId = 1,
    type = 'ALL',
    isRead = 0
  }){
    const match = {
      noti_receivedId: userId
    }
    if(type !== 'ALL') {
      match['noti_type'] = type
    }

    return await notificationModel.aggregate([
      {
        $match: match
      },
      {
        $project: {
          noti_type: 1,
          noti_content: 1,
          // noti_content: {
          //   $concat: [
          //     {
          //       $substr: ['$noti_options.shop_name', 0, -1]
          //     },
          //     ' vừa mới thêm một sản phẩm mới ',
          //     {
          //       $substr: ['$noti_options.product_name', 0, -1]
          //     }
          //   ]
          // },
          noti_senderId: 1,
          noti_receivedId: 1,
          createAt: 1,
          noti_options: 1
        }
      }
    ])
  }
}

module.exports = NotificationService;
