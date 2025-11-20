const pool = require('../config/pool');

class Account {
    static async findByEmail(email) {
        try {
            const result = await pool.query('SELECT * FROM useraccount WHERE email = $1', [email]);
            return result.rows[0];
        } catch(error) {
            console.error('Error cannot find email:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query('SELECT * FROM useraccount WHERE id = $1', [id]);
            return result.rows[0];
        } catch(error) {
            console.error('Error cannot find id:', error);
            throw error;
        }
    }

    static async signUp(data) {
        try {
            const query = `INSERT INTO useraccount 
                        (fullname, email, password, updatedat, role_id)
                        VALUES ($1, $2, $3, NOW(), $4) RETURNING id, email, fullname`;
            const values = [data.name, data.email, data.password, 1];
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
                        SET fullname = $1, email = $2, phone = $3, updatedat = NOW()
                        WHERE id = $4
                        RETURNING id, fullname AS name, email, phone;
                        `;
            const values = [data.name, data.email, data.phone, data.id];
            const result = await pool.query(query, values);
            return result;
        } catch(error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = Account;