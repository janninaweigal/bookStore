const router = require('koa-router')();
const userModel = require('../lib/mysql');
const footers = require('../json/footers').default;
const tabList = require('../json/tabList').default;
const images = require('../json/images').default;
import {switchNav} from '../utils/common'
router.get('/', async(ctx, next)=>{
    let types;
    if(!ctx.request.querystring){
        types = 'all';
    }else{
             
    }
   
    await ctx.render('home', {
        session: ctx.session,
        navArray: switchNav(),
        footers:footers,
        labels:[
            {
                name:'文艺',
                router:'hotGoods'
            },
            {
                name:'小说',
                router:'hotGoods'
            },
            {
                name:'教育',
                router:'hotGoods'
            },
            {
                name:'童书',
                router:'hotGoods'
            }
        ],
        tabList:tabList,
        images:images,
        type: null,
        postsLength: 0,
        postsPageLength: 0
    })
})

// 首页分页，每次输出10条
router.post('/articles/page', async(ctx, next) => {
    let page = ctx.request.body.page,
        type = ctx.request.querystring.split('=')[1];
    console.log(type)
    if(type=='all'){
        await userModel.findPostByPage(page)
        .then(result=>{
            //console.log(result)
            ctx.body = result   
        }).catch(()=>{
        ctx.body = false;
    })  
    }else{
        let _sql = `select * from posts where type = "${type}" limit ${(page-1)*10},10`;
        await userModel.query(_sql)
            .then(result=>{
                ctx.body = result;
            }).catch(err=>{
                console.log(err);
                ctx.body = false;
            })
    }
  
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

module.exports = router;