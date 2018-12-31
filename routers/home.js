const router = require('koa-router')();
const userModel = require('../lib/mysql');
const labels = require('../json/labels');
const footers = require('../json/footers');
let collection =[]// 收藏
let contentList=[]// 热门和会员图书
import {switchNav} from '../utils/common'
// 获取相应标签的所有图书列表
async function getList(data,Id){
    await userModel.selectBooksByTypeId(Id).then(res=>{
        if(res){
            data.Data=res
        }
    })
}
// 合集
async function getCollections(){
    await userModel.selectCollection().then(res=>{
        collection=res
    }).catch(()=>{
        collection =[]
    })
}
// 合集
async function getGoodList(IsHot,IsMember){
    await userModel.getGoodList(IsHot,IsMember).then(res=>{
        contentList=res
    }).catch(()=>{
        contentList =[]
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
    await getList(bookList[0],type);
    // 判断是否登陆注册
    if(ctx.session.username){
        await userModel.findUserByName(ctx.session.username).then(res=>{
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
// 商品详情
router.get('/goodsDetail',async(ctx,next)=>{
    const BookId=ctx.request.querystring.split('=')[1];
    let goodsDetail={flag:false}// 商品详情和评论
    if(BookId){
        await userModel.selectBookById(BookId).then(res=>{
            goodsDetail=res[0];
        }).catch(()=>{
            goodsDetail={}
        })
        await userModel.selectCommentByBookId(BookId).then(res=>{
            goodsDetail.comments=res
        }).catch(()=>{
            goodsDetail={}
        })
        goodsDetail.flag=true
    }
    await ctx.render('other/goodsDetail',{
        session:ctx.session,
        navArray: switchNav(ctx.path),
        goodsDetail:goodsDetail,
        labels:labels,
        footers:footers
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
// 商品评论
router.post('/comment', async(ctx, next) => {
    const result={
        code:'no-login',
        data:[]
    }
    const params=ctx.request.body
    // 判断是否登陆注册
    if(ctx.session.username){
        const userId=ctx.session.id
        const bookId=params.bookId
        const comment=params.comment
        // 先插入评论
        await userModel.insertComment([userId,bookId,comment]).then(res=>{
            result.code="success"
        }).catch(()=>{
            result.code="error"
        })
        // 通过bookId查所有评论
        await userModel.selectCommentByBookId(bookId).then(res=>{
            result.data=res
        }).catch((res)=>{
            result.code="error"
        })
    }
    ctx.body = result;
})
//热门商品
router.get('/hotGoods',async(ctx,next)=>{
    await getCollections();
    await getGoodList(1,undefined);// 查找热门商品
    await ctx.render('other/hotGoods',{
        contentList:contentList,
        session:ctx.session,
        navArray: switchNav(ctx.path),
        labels:labels,
        footers:footers
    })
})
//会员专区
router.get('/memberGoods',async(ctx,next)=>{
    await getCollections();
    await getGoodList(undefined,1);// 查找会员商品
    await ctx.render('other/memberGoods',{
        contentList:contentList,
        session:ctx.session,
        navArray: switchNav(ctx.path),
        labels:labels,
        footers:footers
    })
})
//购物车
router.get('/shopcarts',async(ctx,next)=>{
    const shopcarts=[]
    // 判断是否登陆注册
    if(ctx.session.username){
        await userModel.selectShopcarts(BookId).then(res=>{
            shopcarts=res
        }).catch(()=>{})
    }
    
    await ctx.render('other/shopcarts',{
        collection:collection,
        session:ctx.session,
        shopcarts:shopcarts,
        navArray: switchNav(ctx.path),
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