"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");

// define Factory class to create product
class ProductFactory {
  static productRegistry = {} //key-class

  static registerProductType(type, classRef){
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if(!productClass) throw new BadRequestError(`Invalid product type: ${type}`);
    return new productClass(payload).createProduct()
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
    return await product.create({ ...this, _id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newClothing) throw new BadRequestError("Create new Clothing error");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new Product error");
    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElec = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newElec) throw new BadRequestError("Create new Clothing error");
    const newProduct = await super.createProduct(newElec._id);
    if (!newProduct) throw new BadRequestError("Create new Product error");
    return newProduct;
  }
}

//register product type
ProductFactory.registerProductType('Electronics', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)

module.exports = ProductFactory