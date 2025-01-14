const express = require("express");
const controller = require("./home.controller");
const auth = require("./../../middlewares/auth");

const router = express.Router();

router.get("/", auth, controller.showHomeView);

module.exports = router;
