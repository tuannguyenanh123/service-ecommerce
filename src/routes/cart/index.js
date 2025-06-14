'use strict'

const express = require("express")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const cartController = require("../../controllers/cart.controller")
const router = express.Router()

//Signup
router.post('/add-to-cart', asyncHandler(cartController.addToCart))
router.get('', asyncHandler(cartController.listToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.update))

router.use(authenticationV2)

module.exports = router