var router = require('koa-router')();
// var userModel = require('../../lib/mysql.js')
import {getMenu} from '../../utils/admin'//后台的方法集合
// 商品评论
router.get('/admin/comment',async(ctx,next)=>{
    const userId=ctx.session.id
    const menus=getMenu('商品管理','/admin/comment')
    const title='comment.ejs'
    if(!userId) ctx.redirect('/');//不登陆跳转到主页
    await ctx.render('admin',{
        session: ctx.session,
        menus:menus,
        title:title
    })
})

module.exports = router