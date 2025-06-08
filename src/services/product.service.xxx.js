"use strict";

const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { product, clothing, electronic } = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  getProductDetail,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeFalsyObject, removeFalsyNestedObject } = require("../utils");

// define Factory class to create product
class ProductFactory {
  static productRegistry = {}; //key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  //POST
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`);
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`);
    return new productClass(payload).updateProduct(productId);
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  //QUERY
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 5,
    sort = "ctime",
    page = 1,
    filter = {
      isPublished: true,
    },
  }) {
    return await findAllProducts({
      limit,
      sort,
      filter,
      page,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async getDetailProduct({ product_id }) {
    return await getProductDetail({ product_id, unSelect: ["__v"] });
  }
}

//define base
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_quantity,
    product_price,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create NEW PRODUCT
  async createProduct(_id) {
    const newProduct = await product.create({ ...this, _id });
    if(newProduct){
      // add product stock in inventory
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity
      })
    }
    return newProduct
  }

  async updateProduct(productId, payload) {
    return await updateProductById({
      productId,
      payload: payload,
      model: product,
    });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new Clothing error");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new Product error");
    return newProduct;
  }

  async updateProduct(productId) {
    const objParams = removeFalsyObject(this);
    if (objParams.product_attributes) {
      //update child
      await updateProductById({
        productId,
        payload: removeFalsyNestedObject(objParams.product_attributes),
        model: clothing,
      });
    }
    // update parent
    const updateProduct = await super.updateProduct(productId, removeFalsyNestedObject(objParams));
    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElec = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElec) throw new BadRequestError("Create new Clothing error");
    const newProduct = await super.createProduct(newElec._id);
    if (!newProduct) throw new BadRequestError("Create new Product error");
    return newProduct;
  }
}

//register product type
ProductFactory.registerProductType("Electronics", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);

module.exports = ProductFactory;
