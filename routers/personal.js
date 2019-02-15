const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
import {switchNav} from '../utils/common'
const footers = require('../json/footers');
import { writePhotoFile,getFileName} from '../utils/common'
//个人主页
router.get('/personal', async(ctx,next)=>{
    let labels=[]
    let collection=[]
    await userModel.selectBookType().then(result=>{
        labels= result
    }).catch(()=>{})
    // 所有用户的收藏商品
    const UserId=ctx.session.id
    if(UserId){
        await userModel.selectCollectionGoods(UserId).then(res=>{
            collection=res;
        }).catch(()=>{})
    }
    await ctx.render('other/personal',{
        session:ctx.session,
        navArray: switchNav(ctx.path),
        collection:collection,
        labels:labels,
        footers:footers
    })
});
// 更新头像
router.put('/personal/updateImg', async(ctx,next)=>{
    let result={
        flag:false,
        msg:'个人信息更新失败'
    }
    const Photo=ctx.request.body.avatar;
    let upload = false;
    const id=ctx.session.id
    const avatar =ctx.session.avator
    if(Photo!=avatar){
        // 上传头像
        let fileName =getFileName();
        upload =await writePhotoFile(Photo,fileName)
        if(upload){
            // 更新个人信息的头像
            await userModel.updateUserImg(fileName,id).then(res=>{
                result.flag=true;
                result.msg='个人信息更新成功'
                ctx.session.avatar = fileName;
            }).catch(err => {
                console.log(err)
                result.flag=false;
                result.msg='出现错误！！'
            })
        }
    }else{
        result.flag=true;
        result.msg='个人信息更新成功'
    }
    ctx.body=result
});
module.exports = router