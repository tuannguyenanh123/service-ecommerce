require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const { default: helmet } = require("helmet")
const compression = require("compression")
const app = express()
const mongoose = require("./dbs/init.mongodb")
const router = require("./routes")

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
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    const message = error.message || 'Internal server error'
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message
   })
})

module.exports = app