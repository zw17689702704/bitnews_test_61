const { urlencoded } = require('express');
const express = require('express');
// 引入路由包
const router = express.Router();

// 获取数据库
const conn = require('../util/sql.js');


// 普通键值对
router.use(express.urlencoded())

router.get('/userinfo', (req, res) => {
    console.log('接受的数据是', req.query);
    const { username } = req.query;
    let sqlStr = `select * from users`
    if (username) {
        sqlStr += ` where username="${username}"`
    }
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ code: 500, msg: '获取失败' });
            return
        }
        res.json({ code: 200, msg: '获取成功', data: result });
        console.log('查询结果', result)
    })
})

router.post('/userinfo', (req, res) => {
    console.log('接受的数据是', req.body);
    const { id, nickname, email, userPic } = req.body;
    let condition = []
    if (nickname) condition.push(`nickname="${nickname}"`)
    if (email) condition.push(`email="${email}"`)
    if (userPic) condition.push(`userPic="${userPic}"`)
    const conditionStr = condition.join();
    const sqlStr = `update users set ${conditionStr} where id=${id}`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, code: 500, msg: '更新失败' });
            return
        }
        res.json({ status: 0, code: 200, msg: '更新成功' })
    })
})

// 上传头像

const multer = require('multer');
const { route } = require('./api_router.js');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        // console.log('file', file)
        // 目标：新名字是事件戳+后缀名
        const filenameArr = file.originalname.split('.');
        const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        cb(null, fileName) //
    }
});

const upload = multer({ storage })
router.post('/uploadFile', upload.single('file_data'), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    res.json({
        "code": 200,
        "msg": "上传成功",
        "status": 0,
        "src": `http://127.0.0.1:3000/uploads/${req.file.filename}`
    })
});


// 重置密码
router.post('/updatepwd', (req, res) => {
    console.log('接受的数据是', req.body);
    const { id, oldPwd, newPwd } = req.body;
    let sqlStr = `select  * from users where id=${id} and password="${oldPwd}" `

    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '获取密码失败' });
        }
        if (result.length > 0) {
            res.json({ status: 0, message: '获取密码成功' })
            let sqlStr1 = `update users set  password="${newPwd}" where id=${id}`
            conn.query(sqlStr1, (err, result) => {
                if (err) {
                    res.json({ status: 1, message: "修改密码失败" });
                } else {
                    res.json({
                        status: 0,
                        message: "更新密码成功！"
                    })
                }

            })
        }
        else {
            res.json({ status: 1, message: '获取密码失败' })
        }
    })
})

// 获取文章分类列表

router.get('/article/cates', (req, res) => {
    console.log('接收的数据是', req.query);
    const { id, name, slug } = req.query;
    const sqlStr = `select * from categories `
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, message: "获取文章分类列表失败" });
            return
        }
        res.json({
            status: 0,
            message: "获取文章分类列表成功！",
            data: result,
        })
    })
})

// 新增文章分类
router.post('/article/addcates', (req, res) => {
    console.log('接收的数据是', req.body);
    const { name, slug } = req.body;
    const sqlStr = `insert into categories (name,slug) values ("${name}","${slug}")`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, message: "新增文章分类失败" })
            return
        }
        res.json({ status: 0, message: '新增文章分类成功' })
    })
})

// 根据ID删除文章分类
router.get('/article/deletecate', (req, res) => {
    console.log('接收数据是', req.query);
    const { id } = req.query;
    const sqlStr = `select * from categories where id=${id}`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '获取文章失败' });
            return
        }
        else {
            // res.json({ status: 0, message: '获取文章成功' });
            const sqlStr1 = ` delete from categories where id=${id}`
            conn.query(sqlStr1, (err, result) => {
                if (err) {
                    res.json({ status: 1, message: '删除文章分类失败' })
                } else {
                    res.json({ status: 0, message: '删除文章分类成功' })
                }
            })
        }
    })
})


// 更具id获取文章分类数据
router.get('/article/getCatesById', (req, res) => {
    console.log('接收的数据是', req.query);
    const { id } = req.query;
    const sqlStr = `select * from categories where id=${id}`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                status: 1,
                message: "获取文章分类数据失败！",
            })
        } else {
            res.json({
                status: 0,
                message: "获取文章分类数据成功！",
                data: result,
            })
        }
    })
})

// 根据id更新文章分类数据
router.post('/article/updatecate', (req, res) => {
    console.log('接收的数据是', req.body);
    const { id, name, slug } = req.body;
    let condition = []
    if (name) condition.push(`name="${name}"`)
    if (slug) condition.push(`slug="${slug}"`)
    const conditionStr = condition.join();
    const sqlStr = `update categories set ${conditionStr} where id=${id}`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                status: 1,
                message: "更新分类信息失败！"
            })
        }
        res.json({
            status: 0,
            message: "更新分类信息成功！"
        })
    })
})

module.exports = router;

