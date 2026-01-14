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
            const query = `
                WITH date_series AS (
                    SELECT generate_series($1::date, $2::date, '1 day'::interval)::DATE AS day
                ),
                daily_orders AS (
                    SELECT 
                        order_time::DATE as day, 
                        COUNT(order_id) as total_orders,
                        SUM(total_amount) as total_revenue
                    FROM app.orders
                    WHERE status = 'completed' AND order_time::DATE BETWEEN $1 AND $2
                    GROUP BY order_time::DATE
                ),
                daily_items AS (
                    SELECT 
                        o.order_time::DATE as day,
                        SUM(ol.quantity) as items_sold
                    FROM app.orders o
                    JOIN app.order_line ol ON o.order_id = ol.order_id
                    WHERE o.status = 'completed' AND o.order_time::DATE BETWEEN $1 AND $2
                    GROUP BY o.order_time::DATE
                )
                -- SỬA Ở ĐÂY: Đổi alias 'do' thành 'd_orders' để tránh trùng từ khóa
                SELECT 
                    ds.day, 
                    COALESCE(d_orders.total_revenue, 0) AS revenue,
                    COALESCE(d_orders.total_orders, 0) AS orders,
                    COALESCE(d_items.items_sold, 0) AS items
                FROM date_series ds
                LEFT JOIN daily_orders d_orders ON ds.day = d_orders.day
                LEFT JOIN daily_items d_items ON ds.day = d_items.day
                ORDER BY ds.day
            `;
            
            const values = [startOfWeek, date]; 
            const res = await pool.query(query, values);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = Revenue;