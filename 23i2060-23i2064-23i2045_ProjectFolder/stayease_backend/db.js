const mysql = require('mysql2');
require('dotenv').config();


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'dbpassword123',
    database: 'stayease_db',
    waitForConnections: true,
    connectionLimit: 10
});


module.exports = pool.promise(); 
