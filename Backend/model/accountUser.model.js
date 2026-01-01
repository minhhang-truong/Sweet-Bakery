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
            if (user.rows.length === 0) return null;
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
            if (result.rows.length === 0) return null;
            const user = await pool.query('SELECT * FROM employee WHERE user_id = $1', [result.rows[0].id]);
            if (user.rows.length === 0) return null;
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
            if (user.rows.length === 0) return null;
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
            const user = await pool.query('SELECT * FROM customer WHERE user_id = $1', [result.rows[0].id]);
            return {
                fullname: user.rows[0].fullname,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                address: user.rows[0].address,
                dob: user.rows[0].dob,
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
                        SET fullname = $1, address = $2, dob = $4
                        WHERE user_id = $3
                        RETURNING fullname, address;`;
            const values2 = [data.name, data.address, data.id, data.dob];
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

    static async updateEmployee(data, id) {
        try {
            const query = `
                        UPDATE useraccount
                        SET phone = $1, updatedat = NOW()
                        WHERE id = $2
                        RETURNING id, phone, role_id;
                        `;
            const values = [data.phone, id];
            const result = await pool.query(query, values);
            const query2 = `
                        UPDATE employee
                        SET email = $1, address = $2, avatar = $3
                        WHERE user_id = $4
                        RETURNING fullname, address, avatar, department, hire_date;`;
            const values2 = [data.email, data.address, data.avatar, id];
            const user = await pool.query(query2, values2);
            let d = '';
            if(data.dob?.length !== 0) d = await pool.query(`UPDATE employee SET dob = $1 WHERE user_id = $2 RETURNING dob`,[data.dob, id]);
            return {
                id: result.rows[0].id,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                fullname: user.rows[0].fullname,
                address: user.rows[0].address,
                avatar: user.rows[0].avatar,
                hire_date: user.rows[0].hire_date,
                department: user.rows[0].department,
                dob: d ? d.rows[0].dob : null,
                role: result.rows[0].role_id,
            };
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    static async findEmployeeById(id) {
        try {
            const result = await pool.query('SELECT * FROM useraccount WHERE id = $1', [id]);
            const user = await pool.query('SELECT * FROM employee WHERE user_id = $1', [id]);
            return {
                fullname: user.rows[0].fullname,
                loginEmail: result.rows[0].email,
                phone: result.rows[0].phone,
                address: user.rows[0].address,
                dob: user.rows[0].dob,
                hire_date: user.rows[0].hire_date,
                avatar: user.rows[0].avatar,
                department: user.rows[0].department,
                email: user.rows[0].email,
            }
        } catch(error) {
            console.error('Error cannot find id:', error);
            throw error;
        }
    }    

    static async getPassword(id) {
        try {
            const result = await pool.query('SELECT password FROM useraccount WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error getting password:', error);
            throw error;
        }
    }

    static async changePassword(id, newPassword) {
        try {
            const query = `UPDATE useraccount SET password = $1,
                        updatedat = NOW() WHERE id = $2`;
            const values = [newPassword, id];
            await pool.query(query, values);
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }

    static async findManagerById(id) {
        try {
            const result = await pool.query('SELECT * FROM useraccount WHERE id = $1', [id]);
            const user = await pool.query('SELECT * FROM manager WHERE user_id = $1', [id]);
            return {
                fullname: user.rows[0].fullname,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                address: user.rows[0].address,
                dob: user.rows[0].dob,
                avatar: user.rows[0].avatar,
                department: user.rows[0].department,
            }
        } catch(error) {
            console.error('Error cannot find id:', error);
            throw error;
        }
    }

    static async updateManager(data, id) {
        try {
            const query = `
                        UPDATE useraccount
                        SET email = $1, phone = $2, updatedat = NOW()
                        WHERE id = $3
                        RETURNING id, email, phone, role_id;
                        `;
            const values = [data.email, data.phone, id];
            const result = await pool.query(query, values);
            const query2 = `
                        UPDATE manager
                        SET fullname = $1, address = $2, department = $3, avatar = $4
                        WHERE user_id = $5
                        RETURNING fullname, address, avatar, department;`;
            const values2 = [data.fullname, data.address, data.department, data.avatar, id];
            const user = await pool.query(query2, values2);
            let d = '';
            if(data.dob.length !== 0) d = await pool.query(`UPDATE manager SET dob = $1 WHERE user_id = $2 RETURNING dob`,[data.dob, id]);
            return {
                id: result.rows[0].id,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                fullname: user.rows[0].fullname,
                address: user.rows[0].address,
                avatar: user.rows[0].avatar,
                department: user.rows[0].department,
                dob: d ? d.rows[0].dob : '',
                role: result.rows[0].role_id,
            };
        } catch(error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = Account;