'use strict'

const express = require("express")
const { newRole, listRole, listResource, newResource } = require("../../controllers/rbac.controller")
const { asyncHandler } = require("../../helpers/asyncHandler")
const router = express.Router()


router.get('/roles', asyncHandler(listRole))
router.post('/role', asyncHandler(newRole))
router.get('/resources', asyncHandler(listResource))
router.post('/resource', asyncHandler(newResource))

module.exports = router
