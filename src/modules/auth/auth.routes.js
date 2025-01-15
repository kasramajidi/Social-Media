const express = require("express");
const controller = require("./auth.controller");

const router = express.Router();

router
  .route("/register")
  .get(controller.showRegisterView)
  .post(controller.register);


router 
  .route("/refresh", controller.refreshToken)
router.route("/login").get(controller.showLoginView).post(controller.login);

module.exports = router;
