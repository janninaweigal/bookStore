var router = require('koa-router')();
var userModel = require('../../lib/mysql.js')
import {getMenu} from '../../utils/admin'//后台的方法集合
import { getFileName, writePhotoFile} from '../../utils/common'
// 轮播图
router.get('/admin/banner',async(ctx,next)=>{
    const query=ctx.query
    const searchName=query.searchName
    const userId=ctx.session.id
    const menus=getMenu('轮播图','/admin/banner')
    const title='banner.ejs'
    const pageNo=query.pageNo?parseInt(query.pageNo):0
    let table={
        Data:[],count:0,pageNo:pageNo,pageSize:10,globalName:'',url:'admin/banner'
    }
    if(!userId) ctx.redirect('/');//不登陆跳转到主页
    if(searchName)table.globalName=decodeURI(searchName)
    await userModel.selectCarouselInfoLength(table.globalName).then(res=>{
        table.count=Math.ceil(res[0].count/table.pageSize)
        if(table.pageNo<=0)table.pageNo=0
        else if(table.pageNo>=table.count)table.pageNo=table.count-1
    }).catch(()=>{})
    const No=table.pageNo*table.pageSize
    await userModel.selectCarouselInfo(table.globalName,No,table.pageSize).then(res=>{
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

// 新增轮播图
router.post('/admin/banner',async(ctx,next)=>{
    const params = ctx.request.body
    const Title=params.Title
    let Photo=params.Avatar
    const Describe=params.Describe
    let flag=false;
    // 上传头像
    let fileName =getFileName();
    const upload =await writePhotoFile(Photo,fileName)
    // 新增轮播图
    if(upload){
        await userModel.insertCarouselInfo([Title,fileName,Describe]).then(res=>{
            if(res.affectedRows==1){
                flag=true;
            }
        }).catch((res)=>{
            console.log(res)
        })
    }
    ctx.body = flag;
})
// 更新轮播图
router.put('/admin/banner/:id',async(ctx,next)=>{
    const params = ctx.request.body
    const Title=params.Title
    let Photo=params.Avatar
    const Describe=params.Describe
    const Id=parseInt(params.Id)
    let flag=false;
    let oldPhoto=''
    // 判断编辑的图片和数据库的图片是否一样，一样的话就不保存。
    await userModel.findCarouselById(Id).then(res=>{
        if(res){
            oldPhoto=res[0].Picture
        }
    }).catch(()=>{})
    // 上传头像
    if(Photo==oldPhoto){
        await userModel.updateCarouselInfo([Title,Photo,Describe,Id]).then(res=>{
            if(res.affectedRows==1){
                flag=true;
            }
        }).catch((res)=>{
            console.log(res)
        })
    }else{
        let fileName =getFileName();
        const upload =await writePhotoFile(Photo,fileName)
        // 更新轮播图
        if(upload){
            await userModel.updateCarouselInfo([Title,fileName,Describe,Id]).then(res=>{
                if(res.affectedRows==1){
                    flag=true;
                }
            }).catch((res)=>{
                console.log(res)
            })
        }
    }
    
    ctx.body = flag;
})
// 删除轮播图
router.delete('/admin/banner/:id',async(ctx,next)=>{
    const Id=ctx.params.id
    let flag=false;
    await userModel.deleteCarouselInfo(Id).then(res=>{
        if(res){
            flag=true;
        }
    }).catch((res)=>{
        console.log(res)
    })
    ctx.body = flag;
})

module.exports = router