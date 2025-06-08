"use strict";

const { Types } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      //level entry
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })

      // level high
      const filter = {
        user: userId,
      };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = {
        upsert: true,
        new: true,
      };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel
      .findOne({
        user: userId,
      })
      // .lean();
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({
        refreshTokensUsed: refreshToken,
      })
      .lean();
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteMany({
      user: new Types.ObjectId(userId),
    });
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel
      .findOne({
        refreshToken,
      })
      .lean();
  };

  static updateRefreshTokenUsed = async (userId, refreshToken, tokenNew) => {
    return await keyTokenModel.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: {
          refreshToken: tokenNew,
        },
        $push: {
          refreshTokensUsed: refreshToken,
        },
      }
    );
  };
}

module.exports = KeyTokenService;
