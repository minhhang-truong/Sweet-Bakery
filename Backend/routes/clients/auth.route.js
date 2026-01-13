const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/clients/auth.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.post("/signin", controller.signin);

router.post("/signup", controller.signup);

router.post("/logout", controller.logout);

// SỬA: authorize(1) -> authorize('customer')
router.put("/:id", verifyToken, authorize('customer'), controller.updateUser);

router.get("/:id", verifyToken, authorize('customer'), controller.userProfile);

router.put("/change-password/:id", verifyToken, authorize('customer'), controller.changePassword);

module.exports = router;