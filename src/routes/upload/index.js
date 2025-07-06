'use strict'

const express = require("express")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const uploadController = require("../../controllers/upload.controller")
const { uploadDiskStorage } = require("../../configs/multer.config")
const router = express.Router()

// router.use(authenticationV2)
router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadDiskStorage.single('file'), asyncHandler(uploadController.uploadFileThumb))
router.post('/product/mutilple', uploadDiskStorage.array('files', 3), asyncHandler(uploadController.uploadFiles))

module.exports = router