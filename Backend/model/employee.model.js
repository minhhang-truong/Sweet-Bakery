const pool = require('../config/pool');

class Employee {
    // Hàm helper tách tên
    static splitName(fullname) {
        if (!fullname) return { firstName: 'Unknown', lastName: 'Employee' };
        const parts = fullname.trim().split(/\s+/);
        if (parts.length === 1) return { firstName: parts[0], lastName: '' };
        const lastName = parts.pop();
        const firstName = parts.join(' ');
        return { firstName, lastName };
    }

    static async getEmployees() {
        try {
            // Sửa: employee.user_id là PK
            const query = `SELECT CONCAT(u.first_name, ' ', u.last_name) as fullname, e.user_id as id, u.email, u.phone, position as department 
                        FROM employee e
                        JOIN user_account u ON e.user_id = u.user_id`;
            const res = await pool.query(query);
            return res.rows;
        } catch ( error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    static async addEmployee(data) {
        try {
            const { firstName, lastName } = Employee.splitName(data.fullName);
            
            // Sửa: role_id -> role='staff'
            const query1 = `INSERT INTO user_account(email, phone, password, role, first_name, last_name, status, gender) VALUES
                        ($1, $2, $3, 'staff', $4, $5, 'active', $6) RETURNING user_id as id`;
            const values1 = [data.loginEmail, data.phoneNumber, data.password, firstName, lastName, data.gender];
            const res = await pool.query(query1, values1);
            const userId = res.rows[0].id;

            // Sửa: Bảng employee mới
            const query2 = `INSERT INTO employee(user_id, position, salary, hire_date) VALUES
                        ($1, $2, 0, NOW())`; // Default salary 0
            const values2 = [userId, data.department]; // data.department mapping vào position
            await pool.query(query2, values2);
            
            if(data.dob && data.dob.length !== 0) 
                await pool.query(`UPDATE user_account SET dob = $1 WHERE user_id = $2`, [data.dob, userId]);
            
            // Cập nhật avatar vào user_account
             if(data.avatar)
                await pool.query(`UPDATE user_account SET avatar = $1 WHERE user_id = $2`, [data.avatar, userId]);

        } catch (error) {
            console.error('Error adding employee: ', error);
            throw error;
        }
    }

    static async deleteEmployee(id) {
        try {
            // Schema mới: xóa user_account là cascade xóa employee
            const deleteUser = `DELETE FROM user_account WHERE user_id = $1`;
            await pool.query(deleteUser, [id]);
        } catch (error) {
            console.error('Error deleting employee: ', error);
            throw error;
        }
    }

    static async getEmployeeDetails(id) {
        try {
            const query = `SELECT CONCAT(u.first_name, ' ', u.last_name) as fullname, e.user_id as id, 
                            u.phone, u.email AS loginEmail, u.email, 
                            u.address_detail as address, hire_date, u.dob, u.gender, u.avatar, position as department
                            FROM employee e
                            JOIN user_account u ON u.user_id = e.user_id
                            WHERE e.user_id = $1`;
            const res = await pool.query(query, [id]);
            return res.rows[0];
        } catch (error) {
            console.error('Error get details employee: ', error);
            throw error;
        }
    }

    static async editEmployee(data) {
        try {
            // Update position ở bảng employee
            const query = `UPDATE employee SET position = $1 WHERE user_id = $2`;
            await pool.query(query, [data.department, data.empId]);
            
            // Update avatar ở bảng user_account
            await pool.query(`UPDATE user_account SET avatar = $1 WHERE user_id = $2`, [data.avatar, data.empId]);
        } catch (error) {
            console.error('Error edit employee: ', error);
            throw error;
        }
    }
}

module.exports = Employee;