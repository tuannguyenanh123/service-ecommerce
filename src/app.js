require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const { default: helmet } = require("helmet")
const compression = require("compression")
const app = express()
const mongoose = require("./dbs/init.mongodb")
// const { checkOverload } = require("./helpers/check.connect")

//init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

//init db
mongoose
// checkOverload()

//init routers
app.get("/", (req, res, next) => {
    const strCompress = "Hi everyone"
    return res.status(200).json({
        message: "Welcome my app",
        // metadata: strCompress.repeat(10000)// example for compression package
    })
})

//handing errors

module.exports = app