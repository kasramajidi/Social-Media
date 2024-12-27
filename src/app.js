const express = require("express")
const app = express()
const path = require("path")

app.use("/css", express.static(path.join(__dirname, "../public/css")))
app.use("/fonts", express.static(path.join(__dirname, "../public/fonts")))
app.use("/images", express.static(path.join(__dirname, "../public/images")))

app.use(express.urlencoded({extended: false}))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))


module.exports = app