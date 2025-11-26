const Order = require('../../model/order.model');

module.exports.saveOrder = async (req, res) => {
    try {
        const data = req.body;
        const result = await Order.createOrder(data);
        res.status(201).json({ message: 'Order created successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.orderHistory = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const result = await Order.getOrder(userId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

module.exports.trackOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const result = await Order.findOrder(orderId);
        if(!result){
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}