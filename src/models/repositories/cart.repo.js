'use strict'

const { convertToObjIdMongodb } = require("../../utils")
const cartModel = require("../cart.model")

const findCartById = async (cartId) => {
    return await cartModel.findOne({
        _id: convertToObjIdMongodb(cartId),
        cart_state: "active"
    }).lean()
}

module.exports = {
    findCartById
}