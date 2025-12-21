const pool = require('../config/pool');

class Employee {
    static async getEmployees() {
        try {
            const query = `SELECT fullname, e.id, email, phone, hire_date FROM employee e
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
                        ($1, $2, $3, 2)`;
            const values1 = [data.email, data.phone, data.password];
            const res = await pool.query(query1, values1);
            const userId = res.rows[0].id;

            const query2 = `INSERT INTO employee(id, user_id, fullname, gender, manager_id) VALUES
                        ($1, $2, $3, $4, $5)`;
            const values2 = [data.id, data.userId, data.fullname, data.gender, data.managerId];
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
}

module.exports = Employee;