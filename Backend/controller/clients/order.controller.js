const Order = require('../../model/order.model');

module.exports.saveOrder = async (req, res) => {
    try {
        const data = req.body;
        
        // QUAN TRỌNG: Gán customer_id từ token để đảm bảo đúng người
        data.cus_id = req.user.id;
        
        // Model createOrder đã sửa để map các trường address, receiver vào cột mới
        await Order.createOrder(data);
        res.status(201).json({ message: 'Order created successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.orderHistory = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        
        // Bảo mật: Check user
        if (req.user.id !== userId) {
             return res.status(403).json({ error: "Unauthorized" });
        }

        const result = await Order.getOrder(userId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

module.exports.trackOrder = async (req, res) => {
    try {
        // orderId trong DB mới là string (varchar)
        const orderId = req.params.id; 
        
        const result = await Order.findOrder(orderId);
        if(!result){
            return res.status(404).json({ error: 'Order not found' });
        }

        // DB mới vẫn dùng customer_id, check logic này đúng
        if (result.customer_id !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}