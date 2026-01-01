const pool = require('../config/pool');

class Employee {
    static async getEmployees() {
        try {
            const query = `SELECT fullname, e.id, u.email, phone, department FROM employee e
                        JOIN useraccount u ON e.user_id = u.id`;
            const res = await pool.query(query);
            return res.rows;
        } catch ( error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    static async addEmployee(data) {
        try {
            const query1 = `INSERT INTO useraccount(email, phone, password, role_id) VALUES
                        ($1, $2, $3, 2) RETURNING id`;
            const values1 = [data.loginEmail, data.phoneNumber, data.password];
            const res = await pool.query(query1, values1);
            const userId = res.rows[0].id;

            const query2 = `INSERT INTO employee(user_id, fullname, dob, gender, avatar, address, department, id, manager_id) VALUES
                        ($1, $2, $3, $4, $5, $6, $7, $8, 1)`;
            const values2 = [userId, data.fullName, data.dob, data.gender, data.avatar, data.address, data.department, data.empId];
            await pool.query(query2, values2);
        } catch (error) {
            console.error('Error adding employee: ', error);
            throw error;
        }
    }

    static async deleteEmployee(id) {
        try {
            const query = `SELECT user_id FROM employee WHERE id = $1`;
            const userId = await pool.query(query, [id]);

            const deleteEmployee = `DELETE FROM employee WHERE id = $1`;
            await pool.query(deleteEmployee, [id]);

            const deleteUser = `DELETE FROM useraccount WHERE id = $1`;
            await pool.query(deleteUser, [userId.rows[0].user_id]);
        } catch (error) {
            console.error('Error deleting employee: ', error);
            throw error;
        }
    }

    static async getEmployeeDetails(id) {
        try {
            const query = `SELECT fullname, e.id, phone, u.email AS loginEmail, e.email, address, hire_date, dob, gender, avatar, department
                            FROM employee e
                            JOIN useraccount u ON u.id = e.user_id
                            WHERE e.id = $1`;
            const res = await pool.query(query, [id]);
            return res.rows[0];
        } catch (error) {
            console.error('Error get details employee: ', error);
            throw error;
        }
    }

    static async editEmployee(data) {
        try {
            const query = `UPDATE employee SET department = $1, avatar = $2 WHERE id = $3`;
            const values = [data.department, data.avatar, data.empId];
            await pool.query(query, values);
        } catch (error) {
            console.error('Error edit employee: ', error);
            throw error;
        }
    }
}

module.exports = Employee;