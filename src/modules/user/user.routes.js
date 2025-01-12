const express = require("express")
const userController = require("./user.controller")
const auth = require("../../middlewares/auth")
const {multerStorage} = require("../../middlewares/uploaderConfigs")
const userRouter = express.Router()
const upload = multerStorage("public/images/profile")

userRouter
    .route("/edit-profile")
    .get(auth, userController.showPageEditView)

userRouter
    .route("/profile-picture")
    .post(auth, upload.single("profile"), userController.updateProfile)
module.exports = userRouter;