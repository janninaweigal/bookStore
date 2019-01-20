var router = require('koa-router')();
var userModel = require('../../lib/mysql.js')
import {getMenu} from '../../utils/admin'//后台的方法集合
import {isCorrectParam, getFileName, writePhotoFile} from '../../utils/common'
// 所有图书信息
router.get('/admin/goods',async(ctx,next)=>{
    const query=ctx.query
    const searchName=query.searchName
    const userId=ctx.session.id
    const menus=getMenu('商品管理','/admin/goods')
    const title='goods.ejs'
    const pageNo=query.pageNo?parseInt(query.pageNo):0
    let table={
        Data:[],count:0,pageNo:pageNo,pageSize:10,globalName:'',url:'admin/goods'
    }
    if(!userId) ctx.redirect('/');//不登陆跳转到主页
    if(searchName)table.globalName=decodeURI(searchName)
    await userModel.selectBookListLength(table.globalName).then(res=>{
        table.count=Math.ceil(res[0].count/table.pageSize)
        if(table.pageNo<=0)table.pageNo=0
        else if(table.pageNo>=table.count)table.pageNo=table.count-1
    }).catch(()=>{})
    const No=table.pageNo*table.pageSize
    await userModel.selectBookList(table.globalName,No,table.pageSize).then(res=>{
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
// 新增图书信息
router.post('/admin/goods',async(ctx,next)=>{
    const params = ctx.request.body
    const Author=params.Author
    const Describe=params.Describe
    const Name=params.Name
    const Price=parseFloat(params.Price)
    const PublishCompany=params.PublishCompany
    const Quantity=parseInt(params.Quantity)
    const type=parseInt(params.type)
    let flag=false;
    if(isCorrectParam(params)){
        let BookTypeId=-1
        // 上传头像
        const fileName=getFileName();
        let upload = await writePhotoFile(params.BookPhoto,fileName)
        // 插入图书类型，获得自增id
        await userModel.insertBookType(type).then(res=>{
            BookTypeId=res.insertId
        }).catch(()=>{})
        // 插入图书
        if(upload&&BookTypeId!=-1){
            await userModel.insertBookInfo([BookTypeId,Author,Name,fileName,Price,Quantity,Describe,PublishCompany]).then(res=>{
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
// 编辑图书信息
router.put('/admin/goods/:id',async(ctx,next)=>{
    const params = ctx.request.body
    const Author=params.Author
    const Describe=params.Describe
    const Name=params.Name
    const Price=parseFloat(params.Price)
    const PublishCompany=params.PublishCompany
    const Quantity=parseInt(params.Quantity)
    const BookPhoto=params.BookPhoto
    const Id=parseInt(params.Id)
    let flag=false;
    // 判断参数是否正确，有值
    if(isCorrectParam(params)){
        let oldPhoto=''
        // 判断编辑的图片和数据库的图片是否一样，一样的话就不保存。
        await userModel.selectBookById(Id).then(res=>{
            if(res){
                oldPhoto=res[0].BookPhoto
            }
        }).catch(()=>{})
        if(oldPhoto==BookPhoto){
            await userModel.updateBookInfoNoPhoto([Author,Name,Price,Quantity,Describe,PublishCompany,Id]).then(res=>{
                if(res){
                    flag=true;
                }
            }).catch((res)=>{
                console.log(res)
            })
        }else{
            const fileName=getFileName();
            // 保存图片
            const result = await writePhotoFile(BookPhoto,fileName)
            if(result){
                //更新数据
                await userModel.updateBookInfo([Author,Name,fileName,Price,Quantity,Describe,PublishCompany,Id]).then(res=>{
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
// 删除图书信息
router.delete('/admin/goods/:id',async(ctx,next)=>{
    const Id=ctx.params.id
    let flag=false;
    await userModel.deleteBookInfo(Id).then(res=>{
        if(res){
            flag=true;
        }
    }).catch((res)=>{
        console.log(res)
    })
    ctx.body = flag;
})

module.exports = router