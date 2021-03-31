const express = require('express');
const router = express.Router();
// 连接数据库
const conn = require('../util/sql.js')

// 普通键值对
router.use(express.urlencoded());

const jwt = require('jsonwebtoken');

// 注册接口
router.post('/reguser', function (req, res) {
    console.log('接受到的数据是:', req.body);
    const { username, password } = req.body;
    const sqlStr = `insert into users (username,password) values("${username}","${password}")`;
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.status(500).json({ msg: '注册失败', code: 500 });
            return
        }
        if (result.length < 0) {
            res.json({ code: '500', msg: '注册失败' });
        }
        res.json({ code: 200, msg: '注册成功' });
    })
})

// 登录接口
router.post('/login', function (req, res) {
    console.log('接受的数据是:', req.body);
    const { username, password } = req.body;
    const sqlStr = `select username ,password from users where username="${username}" and password="${password}"`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ code: 500, msg: '登录失败' })
            return
        }
        if (result.length < 0) {
            res.json({ code: 500, msg: '登录失败' });
        }
        res.json({ code: 200, msg: '登录成功' });
    })
})

// token身份认证
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ status: 1, message: '身份认证失败！' });
    }
});


module.exports = router;