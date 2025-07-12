"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const commentController = require("../../controllers/comment.controller");
const { authenticationV2 } = require("../../auth/authUtils");
const { celebrate, Segments, Joi } = require("celebrate");
const { commentSchema } = require("../../validation/comment.validation");
const router = express.Router();

router.use(authenticationV2);

router.post(
  "/create",
  celebrate({
    [Segments.BODY]: commentSchema
  }),
  asyncHandler(commentController.createComment)
);
router.delete("", asyncHandler(commentController.commentDelete));
router.get("", asyncHandler(commentController.commentsByParentId));

module.exports = router;
