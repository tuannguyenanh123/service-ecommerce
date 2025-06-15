"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const getInforData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeFalsyObject = (obj) => {
  Object.keys(obj).forEach((element) => {
    if (obj[element] == null || obj[element] == undefined) {
      delete obj[element];
    }
  });

  return obj
};

const removeFalsyNestedObject = (obj) => {
  const final = {}

  Object.keys(obj).forEach((element) => {
    if (typeof obj[element] === "object" && !Array.isArray(obj[element])) {
      let res = removeFalsyNestedObject(obj[element])
      Object.keys(res).forEach((ele) => {
        final[`${element}.${ele}`] = res[ele]
      })
    } else {
      final[element] = obj[element]
    }
  });

  return final
};

const convertToObjIdMongodb = id => new Types.ObjectId(id)

module.exports = {
  getInforData,
  getSelectData,
  unGetSelectData,
  removeFalsyObject,
  removeFalsyNestedObject,
  convertToObjIdMongodb
};
