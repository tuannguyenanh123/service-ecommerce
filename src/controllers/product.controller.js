"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service.xxx");

class ProductController {
  createProduct = async (req, res, next) => {
    const { product_type } = req.body;
    return new SuccessResponse({
      message: "Create product success!",
      metadata: await ProductFactory.createProduct(product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    const { id } = req.params;
    return new SuccessResponse({
      message: "Published product success!",
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id: id,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    const { id } = req.params;
    return new SuccessResponse({
      message: "UnPublished product success!",
      metadata: await ProductFactory.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: id,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    const { product_type } = req.body;
    const { id } = req.params;
    
    return new SuccessResponse({
      message: "Update product success!",
      metadata: await ProductFactory.updateProduct(product_type, id, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  //QUERY
  getAllDraftsForShop = async (req, res, next) => {
    const { limit, skip } = req.query;
    return new SuccessResponse({
      message: "Get draft products success!",
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
        limit,
        skip,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    const { limit, skip } = req.query;
    return new SuccessResponse({
      message: "Get published products success!",
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId,
        limit,
        skip,
      }),
    }).send(res);
  };

  getSearchProducts = async (req, res, next) => {
    const { keySearch } = req.query;
    return new SuccessResponse({
      message: "Get search products success!",
      metadata: await ProductFactory.searchProducts({
        keySearch,
      }),
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get all products success!",
      metadata: await ProductFactory.findAllProducts(req.query),
    }).send(res);
  };

  getDetailProduct = async (req, res, next) => {
    const { id } = req.params;
    return new SuccessResponse({
      message: "Get product detail success!",
      metadata: await ProductFactory.getDetailProduct({ product_id: id }),
    }).send(res);
  };
  //END QUERY
}

module.exports = new ProductController();
