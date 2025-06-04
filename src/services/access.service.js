"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInforData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

const Roles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // try {
    // check email existes???
    const hodelShop = await shopModel
      .findOne({
        email,
      })
      .lean(); // gỉam tải return object js thuần tuý
    if (hodelShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [Roles.SHOP],
    });
    if (newShop) {
      //solution1
      //created Private key ==> sign token, public key ==> verify token
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      //solution2
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: keyStore error!");
      }

      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );
      return {
        shop: getInforData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
    return {
      metadata: null,
    };
  };
}

module.exports = AccessService;
