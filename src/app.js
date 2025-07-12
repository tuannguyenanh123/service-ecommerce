require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const { default: helmet } = require("helmet")
const compression = require("compression")
const app = express()
const mongoose = require("./dbs/init.mongodb")
const router = require("./routes")
const { errors } = require("celebrate")

//init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//test pub sub redis
// require('./tests/inventory.test')
// const productTest = require('./tests/product.test')
// productTest.purchaseProduct('product::001', 10)

//init db
mongoose
// checkOverload()

//init routers
app.use('/', router)

//validation input
app.use(errors());

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