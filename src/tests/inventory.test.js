const redisPubSubService = require("../services/redisPubSub.service")

class InventoryServiceTest {
    constructor(){
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            InventoryServiceTest.updateInventory(message)
        })
    }
    static updateInventory(productId, quantity) {
        const order = {
            productId, quantity
        }
        console.log("order::", order);
    }
}

module.exports = new InventoryServiceTest()
