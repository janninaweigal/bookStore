const router = require('koa-router')();
const userModel = require('../lib/mysql');
const footers = require('../json/footers');
import {switchNav} from '../utils/common'
let labels=[]
// 查找
let goods={Data:[],count:0,typeId:-1,pageNo:0,pageSize:8,searchName:''}
// 获取相应标签的所有图书列表
async function getList(data,Id,Field){
    await userModel.selectBooksByTypeId(Id,Field).then(res=>{
        if(res){
            data.Data=res
            data.flag=true;
        }
    }).catch(()=>{
        data.flag=false;
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
            if(res.length==1){
                ctx.session.id = res[0].Id;
                ctx.session.username=res[0].Username;
                ctx.session.avatar = res[0].Avatar;
            }else{
                ctx.session = null;
            }
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
    let goodsDetail={flag:false,isCollection:false}// 商品详情和评论
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
        // 是否收藏
        if(ctx.session.username){
            const userId=ctx.session.id
            await userModel.selectCollection([userId,BookId]).then(res=>{
                if(res&&res[0].CollectionFlag==1){
                    goodsDetail.isCollection=true
                }
            }).catch(()=>{})
        }
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
        type = ctx.request.query.type?ctx.request.query.type:1;
    const params=ctx.request.body
    const orderBy=params.orderBy
    const ascending=((params.ascending=='true') ?'ASC':'DESC')
    if(type){
        if(orderBy&&ascending){
            const field=[" ORDER BY ",orderBy, ' ', ascending].join('')
            await getList(data,type,field);
        }else{
            await getList(data,type);
        }
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
// 查找用户收藏的商品列表
router.get('/findUserCollection', async(ctx, next) => {
    const result ={
        flag:false,
        Data:[]
    }
    if(ctx.session.username){
        // 所有用户的收藏商品
        const UserId=ctx.session.id
        await userModel.selectCollectionGoods(UserId).then(res=>{
            result.Data=res;
            result.flag=true
        }).catch(()=>{})
    }
    ctx.body=result
})
// 加入收藏  取消收藏
router.get('/addCollection', async(ctx, next) => {
    const query=ctx.request.query;
    const BookId =query.BookId;
    const CollectionFlag=query.flag
    const result={
        code:'no-login'
    }
    if(ctx.session.username){
        // 收藏
        const UserId=ctx.session.id
        const collectionId=ctx.session.collectionId
        if(collectionId){
            // 更新
            await userModel.updateCollection([CollectionFlag,collectionId]).then(res=>{
                if(res.affectedRows==1){
                    result.code='success'
                }
            }).catch((res)=>{
                result.code="error"
            })
            // 更改books表的collectionNum
            const num=(CollectionFlag==1?'CollectionNum+1':'CollectionNum-1')
            await userModel.updateBookCollectionNum(num,BookId).then(res=>{
                if(res.affectedRows==1){
                    result.code='success'
                }
            }).catch((res)=>{
                result.code="error"
            })
        }else{
            // 添加
            await userModel.insertCollection([UserId,BookId,CollectionFlag]).then(res=>{
                if(res.affectedRows==1){
                    result.code='success'
                    ctx.session.collectionId=res.insertId;
                }
            }).catch((res)=>{
                result.code="error"
            })
        }
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
    goods={Data:[],count:0,typeId:typeId,pageNo:0,pageSize:8,searchName:'',name:'hotGoods'}// 商品详情 // 默认第一页
    await commonFunc(querystring,goods,1,undefined)
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
    goods={Data:[],count:0,typeId:typeId,pageNo:0,pageSize:8,searchName:'',name:'memberGoods'}// 商品详情 // 默认第一页
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
    let search={Data:[],typeId:typeId,count:0,pageNo:pageNo,pageSize:8,searchName:searchName,name:'search'}// 商品详情
    
    await getLabels();

    // 搜索结果的长度
    await userModel.selectBooksCountByTypeId(typeId,searchName).then(res=>{
        search.count=Math.ceil(res[0].count/search.pageSize)
        if(search.pageNo<=0)search.pageNo=0
        else if(search.pageNo>=search.count)search.pageNo=search.count-1
    })
    const No=search.pageNo*search.pageSize
    // 搜索结果
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
    let goods={Data:[],count:0,typeId:typeId,pageNo:0,pageSize:8,searchName:''}
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
// 编辑购物车
router.put('/shopcarts/:id',async(ctx,next)=>{
    const cartId = ctx.params.id
    let data={flag:false,msg:'保存成功！'}
    let maxQuantity=0;
    const quantity = parseInt(ctx.request.body.quantity)
    const totalPrice=parseFloat(ctx.request.body.totalPrice)
    await userModel.findMaxQuantity(cartId).then(res=>{
        maxQuantity=res[0].maxQuantity
    }).catch(()=>{
        data.flag=false;
        data.msg='保存失败!'
    })
    if(quantity&&quantity>maxQuantity){
        data.msg='保存失败，最大数量为：'+maxQuantity
    }else{
        await userModel.updateShopcartsQuantity([quantity,totalPrice,cartId]).then(res=>{
            data.flag=true
        }).catch(()=>{
            data.flag=false;
            data.msg='保存失败!'
        })
    }
    ctx.body = data;
})
// 购物车删除
router.del('/shopcarts/:id',async(ctx,next)=>{
    const id = ctx.params.id
    let flag=false;
    await userModel.deleteShopcarts(id).then(res=>{
        flag=true;
    }).catch(()=>{})
    ctx.body = flag;
})
// 商品详情购买时 判断是否登录
router.post('/orderIsLogin', async(ctx, next) => {
    let result={
        flag:false,
        msg:'请先登录！'
    };
    const params=ctx.request.body
    const bookId=params.BookId;
    const quantity=params.Quantity;
    // 判断是否登陆注册
    if(ctx.session.username){
        if(bookId&&quantity){
            if(quantity>0)result.flag=true;
            result.msg='购买数量至少为1 '
        }else{
            result.msg='参数错误！！'
        }
    }
    ctx.body = result;
})
// 跳转确认订单页面
router.get('/confirmOrder', async(ctx, next) => {
    await getLabels();
    const params=ctx.request.query
    const ids=params.ids;
    const shopcart=JSON.parse(params.shopcart);
    let orderList=[]
    let addressList=[]
    const UserId=ctx.session.id;
    // ids 数组的商品集合
    await userModel.selectBookById(ids).then(res=>{
        orderList=res
    }).catch()
    let sum=0;
    for(let i=0,j=orderList.length;i<j;i++){
        const bid=orderList[i].BookId
        for(let j=0,q=orderList.length;j<q;j++){
            let ss=shopcart[j]
            if(bid==ss.BookId){
                orderList[i].Quantity=ss.Quantity
                sum+=parseFloat(ss.Quantity*orderList[i].Price)
                break;
            }
        }
        
    }
    // 根据id查询地址
    await userModel.selectUserAddress(UserId).then(res=>{
        addressList=res
    }).catch()
    await ctx.render('other/confirmOrder',{
        sum:sum,
        session:ctx.session,
        orderList:orderList,
        navArray: switchNav(ctx.path),
        addressList:addressList,
        labels:labels,
        footers:footers
    })
})
//关于
// router.get('/about',async(ctx,next)=>{
//     await ctx.render('other/about',{
//         session:ctx.session,
//         navArray: switchNav(ctx.path),
//         footers:footers
//     })
// })
router.get('/test',async(ctx,next)=>{
    await ctx.render('test')
})

module.exports = router;