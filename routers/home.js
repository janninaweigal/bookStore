const router = require('koa-router')();
const userModel = require('../lib/mysql');
const footers = require('../json/footers');
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
// 查找对应的商品
async function getGoodList(IsHot,IsMember){
    await userModel.getGoodList(IsHot,IsMember).then(res=>{
        contentList=res
    }).catch(()=>{
        contentList =[]
    })
}
// 标签组
async function getLabels(){
    let labels=[]
    await userModel.selectBookType().then(result=>{
        labels= result
    }).catch(()=>{})
    return labels
}
router.get('/', async(ctx, next)=>{
    let type=null
    let bookList=[];
    const labels=await getLabels();
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
// 商品搜索
router.get('/search',async(ctx,next)=>{
    const querystring=ctx.request.querystring
    let BookTypeId
    let pageNo=0 // 默认第一页
    let searchName=''
    let search={Data:[],count:0}// 商品详情
    const pageSize=8// 默认加载8条
    if(querystring.indexOf('&')!=-1){
        const splitArray=querystring.split('&')
        const param=splitArray[1].split('=')[1]
        BookTypeId=splitArray[0].split('=')[1]
        if(splitArray[1].split('=')[0]=='searchName'){
            searchName=decodeURI(param)
        }else{
            pageNo=param
        }
    }else{
        BookTypeId=querystring.split('=')[1];
    }
    
    const labels=await getLabels();
    
    if(BookTypeId){
        await userModel.selectBooksPageByTypeId(BookTypeId,pageNo,pageSize,searchName).then(res=>{
            if(res){
                search.Data=res
            }
        })
        await userModel.selectBooksCountByTypeId(BookTypeId,searchName).then(res=>{
            search.count=Math.ceil(res[0].count/pageSize)
        })
    }
    search.pageNo=pageNo
    search.typeId=BookTypeId
    await ctx.render('other/search',{
        session:ctx.session,
        navArray: switchNav(ctx.path),
        search:search,
        labels:labels,
        footers:footers
    })
})
// 商品详情
router.get('/goodsDetail',async(ctx,next)=>{
    const BookId=ctx.request.querystring.split('=')[1];
    const labels=await getLabels();
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
    const labels=await getLabels();
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
    const labels=await getLabels();
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
    let shopcarts={data:[]}
    const labels=await getLabels();
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