const mysql      = require('mysql');

const db = mysql.createConnection({
host     : '3.34.47.52',
port     : '3306',
user     : 'son',
password : 'sky09097!',
database : 'TODO',
multipleStatements : true,
charset : 'utf8mb4'
});
console.log("called db - connection")

module.exports = db