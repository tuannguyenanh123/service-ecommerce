"use strict";

const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

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
        // check cardId exist
        const foundCart = findCartById(cartId);
        if (!foundCart) throw new BadRequestError("Cart not exists!!!");

        const checkoutOrder = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        };
        const shopOrderIdsNew = [];

        for (let index = 0; index < shop_order_ids.length; index++) {
            const {
                shopId,
                shopDiscount = [],
                itemProducts = [],
            } = shop_order_ids[index];
            const checkProductServer = await checkProductByServer(itemProducts);
            console.log("checkProductServer:: ", checkProductServer);
            if (!checkProductServer?.[0]) throw new BadRequestError("Order wrong!!!");

            const checkoutPrice = checkProductByServer.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);

            checkoutOrder.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId,
                shopDiscount,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                itemProducts: checkProductServer,
            };

            if (shopDiscount.length > 0) {
                // giả sử chỉ có một discount
                const { discount = 0 } = await getDiscountAmount({
                    codeId: shopDiscount[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer,
                });
                //tổng cộng discount giảm giá
                checkoutOrder.totalDiscount += discount;
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }

            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
            shopOrderIdsNew.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shopOrderIdsNew,
            checkoutOrder
        }
    }
}

module.exports = CheckoutService;
