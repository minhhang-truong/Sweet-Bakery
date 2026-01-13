const pool = require('../config/pool');

class Order {
    // --- 1. TẠO ĐƠN HÀNG ---
    static async createOrder(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            let receiveTimestamp;
            const timeData = data.time || {};
            const dateStr = timeData.date; 
            const timeStr = timeData.time; 

            if (dateStr && timeStr) {
                receiveTimestamp = `${dateStr} ${timeStr}:00`;
            } else {
                const now = new Date();
                now.setHours(now.getHours() + 2);
                receiveTimestamp = now.toISOString();
            }

            const payment = (data.payment || 'cash').toLowerCase();
            const status = (data.status || 'pending').toLowerCase();
            const addr = data.address || {};
            const street = addr.street || "";
            const ward = addr.ward || "";
            const district = addr.district || "";
            const city = addr.city || "";

            const queryOrder = `
                INSERT INTO app.orders 
                (order_id, customer_id, total_amount, order_time, status, 
                 receive_time, payment, note, 
                 receiver_name, receiver_phone, 
                 receiver_street, receiver_ward, receiver_district, receiver_city)
                VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            `;

            const valuesOrder = [
                data.id, data.cus_id, data.prices.total, status, receiveTimestamp, payment,
                data.customer.note || "", data.receiver.name, data.receiver.phone,
                street, ward, district, city
            ];

            await client.query(queryOrder, valuesOrder);

            const queryDetail = `
                INSERT INTO order_line (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4)
            `;

            for (let item of data.items) {
                await client.query(queryDetail, [data.id, item.id, item.qty, item.price]);
            }

            await client.query('COMMIT');
            return { success: true, orderId: data.id };

        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Error creating order:", error);
            throw error;
        } finally {
            client.release();
        }
    }

    // --- 2. TRA CỨU 1 ĐƠN HÀNG (Cho trang Success / Tracking) ---
    static async findOrder(orderId) {
        try {
            // Lấy thông tin đơn hàng từ bảng orders
            const query = `SELECT * FROM app.orders WHERE order_id = $1`;
            const res = await pool.query(query, [orderId]);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // --- 3. LỊCH SỬ ĐƠN HÀNG (Cho trang History) ---
    static async getOrder(customerId) {
        try {
            // Lấy đơn hàng kèm danh sách sản phẩm (JSON Aggregation)
            const query = `
                SELECT o.*, 
                       json_agg(json_build_object(
                           'id', od.product_id,
                           'qty', od.quantity,
                           'price', od.price,
                           'name', p.name,
                           'image', p.image
                       )) as items
                FROM app.orders o
                LEFT JOIN app.order_line od ON o.order_id = od.order_id
                LEFT JOIN app.product p ON od.product_id = p.id
                WHERE o.customer_id = $1
                GROUP BY o.order_id
                ORDER BY o.order_time DESC
            `;
            const res = await pool.query(query, [customerId]);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // --- 4. LẤY TẤT CẢ ĐƠN (Cho Employee/Admin) ---
    static async getAllOrders() {
        const res = await pool.query(`SELECT * FROM app.orders ORDER BY order_time DESC`);
        return res.rows;
    }
}

module.exports = Order;