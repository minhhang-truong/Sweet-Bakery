const pool = require('../config/pool');

class Order {
    static async createOrder(data) {
        try {
            const query = `INSERT INTO orders
                        (id, orderdate, customer_id, total_amount, payment, receive_time, receive_date, note, receive_address, receiver, receive_phone, status)
                        VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`;
            const values = [data.id, data.cus_id, data.prices.total, data.payment, data.time.slot, data.time.date, data.customer.note, data.address, data.receiver.name, data.receiver.phone, data.status];
            const res = await pool.query(query, values);

            if(data.employee_id) {
                const q = await pool.query(`SELECT id FROM employee WHERE user_id = $1`, [data.employee_id]);
                await pool.query(`UPDATE orders SET employee_id = $1 WHERE id = $2`, [q.rows[0].id, res.rows[0].id]);
            }
            
            for(let item of data.items){
                let queryItem = `INSERT INTO orderline(order_id, prod_id, quantity, orderdate)
                                VALUES ($1, $2, $3, CURRENT_DATE)`;
                let valuesItem = [data.id, item.id, item.qty];
                await pool.query(queryItem, valuesItem);
            }
            return res.rows[0];
        } catch (error){
            console.error(error);
            throw error;
        }
    }

    static async getOrder(userId){
        try {
            const query = `SELECT id, orderdate, status, total_amount FROM orders WHERE customer_id = $1 ORDER BY orderdate DESC`;
            const values = [userId];
            const res = await pool.query(query, values);
            const result = [];
            for (let order of res.rows){
                const orderquery = `SELECT p.name as name, o.quantity as qty, p.price as price FROM orderline o
                                    JOIN product p ON o.prod_id = p.id
                                    WHERE o.order_id = $1`;
                const ans = await pool.query(orderquery, [order.id]);
                order.items = ans.rows;
                result.push(order);
            }
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async findOrder(orderId) {
        try {
            const query = `SELECT * FROM orders WHERE id = $1`;
            const values = [orderId];
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getAllOrdersByDate(data){
        try {
            const query = `SELECT orders.id,
                                    COALESCE(fullname, receiver) AS fullname,
                                    receive_phone, ordertime, total_amount, orders.status,
                                    receive_date, receive_time, receive_address, receiver,
                                    COALESCE(phone, receive_phone) AS phone,
                                    payment
                                    FROM orders
                           LEFT JOIN customer ON orders.customer_id = customer.user_id
                           LEFT JOIN useraccount ON customer.user_id = useraccount.id
                           WHERE orderdate = $1
                           ORDER BY ordertime;`
            const value = [data]
            const res = await pool.query(query, value);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getOrderDetail(orderId) {
        try {
            const query = `SELECT prod_id, quantity, p.price FROM orderline o
                           JOIN product p ON o.prod_id = p.id
                           WHERE o.order_id = $1;`
            const values = [orderId];
            const res = await pool.query(query, values);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async updateOrderStatus({ orderId, newStatus }) {
        try {
            await pool.query("BEGIN");

            // Lock order
            const { rows: orderRows } = await pool.query(
                `SELECT status
                FROM orders
                WHERE id = $1
                FOR UPDATE`,
                [orderId]
            );

            if (orderRows.length === 0) {
                throw {
                    status: 404,
                    message: 'Order not found',
                };
            }

            const oldStatus = orderRows[0].status;

            // Validate transition
            const allowedTransitions = {
                pending: ["confirmed", "cancelled"],
                confirmed: ["delivering", "cancelled"],
                delivering: ["completed", "cancelled"],
                completed: [],
                cancelled: []
            };

            if (!allowedTransitions[oldStatus].includes(newStatus)) {
                throw {
                    status: 400,
                    message: `Cannot change status from ${oldStatus} to ${newStatus}`,
                }
            }

            // pending → confirmed : TRỪ STOCK
            if (oldStatus === "pending" && newStatus === "confirmed") {
                const { rows: items } = await pool.query(
                `SELECT prod_id, quantity
                FROM orderline
                WHERE order_id = $1`,
                [orderId]
                );

                for (const item of items) {
                    // lock product
                    const { rows: productRows } = await pool.query(
                        `SELECT stock
                        FROM product
                        WHERE id = $1
                        FOR UPDATE`,
                        [item.prod_id]
                    );

                    if (productRows.length === 0) {
                        throw {
                            status: 409,
                            message: `Product not found`,
                        }
                    }

                    if (productRows[0].stock < item.quantity) {
                        throw {
                            status: 409,
                            message: `Product ${err.productId} is out of stock`,
                        }
                    }

                    await pool.query(
                        `UPDATE product
                        SET stock = stock - $1
                        WHERE id = $2`,
                        [item.quantity, item.prod_id]
                    );
                }
            }

            // confirmed → cancelled : HOÀN STOCK
            if (oldStatus === "confirmed" && newStatus === "cancelled") {
                const { rows: items } = await pool.query(
                `SELECT prod_id, quantity
                FROM orderline
                WHERE order_id = $1`,
                [orderId]
                );

                for (const item of items) {
                    await pool.query(
                        `UPDATE product
                        SET stock = stock + $1
                        WHERE id = $2`,
                        [item.quantity, item.prod_id]
                    );
                }
            }

            // Update order status (có điều kiện)
            const result = await pool.query(
                `UPDATE orders
                SET status = $1
                WHERE id = $2
                AND status = $3`,
                [newStatus, orderId, oldStatus]
            );

            if (result.rowCount !== 1) {
                throw {
                    status: 409,
                    message: "Order was updated by another employee",
                }
            }

            await pool.query("COMMIT");
            return { success: true };
        } catch (err) {
            await pool.query("ROLLBACK");
            console.error(err);
            throw err;
        }
    }
}

module.exports = Order;