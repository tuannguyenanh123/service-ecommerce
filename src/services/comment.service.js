"use strict";

const { convertToObjIdMongodb } = require("../utils");
const commentModel = require("../models/comment.model");
const { NotFoundError } = require("../core/error.response");
const { getProductDetail } = require("../models/repositories/product.repo");

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const foundProduct = await getProductDetail({
      product_id: productId,
    });
    if (!foundProduct) throw new NotFoundError("Product not found");

    const comment = new commentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found");
      rightValue = parentComment.comment_right;

      //update many
      await commentModel.updateMany(
        {
          comment_productId: convertToObjIdMongodb(productId),
          comment_right: {
            $gte: rightValue,
          },
        },
        {
          $inc: {
            comment_right: 2,
          },
        }
      );

      await commentModel.updateMany(
        {
          comment_productId: convertToObjIdMongodb(productId),
          comment_left: {
            $gt: rightValue,
          },
        },
        {
          $inc: {
            comment_left: 2,
          },
        }
      );
    } else {
      const maxRight = await commentModel.findOne(
        {
          comment_productId: convertToObjIdMongodb(productId),
        },
        "comment_right",
        {
          sort: {
            comment_right: -1,
          },
        }
      );

      if (maxRight) {
        rightValue = maxRight.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;
    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId);
      if (!parent) throw new NotFoundError("Not found comment for product");
      const comments = commentModel
        .find({
          comment_productId: convertToObjIdMongodb(productId),
          // comment_parentId: (parentCommentId),
          comment_left: {
            $gt: parent.comment_left,
          },
          comment_right: {
            $lte: parent.comment_right,
          },
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }
    const comments = commentModel
      .find({
        comment_productId: convertToObjIdMongodb(productId),
        comment_parentId: parentCommentId,
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      });

    return comments;
  }

  static async deleteComment({ commentId, productId }) {
    // check product in db
    const foundProduct = await getProductDetail({
      product_id: productId,
    });
    if (!foundProduct) throw new NotFoundError("Product not found");

    // xác định left right of comment parent
    const comment = await commentModel.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");

    const left = comment.comment_left;
    const right = comment.comment_right;

    //tính width
    const width = right - left + 1;
    // xoá tree comment
    await commentModel.deleteMany({
      comment_productId: convertToObjIdMongodb(productId),
      comment_left: {
        $gte: left,
        $lte: right,
      },
    });
    //update
    await commentModel.updateMany(
      {
        comment_productId: convertToObjIdMongodb(productId),
        comment_right: {
          $gt: right,
        },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    );

    await commentModel.updateMany(
      {
        comment_productId: convertToObjIdMongodb(productId),
        comment_left: {
          $gt: right,
        },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    );

    return true;
  }
}

module.exports = CommentService;
