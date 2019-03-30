var router = require('koa-router')();
var userModel = require('../../lib/mysql.js')
import {getMenu} from '../../utils/admin'//后台的方法集合
// 历史订单
router.get('/admin/history',async(ctx,next)=>{
    const query=ctx.query
    const searchName=query.searchName
    const userId=ctx.session.id
    const menus=getMenu('订单管理','/admin/history')
    const title='history.ejs'
    const pageNo=query.pageNo?parseInt(query.pageNo):0
    let table={
        Data:[],count:0,pageNo:pageNo,pageSize:10,globalName:'',url:'admin/history'
    }
    if(!userId) ctx.redirect('/');//不登陆跳转到主页
    if(searchName)table.globalName=decodeURI(searchName)
    await userModel.selectAllOrderHistoryLength(table.globalName).then(res=>{
        if(res.length==1){
            table.count=Math.ceil(res[0].count/table.pageSize)
            if(table.pageNo<=0)table.pageNo=0
            else if(table.pageNo>=table.count)table.pageNo=table.count-1
        }
    }).catch(()=>{})
    const No=table.pageNo*table.pageSize
    await userModel.selectAllOrderHistory(table.globalName,No,table.pageSize).then(res=>{
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
module.exports = router