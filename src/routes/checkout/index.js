'use strict'

const express = require("express")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const checkoutController = require("../../controllers/checkout.controller")
const router = express.Router()

//Signup
router.post('/review', asyncHandler(checkoutController.checkoutReview))

router.use(authenticationV2)

module.exports = router