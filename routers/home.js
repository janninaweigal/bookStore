const router = require('koa-router')();
const userModel = require('../lib/mysql');
const labels = require('../json/labels');
const footers = require('../json/footers');
import {switchNav} from '../utils/common'
// 获取相应标签的图书列表
async function getList(data,Id){
    await userModel.selectBookListById([Id,Id]).then(result=>{
        if(result){
            data.Data=result
        }
    })
}
router.get('/', async(ctx, next)=>{
    let type=null
    let bookList=[];
    let images=[];
    let ranks=[]
    // 图书类型
    await userModel.selectBookType().then(result=>{
        if(result){
            if(type==null){
                type=result[0].Id
            }
            bookList=result
        }
    })
    // 轮播图
    await userModel.findAllCarousel().then(result=>{
        if(result){
            images=result
        }
    })
    // 年月日排行 "id":"week","name":"周",
    await userModel.selectYearRank().then(result=>{
        if(result){
            const json={
                "id":"year",
                "name":"年",
                "list":result
            }
            ranks.push(json)
        }
    })
    await userModel.selectMonthRank().then(result=>{
        if(result){
            const json={
                "id":"month",
                "name":"月",
                "list":result
            }
            ranks.push(json)
        }
    })
    await userModel.selectWeekRank().then(result=>{
        if(result){
            const json={
                "id":"week",
                "name":"周",
                "list":result
            }
            ranks.push(json)
        }
    })
    const data=bookList[0]
    await getList(data,data.Id);
    // 判断是否登陆注册
    if(ctx.session.user){
        await userModel.findUserByName(ctx.session.user).then(res=>{
            ctx.session.id = res[0].Id;
            ctx.session.username=res[0].Username;
            ctx.session.avator = res[0].Avatar;
        })
    }
    await ctx.render('home', {
        session: ctx.session,
        navArray: switchNav(),
        footers:footers,
        labels:labels,
        tabList:ranks,
        images:images,
        bookList:bookList,
        type:type
    })
})

// 首页tab
router.post('/home', async(ctx, next) => {
    let data={flag:false},
        type = ctx.request.querystring.split('=')[1];
    if(type){
        await getList(data,type);
        data.flag=true;
    }
    ctx.body = data;
  
})

//热门商品
router.get('/hotGoods',async(ctx,next)=>{
    await ctx.render('other/hotGoods',{
        session:ctx.session,
        navArray: switchNav(ctx.path),
        labels:labels,
        footers:footers
    })
})
//会员专区
router.get('/memberGoods',async(ctx,next)=>{
    await ctx.render('other/memberGoods',{
        session:ctx.session,
        navArray: switchNav(ctx.path),
        labels:labels,
        footers:footers
    })
})
//购物车
router.get('/shopcarts',async(ctx,next)=>{
    await ctx.render('other/shopcarts',{
        session:ctx.session,
        navArray: switchNav(ctx.path),
        labels:labels,
        footers:footers
    })
})
//关于
router.get('/about',async(ctx,next)=>{
    await ctx.render('other/about',{
        session:ctx.session,
        navArray: switchNav(ctx.path),
        footers:footers
    })
})
router.get('/test',async(ctx,next)=>{
    await ctx.render('test')
})

module.exports = router;