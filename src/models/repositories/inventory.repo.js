const { convertToObjIdMongodb } = require("../../utils");
const inventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventoryModel.create({
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId,
    inven_product_id: productId,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_product_id: convertToObjIdMongodb(productId),
    inven_stock: {
      $gte: quantity,
    },
  };
  const updateSet = {
    $inc: {
      inven_stock: -quantity,
    },
    $push: {
        inven_reservations: {
            quantity,
            cartId,
            createOn: new Date()
        }
    }
  };
  const options = {
    upsert: true,
    new: true
  }

  return await inventoryModel.updateOne(query, updateSet)
};

module.exports = {
  insertInventory,
  reservationInventory
};
