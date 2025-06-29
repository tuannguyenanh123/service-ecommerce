"use strict";

const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create comment Success",
      metadata: await CommentService.createComment(req.body)
    }).send(res);
  };

  commentsByParentId = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get comment by parent Success",
      metadata: await CommentService.getCommentsByParentId(req.query)
    }).send(res);
  };

  commentDelete = async (req, res, next) => {
    return new SuccessResponse({
      message: "Delete comment Success",
      metadata: await CommentService.deleteComment(req.body)
    }).send(res);
  };
}

module.exports = new CommentController();
