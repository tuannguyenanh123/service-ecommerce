"use strict";

const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "97 ngo tri hoa, son tra, da nang city",
  }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError("The product does not exists!!!");

    const query = {
      inven_shopId: shopId,
      inven_product_id: productId,
    };
    const updateSet = {
      $inc: {
        inven_stock: stock,
      },
      $set: {
        inven_location: location,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService