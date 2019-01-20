require('babel-register')
const koa = require("koa");   //node框架
const path = require("path");  
const bodyParser = require("koa-bodyparser"); //表单解析中间件
const ejs = require("ejs");   //模板引擎
const session = require("koa-session-minimal");   //处理数据库的中间件
const MysqlStore = require("koa-mysql-session");  //处理数据库的中间件
const router = require("koa-router");     //路由中间件
const config = require('./config/default.js');    //引入默认文件
const views = require("koa-views");   //模板呈现中间件
const koaStatic = require("koa-static");  //静态资源加载中间件
const staticCache = require('koa-static-cache')
const app = new koa();

//session存储配置
const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

//配置session中间件
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
}))

//配置静态资源加载中间件
app.use(koaStatic(
    path.join(__dirname , './public')
))

//配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'),{
    extension: 'ejs'
}))

//使用表单解析中间件
app.use(bodyParser({
    "formLimit":"5mb",
    "jsonLimit":"5mb",
    "textLimit":"5mb"
}));

//使用新建的路由文件
//首页
app.use(require('./routers/home.js').routes())
//登录
app.use(require('./routers/login.js').routes())
//注册
app.use(require('./routers/register.js').routes())
//个人主页
app.use(require('./routers/personal').routes())
//退出登录
app.use(require('./routers/exit.js').routes())
// 后台管理的路由
app.use(require('./routers/admin/user.js').routes())// 用户管理
app.use(require('./routers/admin/banner.js').routes())// 轮播图
app.use(require('./routers/admin/address.js').routes())// 用户地址
app.use(require('./routers/admin/comment.js').routes())// 图书评论
app.use(require('./routers/admin/goods.js').routes())// 图书管理
app.use(require('./routers/admin/shopcarts.js').routes())// 购物车
//错误
app.use(require('./utils/handle.js'))
//监听端口
app.listen(config.port) 

console.log(`${config.HOST}${config.port}`)
