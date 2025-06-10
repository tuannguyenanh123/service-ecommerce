"use strict";

const { unGetSelectData, getSelectData } = require("../../utils");

const findAllDiscountCodesUnselect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const selectFormat = unGetSelectData(unSelect);

  return await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(selectFormat)
    .lean();
};

const findAllDiscountCodesselect = async ({
    limit = 50,
    page = 1,
    sort = "ctime",
    filter,
    select,
    model,
  }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const selectFormat = getSelectData(select);
  
    return await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(selectFormat)
      .lean();
  };

module.exports = {
    findAllDiscountCodesUnselect,
    findAllDiscountCodesselect
}