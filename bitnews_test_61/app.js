const express = require("express");
const server = express();


// 解决跨域问题
const cors = require('cors');
server.use(cors())

// 路由中间件
const apirouter = require('./router/api_router');
server.use('/api', apirouter);

const myrouter = require('./router/my_router');
server.use('/my', myrouter);


// 静态资源托管
server.use('/uploads', express.static('uploads'))

// token管理
const jwt = require('express-jwt');
server.use(jwt({
    secret: 'gz61', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/login', '/api/register', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}));


// token身份认证
server.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({ status: 1, message: '身份认证失败！' });
    }
});


// 开启服务器端口
server.listen('3000', function () {
    console.log("服务器端口号3000开启成功");
})