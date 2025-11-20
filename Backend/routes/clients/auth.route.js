const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/clients/auth.controller");

router.post("/signin", controller.signin);

router.post("/signup", controller.signup);

router.put("/:id", verifyToken, controller.updateUser);

router.get("/:id", verifyToken, controller.userProfile);

module.exports = router;