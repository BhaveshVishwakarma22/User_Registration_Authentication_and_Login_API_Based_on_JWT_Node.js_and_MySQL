const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bhavesh@123',
    database: 'testx'
})

connection.connect((err)=>{
    if(err) throw err;
    console.log('Connected to MySql Server!');
})


module.exports = connection;