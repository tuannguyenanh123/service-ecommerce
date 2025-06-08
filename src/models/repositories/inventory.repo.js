const inventoryModel = require("../inventory.model")

const insertInventory = async ({productId, shopId, stock, location = 'unknown'}) => {
    return await inventoryModel.create({
        inven_location: location,
        inven_stock: stock,
        inven_shopId: shopId,
        inven_product_id: productId,
    })
}

module.exports = {
    insertInventory
}