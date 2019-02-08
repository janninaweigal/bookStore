var router = require('koa-router')();
var userModel = require('../../lib/mysql.js')
var md5 = require('md5')
import {getMenu} from '../../utils/admin'//后台的方法集合
import {isCorrectParam, getFileName, writePhotoFile} from '../../utils/common'

router.get('/admin',async(ctx,next)=>{
    const userId=ctx.session.id
    const menus=getMenu()
    const title='admin.ejs'
    // 判断是否登陆注册
    if(userId){
        let flag=false;
        await userModel.findUserById(userId).then(res=>{
            if(res.length==1&&res[0].IsAdmin==1){
                flag=true;
            }
        }).catch(()=>{})
        if(flag){
            await ctx.render('admin',{
                session: ctx.session,
                menus:menus,
                title:title
            })
        }else{
            ctx.redirect('/');
        }
    }else{
        ctx.redirect('/');
    }
    
})
// 用户信息
router.get('/admin/users',async(ctx,next)=>{
    const query=ctx.query
    const searchName=query.searchName
    const userId=ctx.session.id
    const menus=getMenu('用户管理','/admin/users')
    const title='users.ejs'
    const pageNo=query.pageNo?parseInt(query.pageNo):0
    let table={
        Data:[],count:0,pageNo:pageNo,pageSize:10,globalName:'',url:'admin/users'
    }
    if(!userId) ctx.redirect('/');//不登陆跳转到主页
    if(searchName)table.globalName=decodeURI(searchName)
    await userModel.selectUserInfoLength(table.globalName).then(res=>{
        table.count=Math.ceil(res[0].count/table.pageSize)
        if(table.pageNo<=0)table.pageNo=0
        else if(table.pageNo>=table.count)table.pageNo=table.count-1
    }).catch(()=>{})
    const No=table.pageNo*table.pageSize
    await userModel.selectUserInfo(table.globalName,No,table.pageSize).then(res=>{
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
// 新增用户信息
router.post('/admin/users',async(ctx,next)=>{
    const params = ctx.request.body
    const Username=params.Username
    let Photo=params.Avatar
    const Email=params.Email
    const IsAdmin=params.IsAdmin
    let flag=false;
    if(isCorrectParam(params)){
        // 上传头像
        let fileName =getFileName();
        let upload = true;
        if(Photo!='/images/default.jpg'){
            upload =await writePhotoFile(Photo,fileName)
        }
        Photo=(Photo=='/images/default.jpg'?'/images/default.jpg':fileName)
        // 插入用户信息
        if(upload){
            await userModel.insertUserInfo([Username,Photo,Email,IsAdmin]).then(res=>{
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
// 编辑用户信息
router.put('/admin/users/:id',async(ctx,next)=>{
    const params = ctx.request.body
    const Username=params.Username
    const Photo=params.Avatar
    const Password=params.Password||md5('123456asd&$BH&*')
    const Email=params.Email
    const Id=parseInt(params.Id)
    const IsAdmin=params.IsAdmin
    let flag=false;
    // 判断参数是否正确，有值
    if(isCorrectParam(params)){
        let oldPhoto=''
        // 判断编辑的图片和数据库的图片是否一样，一样的话就不保存。
        await userModel.selectBookById(Id).then(res=>{
            if(res){
                oldPhoto=res[0].Avatar
            }
        }).catch(()=>{})
        if(oldPhoto==Photo){
            await userModel.updateUserInfoNoAvatar([Username,Password,Email,IsAdmin,Id]).then(res=>{
                if(res){
                    flag=true;
                }
            }).catch((res)=>{
                console.log(res)
            })
        }else{
            const fileName=getFileName();
            // 保存图片
            const result = await writePhotoFile(Photo,fileName)
            if(result){
                //更新数据
                await userModel.updateUserInfo([Username,Password,fileName,Email,IsAdmin,Id]).then(res=>{
                    if(res){
                        flag=true;
                    }
                }).catch((res)=>{
                    console.log(res)
                })
            }
        }
    }
    ctx.body = flag;
})
// 更改用户权限
router.put('/admin/users/isAdmin/:id',async(ctx,next)=>{
    const params = ctx.request.body
    const IsAdmin=params.IsAdmin
    const Id=ctx.params.id
    let flag=false;
    if(IsAdmin&&Id){
        await userModel.updateUserAdmin([IsAdmin,Id]).then(res=>{
            if(res){
                flag=true;
            }
        }).catch((res)=>{
            console.log(res)
        })
    }
    ctx.body = flag;
})

// 删除用户信息
router.delete('/admin/users/:id',async(ctx,next)=>{
    const Id=ctx.params.id
    let flag=false;
    await userModel.deleteUserInfo(Id).then(res=>{
        if(res){
            flag=true;
        }
    }).catch((res)=>{
        console.log(res)
    })
    ctx.body = flag;
})

module.exports = router