const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'bignew61',
})

conn.connect((err) => {
    if (err) {
        console.log('数据库连接失败', err)
        return
    }
    console.log('数据库连接成功');
})

module.exports = conn;