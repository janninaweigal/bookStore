const router = require('koa-router')();
const userModel = require('../lib/mysql');
const footers = require('../json/footers');
import {switchNav} from '../utils/common'
let labels=[]
// 查找
let goods={Data:[],count:0,typeId:-1,pageNo:0,pageSize:8,searchName:'search'}
// 获取相应标签的所有图书列表
async function getList(data,Id){
    await userModel.selectBooksByTypeId(Id).then(res=>{
        if(res){
            data.Data=res
        }
    })
}
// 标签组
async function getLabels(){
    await userModel.selectBookType().then(result=>{
        labels= result
    }).catch(()=>{})
}
router.get('/', async(ctx, next)=>{
    let type=null
    let bookList=[];
    let images=[];
    let ranks=[]
    let typeId=ctx.request.query.typeId?ctx.request.query.typeId:-1
    goods.typeId=typeId
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
    await getLabels();
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
        goods:goods,
        bookList:bookList,
        type:type
    })
})
// 商品详情
router.get('/goodsDetail',async(ctx,next)=>{
    const BookId=ctx.request.query.id?ctx.request.query.id:1;
    let goodsDetail={flag:false}// 商品详情和评论
    let typeId=ctx.request.query.typeId?ctx.request.query.typeId:-1
    goods.typeId=typeId
    await getLabels();
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
        goods:goods,
        navArray: switchNav(ctx.path),
        goodsDetail:goodsDetail,
        labels:labels,
        footers:footers
    })
})
// 首页tab
router.post('/home', async(ctx, next) => {
    let data={flag:false},
        type = ctx.request.query.type?ctx.request.query.type:1
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
// 加入购物车
router.post('/addShopCarts', async(ctx, next) => {
    const result={
        code:'no-login'
    }
    if(ctx.session.username){
        const params=ctx.request.body
        const userId=ctx.session.id
        const bookId=params.bookId
        const quantity=params.quantity
        const totalPrice=params.totalPrice
        // 是否已经收藏了商品
        await userModel.isAddShopcart([bookId,userId]).then(res=>{
            if(res.length==0){
                result.code='success'
            }else{
                result.Id=res[0].Id
                result.code='has-shopcart'
            }
        }).catch((res)=>{
            result.code="error"
        })
        if(result.code=='success'){
            // 添加到购物车 BookId,Quantity,TotalPrice
            await userModel.insertShopcarts([bookId,userId,quantity,totalPrice]).then(res=>{
                result.code='success'
            }).catch((res)=>{
                result.code="error"
            })
        }
        if(result.code=='has-shopcart'){
            // 更新到购物车 BookId,Quantity,TotalPrice
            await userModel.updateShopcarts([bookId,userId,quantity,totalPrice,result.Id]).then(res=>{
                result.code='success'
            }).catch((res)=>{
                result.code="error"
            })
        }
    }
    
    ctx.body = result;
})
//热门商品
router.get('/hotGoods',async(ctx,next)=>{
    const querystring=ctx.request.query
    let typeId=querystring.typeId?querystring.typeId:-1
    goods={Data:[],count:0,typeId:typeId,pageNo:0,pageSize:8,searchName:'hotGoods'}// 商品详情 // 默认第一页
    await commonFunc(querystring,goods,1,undefined)
    await getLabels();
    await ctx.render('other/hotGoods',{
        goods:goods,
        session:ctx.session,
        navArray: switchNav(ctx.path),
        labels:labels,
        footers:footers
    })
})
//会员专区
router.get('/memberGoods',async(ctx,next)=>{
    const querystring=ctx.request.query
    let typeId=querystring.typeId?querystring.typeId:-1
    // 查找会员商品
    goods={Data:[],count:0,typeId:typeId,pageNo:0,pageSize:8,searchName:'memberGoods'}// 商品详情 // 默认第一页
    await commonFunc(querystring,goods,undefined,1)
    await getLabels();
    await ctx.render('other/memberGoods',{
        goods:goods,
        session:ctx.session,
        navArray: switchNav(ctx.path),
        labels:labels,
        footers:footers
    })
})
// 会员和热门的公共方法
async function commonFunc(querystring,goods,isHot,isMember){
    await getLabels();
    if(querystring.pageNo){
        goods.pageNo=parseInt(querystring.pageNo)
    }
    // 查找热门商品长度
    await userModel.getGoodListLength(isHot,isMember).then(res=>{
        goods.count=Math.ceil(res[0].count/goods.pageSize)
        if(goods.pageNo<=0)goods.pageNo=0
        else if(goods.pageNo>=goods.count)goods.pageNo=goods.count-1
    }).catch(()=>{})
    const startNo=goods.pageNo*goods.pageSize
    // 查找热门商品
    await userModel.getGoodList(isHot,isMember,startNo,goods.pageSize).then(res=>{
        goods.Data=res
    }).catch(()=>{})
}
// 商品搜索
router.get('/search',async(ctx,next)=>{
    const querystring=ctx.request.query
    const pageNo=querystring.pageNo?parseInt(querystring.pageNo):0
    let typeId=querystring.typeId?querystring.typeId:-1
    let searchName=querystring.searchName?decodeURI(querystring.searchName):''
    let search={Data:[],typeId:typeId,count:0,pageNo:pageNo,pageSize:8,searchName:'search'}// 商品详情
    
    await getLabels();

    // 搜索结果的长度
    await userModel.selectBooksCountByTypeId(typeId,searchName).then(res=>{
        search.count=Math.ceil(res[0].count/search.pageSize)
        if(search.pageNo<=0)search.pageNo=0
        else if(search.pageNo>=search.count)search.pageNo=search.count-1
    })
    const No=search.pageNo*search.pageSize
    // 搜索结果的长度
    await userModel.selectBooksPageByTypeId(typeId,No,search.pageSize,searchName).then(res=>{
        if(res){
            search.Data=res
        }
    })
    
    await ctx.render('other/search',{
        session:ctx.session,
        navArray: switchNav(ctx.path),
        goods:search,
        labels:labels,
        footers:footers
    })
})
//购物车
router.get('/shopcarts',async(ctx,next)=>{
    let shopcarts={data:[]}
    let typeId=ctx.request.query.typeId?querystring.typeId:-1
    // 查找
    let goods={Data:[],count:0,typeId:typeId,pageNo:0,pageSize:8,searchName:'search'}
    await getLabels();
    // 判断是否登陆注册
    if(ctx.session.username){
        const userId=ctx.session.id
        await userModel.selectShopcarts(userId).then(res=>{
            shopcarts.data=res
        }).catch(()=>{
            shopcarts.data=[]
        })
        await userModel.getShopcartsTotalPrice(userId).then(res=>{
            shopcarts.TotalPrice=res[0].TotalPrice
        }).catch(()=>{
            shopcarts.TotalPrice=0
        })
    }
    await ctx.render('other/shopcarts',{
        session:ctx.session,
        shopcarts:shopcarts,
        goods:goods,
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