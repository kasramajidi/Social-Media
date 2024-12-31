const express = require("express")
const authController = require("./auth.controller")
const authRouter = express.Router()

authRouter
    .route("/register")
    .get(authController.showRegisterView)
    .post(authController.register)

authRouter
    .route("/login")
    .get(authController.showLoginView)
    .post(authController.login)
module.exports = authRouter