'use strict'

const express = require("express")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const productController = require("../../controllers/product.controller")
const router = express.Router()

//route unauth
router.get('/search', asyncHandler(productController.getSearchProducts))
router.get('', asyncHandler(productController.getAllProducts))
router.get('/:id', asyncHandler(productController.getDetailProduct))

router.use(authenticationV2)

router.post('', asyncHandler(productController.createProduct))
router.patch('/:id', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

//QUERIES
router.get('/drafts', asyncHandler(productController.getAllDraftsForShop))
router.get('/published', asyncHandler(productController.getAllPublishForShop))

module.exports = router