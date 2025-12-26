const Order = require('../../model/order.model');

module.exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAllOrdersByDate(req.body.date);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.getOrderDetail = async (req, res) => {
    try {
        const detail = await Order.getOrderDatail(req.body.orderId);
        res.json(detail);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Interal Server Error'});
    }
}

module.exports.createOrder = async (req, res) => {
    try {
        await Order.createOrder(req.body);
        res.status(201).json({ message: 'Order created successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.updateOrderStatus = async (req, res) => {
    try {
        await Order.updateOrderStatus(req.body);
        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}