const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'DrewsBrews',
  database: 'user_db'
});

module.exports = connection;
