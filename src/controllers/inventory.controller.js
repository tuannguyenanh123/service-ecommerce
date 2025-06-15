'use strict'

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        return new SuccessResponse({
            message: "Add Stock To Inventory success!",
            metadata: await InventoryService.addStockToInventory({
                ...req.body,
            }),
        }).send(res);
    };
}

module.exports = new InventoryController();
