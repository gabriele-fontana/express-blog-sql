require('dotenv').config();

const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.host ||'localhost',
    user: process.env.user_name ||'user_name',
    password: process.env.password ||'password',
    database: process.env.database_name ||'database_name'
});

//check connection
db.getConnection()
    .then(() => console.log('✅ Database connected'))
    .catch((err) => console.error('❌ Database connection error:', err));

module.exports = db;