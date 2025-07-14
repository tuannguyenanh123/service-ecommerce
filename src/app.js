require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();
const mongoose = require("./dbs/init.mongodb");
const router = require("./routes");
const { errors } = require("celebrate");
const { v4: uuidv4 } = require("uuid");
const myloggerLog = require("./loggers/mylogger.log");

//init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  const requestId = res.header["x-request-id"];
  req.requestId = requestId || uuidv4();
  myloggerLog.log(`Input params:: ${req.method}`, [
    req.path,
    {
      requestId: req.requestId,
    },
    req.method === "POST" ? req.body : req.query,
  ]);

  next();
});

//test pub sub redis
// require('./tests/inventory.test')
// const productTest = require('./tests/product.test')
// productTest.purchaseProduct('product::001', 10)

//init db
mongoose;
// checkOverload()

//init routers
app.use("/", router);

//validation input
app.use(errors());

//handing errors
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = error.message || "Internal server error";
  const resMessage = `${statusCode} - ${Date.now() - error.now} --RESPONSE: ${JSON.stringify(error)}`;

  myloggerLog.log(resMessage, [
    req.path,
    {
      requestId: req.requestId,
    },
    {
      message: error.message,
    },
  ]);
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message,
  });
});

module.exports = app;
