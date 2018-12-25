const router = require('koa-router')();
const userModel = require('../lib/mysql');
const labels = require('../json/labels');
const footers = require('../json/footers');
const tabList = require('../json/tabList');
const images = require('../json/images');
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
    await userModel.selectBookType().then(result=>{
        if(result){
            if(type==null){
                type=result[0].Id
            }
            bookList=result
        }
    })
    const data=bookList[0]
    await getList(data,data.Id);
    await ctx.render('home', {
        navArray: switchNav(),
        footers:footers,
        labels:labels,
        tabList:tabList,
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

// 单篇文章页
router.get('/articledetail/:postId', async(ctx, next) => {
    let comments,
        article,
        pageOne,
        article_pv,
        collects,
        follow,
        likes; 
    let postId = ctx.params.postId;
    console.log(postId,'potid')
    await userModel.findPostById(postId) 
        .then(result => {
            
            article = result;
    
            article_pv = parseInt(result[0]['pv'])
            article_pv += 1
       
        }).catch(err=>{
            console.log(err);
            ctx.body = false;
        })

    await userModel.updatePostPv([article_pv, postId])
    await userModel.findCommentByPage(1,postId)
        .then(result => {
            commentPage = result
        }).catch(err=>{
            console.log(err);
            ctx.body = false;
        })
    await userModel.findCommentById(postId)
        .then(result => {
            comments = result
            console.log('comment', Math.ceil(comments.length/10))
        }).catch(err=>{
            console.log(err);
            ctx.body = false;
        })
    
    if(ctx.session.user!=postId){
        await userModel.findFollowByUserId([ctx.session.id,article[0]['uid']])
        .then(result=>{
           // console.log(result[0])
            if(result[0]!=undefined){
               // console.log(result[0])
                follow = result[0]['uid'];
            }else{
                follow = null;
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    await userModel.findLikeByPostId([ctx.session.user,article[0]['id']])
        .then((result)=>{
            if(result[0]!=undefined){
               // console.log(result[0])//未解决
                likes = result[0]['name']
            }else{
                likes = null;
            }
        })

    await userModel.findCollectionByData([ctx.session.id,article[0]['id']])
        .then((result)=>{
            if(result[0]!=undefined){
               // console.log(result[0])
                collects = result[0]['name']
            //    console.log(collects)
            }else{
                collects = null;
            }
        })
    await ctx.render('articledetail', {
        session: ctx.session,
        article: article[0],
        likes: likes,
        collects :collects,
        follow,
        commentLenght: comments.length,
        commentPageLenght: Math.ceil(comments.length/10),
        commentPage:commentPage
    })

})
//热门商品
router.get('/hotGoods',async(ctx,next)=>{
    await ctx.render('hotGoods',{
        session:ctx.session,
        navArray: switchNav(ctx.path)
    })
})
//会员专区
router.get('/memberGoods',async(ctx,next)=>{
    await ctx.render('memberGoods',{
        session:ctx.session,
        navArray: switchNav(ctx.path)
    })
})
//购物车
router.get('/shopcarts',async(ctx,next)=>{
    await ctx.render('shopcarts',{
        session:ctx.session,
        navArray: switchNav(ctx.path)
    })
})
//关于
router.get('/about',async(ctx,next)=>{
    await ctx.render('about',{
        session:ctx.session,
        navArray: switchNav(ctx.path)
    })
})
router.get('/test',async(ctx,next)=>{
    await ctx.render('test')
})

module.exports = router;