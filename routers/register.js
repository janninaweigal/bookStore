var router = require('koa-router')();
var userModel = require('../lib/mysql.js');
var md5 = require('md5')

// post 注册
router.post('/register', async(ctx, next) => {
    const body=ctx.request.body
    const username = body.username
    const password =body.password
    const email =body.email
    let result={
        flag:false,
        msg:'用户名已被注册！'
    }
    let flag=false;
    await userModel.findUserByName(username).then(res=>{
        if(res.length==0){
            flag=true;
        }
    }).catch(()=>{
        result.msg='出现错误！！'
    })
    if(flag){
        // 没有用户
        await userModel.insertUser([username, md5(password + 'asd&$BH&*'),email ]).then(res=>{
            ctx.session.id = res.insertId;
            ctx.session.username=username;
            ctx.session.avatar = '/images/default.jpg';
            ctx.session.email = email;
            ctx.session.IsAdmin = 0;
            result={
                flag:true,
                msg:'用户名'+username+',注册成功！'
            }
        }).catch(()=>{
            result.msg='出现错误！！'
        })
    }
    ctx.body=result
})

module.exports = router