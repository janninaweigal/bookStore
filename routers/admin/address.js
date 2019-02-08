var router = require('koa-router')();
var userModel = require('../../lib/mysql.js')
import {getMenu} from '../../utils/admin'//后台的方法集合
// 用户地址
router.get('/admin/address',async(ctx,next)=>{
    const userId=ctx.session.id
    const menus=getMenu('用户管理','/admin/address')
    const title='address.ejs'
    if(!userId) ctx.redirect('/');//不登陆跳转到主页
    await ctx.render('admin',{
        session: ctx.session,
        menus:menus,
        title:title
    })
})
// 新增用户信息
router.post('/admin/address',async(ctx,next)=>{
    const params = ctx.request.body
    const UserId=ctx.session.id;
    const name=params.name
    const phone=params.phone
    const address=params.address
    const isDefault=params.isDefault
    let flag=false;
    if(params.isDefault==1){
        let id=-1;
        // 查询是否已经存在默认地址
        await userModel.selectUserDefaultAddress(UserId).then(res=>{
            if(res.length==1){
                id=res[0].Id
            }
        }).catch((res)=>{
            console.log(res)
        })
        if(id!=-1){
            // 修改默认地址
            await userModel.updateUserDefaultAddress(id,0).then(res=>{
                if(res.affectedRows==1){
                    flag=true;
                }
            }).catch((res)=>{
                console.log(res)
            })
        }
    }
    // 插入地址
    await userModel.insertUserAddress([UserId,name,phone,address,isDefault]).then(res=>{
        if(res.affectedRows==1){
            flag=true;
        }
    }).catch((res)=>{
        console.log(res)
    })
    ctx.body = flag;
})
// 编辑用户地址
router.put('/admin/address/:id',async(ctx,next)=>{
    const params = ctx.request.body
    const name=params.name
    const phone=params.phone
    const address=params.address
    const isDefault=params.isDefault
    const Id=parseInt(params.Id)
    const UserId=ctx.session.id;
    let flag=false;
    if(params.isDefault==1){
        let id=-1;
        // 查询是否已经存在默认地址
        await userModel.selectUserDefaultAddress(UserId).then(res=>{
            if(res.length==1){
                id=res[0].Id
            }
        }).catch((res)=>{
            console.log(res)
        })
        if(id!=-1){
            // 修改默认地址
            await userModel.updateUserDefaultAddress(id,0).then(res=>{
                if(res.affectedRows==1){
                    flag=true;
                }
            }).catch((res)=>{
                console.log(res)
            })
        }
    }
    // 编辑地址
    await userModel.updateUserAddress([name,phone,address,isDefault,Id]).then(res=>{
        flag=true;
    }).catch((res)=>{
        console.log(res)
    })
    ctx.body = flag;
})
// 删除用户地址
router.delete('/admin/address/:id',async(ctx,next)=>{
    const Id=ctx.params.id
    let flag=false;
    await userModel.deleteUserAddress(Id).then(res=>{
        flag=true;
    }).catch((res)=>{
        console.log(res)
    })
    ctx.body = flag;
})
module.exports = router