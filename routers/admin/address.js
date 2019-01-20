var router = require('koa-router')();
// var userModel = require('../../lib/mysql.js')
import {getMenu} from '../../utils/admin'//后台的方法集合
// 用户地址
router.get('/admin/address',async(ctx,next)=>{
    const userId=ctx.session.id
    const menus=getMenu('用户管理','/admin/address')
    const title='address.ejs'
    if(!userId) ctx.redirect('/');//不登陆跳转到主页
    await ctx.render('admin',{
        session: ctx.session,
        menus:menus,
        title:title
    })
})
module.exports = router