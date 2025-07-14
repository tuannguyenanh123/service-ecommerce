"use strict";

const resourceModel = require("../models/resource.model");
const roleModel = require("../models/role.model");

const createResource = async ({
  slug = "p00001",
  name = "profile",
  description = "",
}) => {
  try {
    const foundExistSrc = await resourceModel.findOne({ src_slug: slug });
    if (foundExistSrc) {
      throw new BadRequestError("Error: Resource created!");
    }

    const newResource = await resourceModel.create({
      src_slug: slug,
      src_name: name,
      src_description: description,
    });

    return newResource;
  } catch (error) {
    return error;
  }
};

const resourceList = async ({
  userId = 0, //admin
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    //1.check admin in middleware
    //2.
    const resources = await resourceModel.aggregate([
      {
        $project: {
          _id: 0,
          slug: "$src_name",
          name: "$src_slug",
          description: "$src_description",
          resourceId: "$_id",
          createdAt: 1,
        },
      },
    ]);

    return resources;
  } catch (error) {
    return [];
  }
};

const createRole = async ({
  name = "shop",
  slug = "s00001",
  description = "",
  grants = [],
}) => {
  try {
    //1. check role exists
    //2.
    const role = await roleModel.create({
      role_name: name,
      role_description: description,
      role_slug: slug,
      role_grants: grants,
    });
    return role;
  } catch (error) {
    return error;
  }
};

const roleList = async ({
  userId = 0,
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    // const roles = await roleModel.find()
    const roles = await roleModel.aggregate([
      {
        $unwind: "$role_grants",
      },
      {
        $lookup: {
          from: "Resources",
          localField: "role_grants.resource",
          foreignField: "_id",
          as: "resource",
        },
      },
      {
        $unwind: "$resource",
      },
      {
        $project: {
          role: "$role_name",
          resource: "$resource.src_name",
          action: "$role_grants.actions",
          attributes: "$role_grants.attributes",
        },
      },
      {
        $unwind: "$action",
      },
      {
        $project: {
            _id: 0,
            role: 1,
            resource: 1,
            action: "$action",
            attributes: 1,
          },
      }
    ]);

    return roles;
  } catch (error) {
    return [];
  }
};

module.exports = {
  createResource,
  resourceList,
  createRole,
  roleList,
};
