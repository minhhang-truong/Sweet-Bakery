const pool = require('../config/pool');

class Revenue {
    static async getGeneralRevenue(date) {
        try {
            // Phần này giữ nguyên, đảm bảo ép kiểu ::DATE
            const q1 = `SELECT COUNT(order_id) AS total_orders, COALESCE(SUM(total_amount), 0) AS total_revenue
                        FROM app.orders
                        WHERE order_time::DATE = $1 AND status = 'completed'`;
            const general = await pool.query(q1, [date]);
            
            const q2 = `SELECT COALESCE(SUM(ol.quantity), 0) AS total_items
                        FROM app.order_line ol
                        JOIN app.orders o ON o.order_id = ol.order_id
                        WHERE o.order_time::DATE = $1 AND o.status = 'completed'`;
            const items = await pool.query(q2, [date]);
            
            const q3 = `SELECT p.name, SUM(ol.quantity) AS sold_quantity FROM app.order_line ol
                        JOIN app.orders o ON o.order_id = ol.order_id
                        JOIN app.product p ON p.id = ol.product_id
                        WHERE o.order_time::DATE = $1 AND o.status = 'completed'
                        GROUP BY p.id, p.name
                        ORDER BY sold_quantity DESC
                        LIMIT 5`;
            const top_items = await pool.query(q3, [date]);
            return {
                total_revenue: general.rows[0].total_revenue,
                total_orders: general.rows[0].total_orders,
                total_items: items.rows[0].total_items,
                top: top_items.rows,
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getWeeklyRevenue(startOfWeek, date) {
        try {
            // Chỉ cần gọi Function đã tạo trong DB
            const query = `SELECT * FROM app.get_weekly_revenue($1, $2)`;
            
            // Tham số truyền vào vẫn là ngày bắt đầu và kết thúc
            const values = [startOfWeek, date]; 
            
            const res = await pool.query(query, values);
            return res.rows;
        } catch (error) {
            console.error("Error calling DB function:", error);
            throw error;
        }
    }
}

module.exports = Revenue;