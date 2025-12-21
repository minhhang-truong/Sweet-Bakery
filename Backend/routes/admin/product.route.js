const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/admin/product.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.get("/", verifyToken, authorize(3), controller.getProducts);

router.post("/add", verifyToken, authorize(3), controller.addProduct);

router.delete("/delete", verifyToken, authorize(3), controller.deleteProduct);

module.exports = router;