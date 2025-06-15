"use strict";

const { Types } = require("mongoose");
const { product } = require("../product.model");
const { getSelectData, unGetSelectData } = require("../../utils");

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isPublished: true,
        $text: {
          $search: regexSearch,
        },
      },
      {
        score: {
          $meta: "textScore",
        },
      }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const selectFormat = getSelectData(select);

  return await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(selectFormat)
    .lean();
};

const getProductDetail = async ({ product_id, unSelect }) => {
  const selectFormat = unGetSelectData(unSelect);
  return await product.findById(product_id).select(selectFormat).lean();
};

const findAllDraftsForShop = async ({ keySearch }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;

  await foundShop.save();
  return 1;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublished = false;

  await foundShop.save();
  return 1;
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(
    productId,
    payload,
    {
      new: isNew
    }
  );
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({
      updateAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const getProductById = async (productId) => {
  return await product.findOne({
    _id: new Types.ObjectId(productId)
  }).lean();
}

const checkProductByServer = async (products) => {
  return await Promise.all(products.map(async product => {
    const foundProduct = await getProductById(product.productId)
    if(foundProduct) {
      return {
        price: foundProduct.product_price,
        quantity: product.quantity,
        productId: product.productId
      }
    }
  }))
}

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  getProductDetail,
  updateProductById,
  checkProductByServer,
  getProductById
};
