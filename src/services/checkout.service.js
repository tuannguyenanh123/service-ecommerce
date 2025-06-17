"use strict";

const { BadRequestError } = require("../core/error.response");
const orderModel = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /**
   * Đánh giá thông tin checkout của người dùng
   * @param {Object} params - Tham số đầu vào
   * @param {string} params.cartId - ID của giỏ hàng
   * @param {string} params.userId - ID của người dùng
   * @param {Array<string>} params.shop_order_ids - Danh sách ID đơn hàng của cửa hàng
   * @returns {Promise<Object>} - Kết quả đánh giá checkout
   */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId exist
    const foundCart = findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart not exists!!!");

    const checkoutOrder = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const shop_order_ids_new = [];

    for (let index = 0; index < shop_order_ids.length; index++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[index];
      const checkProdsServer = await checkProductByServer(item_products);
      // console.log("checkProdsServer:: ", checkProdsServer);
      if (!checkProdsServer?.[0]) throw new BadRequestError("Order wrong!!!");

      const checkoutPrice = checkProdsServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      checkoutOrder.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        itemProducts: checkProdsServer,
      };

      if (shop_discounts.length > 0) {
        // giả sử chỉ có một discount
        const { discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProdsServer,
        });
        //tổng cộng discount giảm giá
        checkoutOrder.totalDiscount += discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkoutOrder,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkoutOrder } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });
    // check lại xem vượt tồn kho hay không ?//
    // get new arr products
    const products = shop_order_ids_new.flatMap((order) => order.itemProducts);
    const acquireProduct = []; // mục đích muốn thông báo đên người dùng nếu một trong các sản phẩm trong cart đã cập nhật nên user phải order lại
    
    for (let index = 0; index < products.length; index++) {
      const { productId, quantity } = products[index];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) await releaseLock(keyLock);
    }

    if(acquireProduct.includes(false)) {
        throw new BadRequestError('Some products updated, please back cart...')
    }

    const newOrder = await orderModel.create({
        order_userId: userId,
        order_checkout: checkoutOrder,
        order_shipping: user_address,
        order_payment: user_payment,
        order_products: shop_order_ids_new,
    })

    // case insert success => remove product in cart
    if(newOrder){

    }
    return newOrder
  }

  static async getOrdersByUser(){

  }

  static async getDetailOrderByUser(){
    
  }

  // admin | shop
  static async updateOrderStatusByShop(){
    
  }
}

module.exports = CheckoutService;
