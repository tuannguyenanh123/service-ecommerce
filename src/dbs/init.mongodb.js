"use strict";

const mongoose = require("mongoose");

const { countConnect } = require("../helpers/check.connect");
const {
  db: { host, name, port },
} = require("../configs/congif.mongodb");

const connectionString = `mongodb://${host}:${port}/${name}`;
console.log("connectionString:: ", connectionString);
class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongdb") {
    if (1 === 0) {
      mongoose.set("debug", true);
      mongoose.set("debug", {
        color: true,
      });
    }

    mongoose
      .connect(connectionString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        countConnect();
        console.log("Connected Mongodb Success Senior");
      })
      .catch((err) => console.log("Error log!!!!"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
// mục đích chỉ khởi tạo một kết nối đến db

module.exports = instanceMongodb;
