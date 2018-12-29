var router = require('koa-router')();
var userModel = require('../lib/mysql.js')
var md5 = require('md5')

router.post('/login', async(ctx, next) => {
    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    var result={
        flag:false,
        msg:'请输入用户名和密码！！'
    }
    if(username&&password){
        await userModel.selectUser([username,md5(password + 'asd&$BH&*')]).then(res=>{
            if(res.length==1){
                result={
                    flag:true,
                    msg:'恭喜您！'+username+'登陆成功'
                }
            }
            else{
                result={
                    flag:false,
                    msg:'用户名重名或密码不对！'
                }
            }
        }).catch(err => {
            result.msg='出现错误！！'
        })
        if(result.flag){
            await userModel.findUserByName(username).then(res=>{
                ctx.session.id = res[0].Id;
                ctx.session.username=res[0].Username;
                ctx.session.avator = res[0].Avatar;
            }).catch(err => {
                result.msg='出现错误！！'
            })
        }
    }
    ctx.body = result
})

module.exports = router