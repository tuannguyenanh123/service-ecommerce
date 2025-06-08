'use strict'

const express = require("express")
const { apiKey, permission } = require("../auth/checkAuth")
const router = express.Router()

// middleware check api key, check permission
router.use(apiKey)
router.use(permission('0000'))

// check permission

router.use("/api/v1", require("./access"))
router.use("/api/v1/product", require("./product"))

module.exports = router