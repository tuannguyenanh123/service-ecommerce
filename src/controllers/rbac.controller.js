"use strict";

const { SuccessResponse } = require("../core/success.response");
const { createResource, createRole, roleList, resourceList } = require("../services/rbac.service");

class RbacController {
  newRole = async (req, res, next) => {
    return new SuccessResponse({
      message: "Created role success",
      metadata: await createRole(req.body),
    }).send(res);
  };

  newResource = async (req, res, next) => {
    return new SuccessResponse({
      message:  "Created resource success",
      metadata: await createResource(req.body),
    }).send(res);
  };

  listRole = async (req, res, next) => {
    return new SuccessResponse({
      message:  "List role success",
      metadata: await roleList(req.query),
    }).send(res);
  };

  listResource = async (req, res, next) => {
    return new SuccessResponse({
      message:  "List resource success",
      metadata: await resourceList(req.query),
    }).send(res);
  };
}

module.exports = new RbacController();
