const pool = require('../config/pool');

class Account {
    static async transaction(state) {
        try {
            await pool.query(state ? 'BEGIN' : 'COMMIT');
        } catch (error) {
            console.error('Transaction error:', error);
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const result = await pool.query('SELECT * FROM useraccount WHERE email = $1', [email]);
            if (result.rows.length === 0) return null   ;
            const user = await pool.query('SELECT * FROM customer WHERE user_id = $1', [result.rows[0].id]);
            return {
                id: result.rows[0].id,
                fullname: user.rows[0].fullname,
                email: result.rows[0].email,
                password: result.rows[0].password,
                role: result.rows[0].role_id,
            }
        } catch(error) {
            console.error('Error cannot find email:', error);
            throw error;
        }
    }

    static async findEmployeeByEmail(email) {
        try {
            const result = await pool.query('SELECT * FROM useraccount WHERE email = $1', [email]);
            if (result.rows.length === 0) return null   ;
            const user = await pool.query('SELECT * FROM employee WHERE user_id = $1', [result.rows[0].id]);
            return {
                id: result.rows[0].id,
                fullname: user.rows[0].fullname,
                email: result.rows[0].email,
                password: result.rows[0].password,
                role: result.rows[0].role_id,
            }
        } catch(error) {
            console.error('Error cannot find email:', error);
            throw error;
        }
    }

    static async findManagerByEmail(email) {
        try {
            const result = await pool.query('SELECT * FROM useraccount WHERE email = $1', [email]);
            if (result.rows.length === 0) return null   ;
            const user = await pool.query('SELECT * FROM manager WHERE user_id = $1', [result.rows[0].id]);
            return {
                id: result.rows[0].id,
                fullname: user.rows[0].fullname,
                email: result.rows[0].email,
                password: result.rows[0].password,
                role: result.rows[0].role_id,
            }
        } catch(error) {
            console.error('Error cannot find email:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query('SELECT * FROM useraccount WHERE id = $1', [id]);
            const user = await pool.query('SELECT * FROM customer WHERE user_id = $1', [result.rows[0].id])
            return {
                fullname: user.rows[0].fullname,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                address: user.rows[0].address,
            }
        } catch(error) {
            console.error('Error cannot find id:', error);
            throw error;
        }
    }

    static async signUp(data) {
        try {
            const query = `INSERT INTO useraccount 
                        (email, password, createdat, role_id)
                        VALUES ($1, $2, NOW(), $3) RETURNING id, email`;
            const values = [data.email, data.password, 1];
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async addCus(data) {
        try {
            const query = `INSERT INTO customer(user_id, fullname)
                        VALUES ($1, $2) RETURNING fullname`;
            const values = [data.id, data.name];
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async update(data) {
        try {
            const query = `
                        UPDATE useraccount
                        SET email = $1, phone = $2, updatedat = NOW()
                        WHERE id = $3
                        RETURNING id, email, phone;
                        `;
            const values = [data.email, data.phone, data.id];
            const result = await pool.query(query, values);
            const query2 = `
                        UPDATE customer
                        SET fullname = $1, address = $2
                        WHERE user_id = $3
                        RETURNING fullname, address;`;
            const values2 = [data.name, data.address, data.id];
            const user = await pool.query(query2, values2);
            return {
                id: result.rows[0].id,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                fullname: user.rows[0].fullname,
                address: user.rows[0].address,
            };
        } catch(error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = Account;