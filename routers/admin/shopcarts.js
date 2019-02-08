var router = require('koa-router')();
var userModel = require('../../lib/mysql.js')
import {getMenu} from '../../utils/admin'//后台的方法集合
// 购物车
router.get('/admin/shopcarts',async(ctx,next)=>{
    const query=ctx.query
    const searchName=query.searchName
    const userId=ctx.session.id
    const menus=getMenu('购物车','/admin/shopcarts')
    const title='shopcarts.ejs'
    const pageNo=query.pageNo?parseInt(query.pageNo):0
    let table={
        Data:[],count:0,pageNo:pageNo,pageSize:10,globalName:'',url:'admin/shopcarts'
    }
    if(!userId) ctx.redirect('/');//不登陆跳转到主页
    if(searchName)table.globalName=decodeURI(searchName)
    await userModel.selectAllShopcartsLength(table.globalName).then(res=>{
        if(res.length==1){
            table.count=Math.ceil(res[0].count/table.pageSize)
            if(table.pageNo<=0)table.pageNo=0
            else if(table.pageNo>=table.count)table.pageNo=table.count-1
        }
    }).catch(()=>{})
    const No=table.pageNo*table.pageSize
    await userModel.selectAllShopcarts(table.globalName,No,table.pageSize).then(res=>{
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

// 删除购物车
router.delete('/admin/shopcarts/:id',async(ctx,next)=>{
    const Id=ctx.params.id
    let flag=false;
    await userModel.deleteShopcarts(Id).then(res=>{
        flag=true;
    }).catch((res)=>{
        console.log(res)
    })
    ctx.body = flag;
})
module.exports = router