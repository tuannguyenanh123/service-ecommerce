"use strict";

const redis = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

const redisClient = redis.createClient();

// redisClient.ping((err, result) => {
//   if(err){
//     console.log(`err connection redis::`, err);
//   } else {
//     console.log(`connected to redis::`, err);
//   }
// })
//   .on("error", (err) => console.log("Redis Client Error", err))
//   .connect();
const pexire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cardId) => {
  const key = `lock_v2025_${productId}`; // tạo key để lock ==> ai vào mua thì sẽ đưa key này cho người đi trước, người đi trước order xong trừ tồn kho xong trả lại key cho người khác vào
  const retryTime = 10;
  const expireTime = 3; // thời gian tạm lock

  for (let index = 0; index < retryTime; index++) {
    // tạo một key, thèn nào nắm key thì được vào
    const result = await setnxAsync(key, expireTime);
    console.log("result::", result);
    if (result === 1) {
      //thao tác với inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cardId,
      });
      if (isReservation.modifiedCount) {
        // > 0  trừ đi tồn kho đúng, hợp lệ
        await pexire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
