const express = require("express")
const app = express()
const path = require("path")


const { setHeaders } = require("./middlewares/header")

//*body-parser
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(express.json({ limit: "50mb" }))

//* cors policy
app.use(setHeaders)

//* template engine ejs
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



//* 404 Error Handler
app.use((req, res) => {
    console.log("this path is not found :", req.path)
    return res.status(404).json({
        message: "404 | path not found !!"
    })
})


module.exports = app