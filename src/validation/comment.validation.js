"use strict";

const { Joi } = require("celebrate");

const commentSchema = Joi.object({
  productId: Joi.string().required().messages({
    "any.required": "ProductId is required",
  }),
  userId: Joi.string().required().messages({
    "any.required": "UserId is required",
  }),
  content: Joi.string().required().messages({
    "any.required": "Content is required",
  }),
  parentCommentId: Joi.string().default(null),
});

module.exports = {
  commentSchema,
};
