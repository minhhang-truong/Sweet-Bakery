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
        await Product.addProduct(req.body.data);
        res.status(200).json({ message: "Product added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const id = req.body.id;
        await Product.deleteProduct(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}