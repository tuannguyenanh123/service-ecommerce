const express = require("express")
const morgan = require("morgan")
const { default: helmet } = require("helmet")
const compression = require("compression")
const app = express()

//init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

//init db

//init routers
app.get("/", (req, res, next) => {
    const strCompress = "Hi everyone"
    return res.status(200).json({
        message: "Welcome my app",
        metadata: strCompress.repeat(10000)
    })
})

//handing errors

module.exports = app