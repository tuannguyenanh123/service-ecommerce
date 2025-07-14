'use strict'

const express = require("express")
const { profile, profiles } = require("../../controllers/profile.controller")
const { grantAccess } = require("../../middlewares/rbac")
const { asyncHandler } = require("../../helpers/asyncHandler")
const router = express.Router()


//admin
router.get('/view-any', grantAccess('readAny', 'Profile') , asyncHandler(profiles))

//shop
router.get('/view-own', grantAccess('readOwn', 'Profile'), asyncHandler(profile))

module.exports = router
