# dangdang
用nodejs + mysql + bootstrap +jquery开发类似当当网的网站
<br>
技术栈：koa2-ejs-jquery混合原生js-bootstrap-mysql
## 目录结构：
* 1.config存放默认文件<br>
* 2.lib存放数据库文件<br>
* 3.middlewares存放判断登陆注册与否文件<br>
* 4.public存放样式文件，js,引用bootstrap框架等文件<br>
* 5.routers存放路由文件<br>
* 6.views存放模板文件<br>
* 7.index是程序主文件，定义接口，数据库接口，引用模块等<br>
* 8.package.json项目的配置文件，包括项目名，作者，依赖，模块等<br>
## 安装模块中间件：
` npm install `
* 安装mysql<br>
mysql版本推荐使用5.7以下的，5.7的有个bug，图形化界面推荐使用navicat for mysql
* 运行可以安装supervisor（npm install supervisor 项目运行工具，开启后即处于监听模式，修改文件后保存即可，无需再启动项目）
`  node index 或supervisor index `
* localhost:8080/home 端口号可自行修改
# 功能模块
* 登录注册
* 个人信息维护、头像等基本信息

# es6 -> es5 
npm install --save-dev babel-preset-env babel-cli
*创建.babelrc文件
{
  "presets": [
    ["env", {
      "targets": {
        "node": "current"
      }
    }]
  ]
}
