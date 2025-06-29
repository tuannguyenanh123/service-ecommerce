'use strict'

const express = require("express")
const { apiKey, permission } = require("../auth/checkAuth")
const { pushToLogDiscord } = require("../middlewares/index")
const router = express.Router()

router.use(pushToLogDiscord)

// middleware check api key, check permission
router.use(apiKey)
router.use(permission('0000'))

// check permission

router.use("/api/v1/inventory", require("./inventory"))
router.use("/api/v1/comment", require("./comment"))
router.use("/api/v1/checkout", require("./checkout"))
router.use("/api/v1/cart", require("./cart"))
router.use("/api/v1/product", require("./product"))
router.use("/api/v1/discount", require("./discount"))
router.use("/api/v1", require("./access"))

module.exports = router