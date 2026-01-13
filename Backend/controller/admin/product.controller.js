const Product = require("../../model/product.model");

module.exports.getProducts = async (req, res) => {
    try {
        const products = await Product.getStock();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.addProduct = async (req, res) => {
    try {
        // Logic tạo slug giữ nguyên
        const data = {
            ...req.body,
            slug: req.body.category
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/đ/g, "d")
                    .trim()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-"),

        }
        await Product.addProduct(data);
        res.status(200).json({ message: "Product added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        // ID sản phẩm trong DB mới vẫn là string (varchar), nên không cần parseInt nếu FE gửi string
        const id = req.params.id;
        await Product.deleteProduct(id);
        console.log("Deleted", id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.productDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.getProductDetails(id);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        await Product.updateProduct(req.body);
        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}