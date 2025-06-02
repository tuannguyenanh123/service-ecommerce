require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const { default: helmet } = require("helmet")
const compression = require("compression")
const app = express()
const mongoose = require("./dbs/init.mongodb")
const router = require("./routes")
// const { checkOverload } = require("./helpers/check.connect")

//init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//init db
mongoose
// checkOverload()

//init routers
app.use('/', router)

//handing errors

module.exports = app