const express = require("express")
const app = express()
const path = require("path")


//* template engine ejs
app.use(express.urlencoded({extended: false}))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

//* static Folders
app.use("/css", express.static(path.join(__dirname, "../public/css")))
app.use("/fonts", express.static(path.join(__dirname, "../public/fonts")))
app.use("/images", express.static(path.join(__dirname, "../public/images")))
app.use("/js", express.static(path.join(__dirname, "../public/js")))

//* Routes
app.get("/", (req, res) => {
    return res.render("homePage")
})


module.exports = app