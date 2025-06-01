"use strict";

const { default: mongoose } = require("mongoose");

const _SECONDS = 5000;
const os = require("os");
const process = require("process");

const countConnect = () => {
  const numConnection = mongoose.connect.length;
  console.log(`Number connection `, numConnection);
};

//check overload connect
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connect.length;
    const numCores = os.cpus();
    const memoryUsage = process.memoryUsage().rss;

    //example maximum number of connections based on number of cores
    const maxConnections = numCores * 5;
    console.log(`Active connection:: ${numConnection} connection`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
    
    if(numConnection > maxConnections) {
        console.log("Connection load overload detected!!!");
        //notify.send(...)
    }
  }, _SECONDS); //Monitor every 5s
};

module.exports = {
  countConnect,
  checkOverload,
};
