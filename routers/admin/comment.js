var router = require('koa-router')();
var userModel = require('../../lib/mysql.js')
import {getMenu} from '../../utils/admin'//后台的方法集合
// 商品评论
router.get('/admin/comment',async(ctx,next)=>{
    const query=ctx.query
    const searchName=query.searchName||''
    const userId=ctx.session.id
    const menus=getMenu('商品管理','/admin/comment')
    const title='comment.ejs'
    const pageNo=query.pageNo?parseInt(query.pageNo):0
    let table={
        Data:[],count:0,pageNo:pageNo,pageSize:10,globalName:'',url:'admin/comment'
    }
    if(!userId) ctx.redirect('/');//不登陆跳转到主页
    if(searchName)table.globalName=decodeURI(searchName)
    await userModel.selectCommentInfoLength(table.globalName).then(res=>{
        table.count=Math.ceil(res[0].count/table.pageSize)
        if(table.pageNo<=0)table.pageNo=0
        else if(table.pageNo>=table.count)table.pageNo=table.count-1
    }).catch(()=>{})
    const No=table.pageNo*table.pageSize
    await userModel.selectCommentInfo(table.globalName,No,table.pageSize).then(res=>{
        if(res){
            table.Data=res
        }
    }).catch(()=>{})
    await ctx.render('admin',{
        session: ctx.session,
        menus:menus,
        title:title,
        table:table
    })
})

// 删除评论
router.delete('/admin/comment/:id',async(ctx,next)=>{
    const Id=ctx.params.id
    let flag=false;
    await userModel.deleteCommentInfo(Id).then(res=>{
        if(res){
            flag=true;
        }
    }).catch((res)=>{
        console.log(res)
    })
    ctx.body = flag;
})
module.exports = router