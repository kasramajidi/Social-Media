const express = require("express");
const controller = require("./page.controller");
const auth = require("./../../middlewares/auth");

const router = express.Router();

router.route("/:pageID").get(auth, controller.getPage);
router.route("/:pageID/follow").post(auth, controller.follow);
router.route("/:pageID/unfollow").post(auth, controller.unFollow);

module.exports = router;
