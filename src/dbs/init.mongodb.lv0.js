'use strict'

const mongoose = require("mongoose")

const connectionString = `mongodb://localhost:27017/shopDev`
mongoose.connect(connectionString).then(_ => console.log("Connected Mongodb Success")).catch(err => console.log("Error log!!!!"))

//dev
if(1 === 0) {
    mongoose.set("debug", true)
    mongoose.set("debug", {
        color: true
    })
}

module.exports = mongoose
