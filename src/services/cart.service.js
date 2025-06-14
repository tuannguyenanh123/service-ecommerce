"use strict";

const { Types } = require("mongoose");
const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");
const { convertToObjIdMongodb } = require("../utils");

class CartService {
  //REPO
  static async createUserCart({ userId, product }) {
    const query = {
      cart_userId: userId,
      cart_state: "active",
    };
    const foundProduct = await getProductById(product.productId);
    if (!foundProduct) throw new NotFoundError("Product not exists");
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateQuantityUserCart({ userId, product }) {
    const { quantity, productId } = product;
    
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    };
    const updateOrInsert = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }
  //REPO

  static async addToCart({ userId, product = {} }) {
    //check cart exist
    const userCartExist = await cartModel.findOne({
      cart_userId: userId,
    });
    if (!userCartExist) {
      return await CartService.createUserCart({ userId, product });
    }

    //if has cart but no product in cart???
    if (!userCartExist.cart_products.length) {
      userCartExist.cart_products = [product];
      return await userCartExist.save();
    }

    //if cart exist and has this product ==> update quantity
    return await CartService.updateQuantityUserCart({ userId, product });
  }

  static async addToCartV2({ userId, shop_order_ids = {} }) {
    //check cart exist
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);
    
    if (!foundProduct) throw new NotFoundError("Product not exists");
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError("Product do not belong to the shop");
    if (quantity === 0) {
      //delete
      await CartService.deleteUserCart({
        userId,
        productId,
      });
    }
    
    return await CartService.updateQuantityUserCart({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateSet = {
        $pull: {
          cart_products: {
            _id: new Types.ObjectId(productId),
          },
        },
      };

    const deleteCart = await cartModel.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListCart({ userId }) {
    return await cartModel
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
