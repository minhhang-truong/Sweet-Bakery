const pool = require('../config/pool');

class Order {
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
            //const addr = data.address || {};
            const street = data.street || "";
            const ward = data.ward || "";
            const district = data.district || "";
            const city = data.city || "";

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

            /*const queryDetail = `
                INSERT INTO order_line (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4)
            `;

            for (let item of data.items) {
                await client.query(queryDetail, [data.id, item.id, item.qty, item.price]);
            }*/

            // 4. INSERT VÀO BẢNG ORDER_LINE (ĐÃ SỬA: INSERT 1 LẦN DUY NHẤT)
            if (data.items && data.items.length > 0) {
                const lineValues = [];
                const placeholders = [];
                
                data.items.forEach((item, index) => {
                    const i = index * 4; // Mỗi dòng có 4 tham số (order_id, product_id, quantity, price)
                    
                    // Tạo chuỗi placeholders: ($1, $2, $3, $4), ($5, $6, $7, $8)...
                    placeholders.push(`($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4})`);
                    
                    // Đẩy dữ liệu phẳng vào mảng values
                    lineValues.push(
                        data.id,    // order_id
                        item.id,    // product_id
                        item.qty,   // quantity
                        item.price  // price
                    );
                });

                // Câu lệnh SQL cuối cùng sẽ có dạng: 
                // INSERT INTO ... VALUES ($1, $2, $3, $4), ($5, $6, $7, $8) ...
                const queryDetail = `
                    INSERT INTO app.order_line (order_id, product_id, quantity, price)
                    VALUES ${placeholders.join(', ')}
                `;

                // Thực thi 1 lần duy nhất
                await client.query(queryDetail, lineValues);
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
                           'image', p.images
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
    
    static async getAllOrdersByDate(date) {
        try {
            const query = `
                SELECT o.order_id as id,
                       o.total_amount,
                       o.order_time as ordertime,
                       o.receive_time,
                       o.status,
                       o.payment,
                       o.note,
                       
                       o.receiver_name as receiver,
                       o.receiver_phone,
                       o.receiver_phone as receive_phone,
                       CONCAT(o.receiver_street, ', ', o.receiver_ward, ', ', o.receiver_district, ', ', o.receiver_city) as receive_address,
                       
                       CONCAT(ua.first_name, ' ', ua.last_name) as fullname,
                       ua.phone as phone

                FROM app.orders o
                LEFT JOIN app.customer c ON o.customer_id = c.user_id
                LEFT JOIN app.user_account ua ON c.user_id = ua.user_id
                
                WHERE DATE(o.order_time) = $1
                ORDER BY o.order_time DESC
            `;
            const res = await pool.query(query, [date]);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getAllOrdersByReceiveDate(date) {
        try {
            const query = `
                SELECT o.order_id as id,
                       o.total_amount,
                       o.order_time as ordertime,
                       o.receive_time,
                       o.status,
                       o.payment,
                       o.note,
                       
                       o.receiver_name as receiver,
                       o.receiver_phone,
                       o.receiver_phone as receive_phone,
                       CONCAT(o.receiver_street, ', ', o.receiver_ward, ', ', o.receiver_district, ', ', o.receiver_city) as receive_address,
                       
                       CONCAT(ua.first_name, ' ', ua.last_name) as fullname,
                       ua.phone as phone

                FROM app.orders o
                LEFT JOIN app.customer c ON o.customer_id = c.user_id
                LEFT JOIN app.user_account ua ON c.user_id = ua.user_id
                
                WHERE DATE(o.receive_time) = $1
                ORDER BY o.receive_time ASC
            `;
            const res = await pool.query(query, [date]);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getOrderDetail(orderId) {
        try {
            // SỬA: Query từ bảng order_line
            const query = `
                SELECT p.id as prod_id, 
                       p.name, 
                       p.images, 
                       ol.quantity, 
                       ol.price
                FROM app.order_line ol
                JOIN app.product p ON ol.product_id = p.id
                WHERE ol.order_id = $1
            `;
            const res = await pool.query(query, [orderId]);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async updateOrderStatus({ orderId, newStatus }) {
        try {
            const query = `UPDATE app.orders SET status = $1 WHERE order_id = $2`;
            await pool.query(query, [newStatus, orderId]);
        } catch (error) {
            throw error;
        }
    }
    
    static async updateInternalNote(orderId, note) {
        try {
            const query = `UPDATE app.orders SET note = $1 WHERE order_id = $2`; 
            await pool.query(query, [note, orderId]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Order;