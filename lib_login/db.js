var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'usertable'
});
db.connect();

module.exports = db;