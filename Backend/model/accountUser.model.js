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

    // Hàm hỗ trợ tách tên
    static splitName(fullname) {
        if (!fullname) return { firstName: 'Unknown', lastName: 'User' };
        const parts = fullname.trim().split(/\s+/);
        if (parts.length === 1) return { firstName: parts[0], lastName: '' };
        const lastName = parts.pop();
        const firstName = parts.join(' ');
        return { firstName, lastName };
    }

    // --- 1. Dùng cho Khách hàng (Customer) ---
    static async findByEmail(email) {
        try {
            // Join bảng user_account để lấy thông tin đăng nhập
            //RQ2: Soft Delete User and Partial Index
            const query = `
                SELECT ua.user_id as id, email, password, role, 
                       CONCAT(first_name, ' ', last_name) as fullname 
                FROM user_account ua
                JOIN customer c ON ua.user_id = c.user_id
                WHERE ua.email = $1`;
            const result = await pool.query(query, [email]);
            
            if (result.rows.length === 0) return null;
            return result.rows[0];
        } catch(error) {
            console.error('Error cannot find email:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const query = `
                SELECT ua.user_id as id, ua.email, ua.phone, 
                       CONCAT(ua.first_name, ' ', ua.last_name) as fullname,
                       ua.address_detail as address, ua.dob
                FROM user_account ua
                WHERE ua.user_id = $1
            `;
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) return null;
            return result.rows[0];
        } catch(error) {
            console.error('Error cannot find id:', error);
            throw error;
        }
    }

    // --- 2. Dùng cho Nhân viên (Employee) ---
    static async findEmployeeByEmail(email) {
        try {
            // Join user_account và employee để lấy đầy đủ thông tin check quyền
            //Request 1

            const query = `
                SELECT user_id, email, password, role,
                        CONCAT(first_name, ' ', last_name) as fullname,
                        position as department, phone
                FROM app.v_employee_profile
                WHERE email = $1
                AND deleted_at IS NULL
            `;
            const result = await pool.query(query, [email]);
            if (result.rows.length === 0) return null;
            return result.rows[0];
        } catch (error) {
            console.error('Error findEmployeeByEmail:', error);
            throw error;
        }
    }

    static async findEmployeeById(id) {
        try {
            const query = `
                SELECT ua.user_id as id, ua.email, ua.phone, 
                       CONCAT(ua.first_name, ' ', ua.last_name) as fullname,
                       ua.address_detail as address, ua.dob, ua.avatar,
                       e.position as department, e.hire_date, ua.role
                FROM user_account ua
                JOIN employee e ON ua.user_id = e.user_id
                WHERE ua.user_id = $1
            `;
            /*const query = `
                SELECT user_id, email, phone,
                        CONCAT(first_name, ' ', last_name) as fullname,
                        CONCAT(address_detail, ', ', address_ward, ', ',)
                        CONCAT(ua.first_name, ' ', ua.last_name)
                        position as department, phone
                FROM app.v_employee_profile
                WHERE email = $1
                AND deleted_at IS NULL
            `;*/ //đg làm dở
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) return null;
            return result.rows[0];
        } catch (error) {
            console.error('Error findEmployeeById:', error);
            throw error;
        }
    }

    static async updateEmployee(data, id) {
        try {
            const { firstName, lastName } = Account.splitName(data.fullname);
            // Update bảng user_account
            const query = `
                UPDATE user_account 
                SET phone = $1, address_detail = $2, first_name = $3, last_name = $4,
                    dob = $5, avatar = $6, updated_at = NOW()
                WHERE user_id = $7
                RETURNING user_id as id, email, phone, CONCAT(first_name, ' ', last_name) as fullname, address_detail as address, avatar`;
            
            const values = [data.phone, data.address, firstName, lastName, data.dob, data.avatar, id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // --- 3. Dùng cho Quản lý (Manager/Admin) ---
    static async findManagerByEmail(email) {
        try {
            // Join user_account và manager
            const query = `
                SELECT ua.user_id as id, ua.email, ua.password, ua.role,
                       CONCAT(ua.first_name, ' ', ua.last_name) as fullname,
                       m.department
                FROM user_account ua
                JOIN manager m ON ua.user_id = m.user_id
                WHERE ua.email = $1
            `;
            const result = await pool.query(query, [email]);
            if (result.rows.length === 0) return null;
            return result.rows[0];
        } catch (error) {
            console.error('Error findManagerByEmail:', error);
            throw error;
        }
    }

    static async findManagerById(id) {
        try {
            const query = `
                SELECT ua.user_id as id, ua.email, ua.phone, 
                       CONCAT(ua.first_name, ' ', ua.last_name) as fullname,
                       ua.address_detail as address, ua.dob, ua.avatar,
                       m.department
                FROM user_account ua
                JOIN manager m ON ua.user_id = m.user_id
                WHERE ua.user_id = $1
            `;
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) return null;
            return result.rows[0];
        } catch (error) {
            console.error('Error findManagerById:', error);
            throw error;
        }
    }

    static async updateManager(data, id) {
        try {
            const { firstName, lastName } = Account.splitName(data.name || data.fullname);
            // Update thông tin Manager (chủ yếu là user_account)
            const query = `
                UPDATE user_account 
                SET phone = $1, address_detail = $2, first_name = $3, last_name = $4,
                    dob = $5, avatar = $6, updated_at = NOW()
                WHERE user_id = $7
                RETURNING user_id as id, email, phone, CONCAT(first_name, ' ', last_name) as fullname, address_detail as address, avatar`;
            
            const values = [data.phone, data.address, firstName, lastName, data.dob, data.avatar, id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // --- Các hàm chung ---
    static async signUp(data) {
        try {
            const fakeName = data.email.split('@')[0];
            const query = `INSERT INTO user_account 
                        (email, password, created_at, role, first_name, last_name, status, gender)
                        VALUES ($1, $2, NOW(), $3, $4, $5, 'active', 'other') RETURNING user_id as id, email`;
            const values = [data.email, data.password, 'customer', fakeName, '', ];
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async addCus(data) {
        try {
            const { firstName, lastName } = Account.splitName(data.name);
            await pool.query(`UPDATE user_account SET first_name = $1, last_name = $2 WHERE user_id = $3`, 
                [firstName, lastName, data.id]);
            const query = `INSERT INTO customer(user_id) VALUES ($1) RETURNING user_id`;
            await pool.query(query, [data.id]);
            return { fullname: data.name };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async update(data) {
        try {
            const { firstName, lastName } = Account.splitName(data.name);
            const query = `
                        UPDATE user_account
                        SET email = $1, phone = $2, first_name = $3, last_name = $4, 
                            address_detail = $5, updated_at = NOW()
                        WHERE user_id = $6
                        RETURNING user_id as id, email, phone, CONCAT(first_name, ' ', last_name) as fullname, address_detail as address;
                        `;
            const values = [data.email, data.phone, firstName, lastName, data.address, data.id];
            const result = await pool.query(query, values);
            
            if(data.dob && data.dob.length !== 0) {
                 await pool.query(`UPDATE user_account SET dob = $1 WHERE user_id = $2`,[data.dob, data.id]);
            }
            return result.rows[0];
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    static async getPassword(id) {
        try {
            const result = await pool.query('SELECT password FROM user_account WHERE user_id = $1', [id]);
            if (result.rows.length === 0) return null;
            return result.rows[0];
        } catch (error) {
             throw error;
        }
    }

    static async changePassword(id, newPassword) {
        try {
            const query = `UPDATE user_account SET password = $1, updated_at = NOW() WHERE user_id = $2`;
            await pool.query(query, [newPassword, id]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Account;