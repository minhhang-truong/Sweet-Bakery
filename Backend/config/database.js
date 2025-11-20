const pool = require('./pool');

// PostgreSQL connection setup
module.exports.connect = async () => {
    try {
        await pool.connect();
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection error');
    }
}