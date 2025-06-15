'use strict'

const { Types } = require("mongoose")
const { convertToObjIdMongodb } = require("../../utils")
const cartModel = require("../cart.model")

const findCartById = async (cartId) => {
    return await cartModel.findOne({
        _id: new Types.ObjectId(cartId),
        cart_state: "active"
    }).lean()
}

module.exports = {
    findCartById
}