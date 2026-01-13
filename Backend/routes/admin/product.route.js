const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/admin/product.controller");
const { authorize } = require('../../middleware/authorize.middleware');

// SỬA: authorize(3) -> authorize('admin')
router.get("/", verifyToken, authorize('admin'), controller.getProducts);

router.post("/add", verifyToken, authorize('admin'), controller.addProduct);

router.delete("/delete/:id", verifyToken, authorize('admin'), controller.deleteProduct);

router.get("/details/:id", verifyToken, authorize('admin'), controller.productDetails);

router.put("/edit", verifyToken, authorize('admin'), controller.updateProduct);

module.exports = router;