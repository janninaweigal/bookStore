var router = require('koa-router')();
var userModel = require('../lib/mysql.js')
import {alipay} from '../utils/common'
router.post('/order/alipay', async(ctx, next) => {
    const params=ctx.request.body
    const ids=params.ids;
    const shopcart=JSON.parse(params.shopcart);
    let result = {
        url:'',
        flag:false
    }
    let sum=0;
    let goodDesLog=[]
    let goodName='1个物品'
    // 通过BookId查询商品详情
    await userModel.selectBookById(ids).then(res=>{
        const len=res.length
        goodName=(len==1?res[0].BookName:len+'个物品');
        for(let i=0,j=len;i<j;i++){
            const obj=res[i]
            for(let j=0,q=shopcart.length;j<q;j++){
                const ss=shopcart[j]
                if(obj.BookId==ss.BookId){
                    const total=parseFloat(obj.Price*ss.Quantity)
                    sum+=total
                    const goodDes=['商品名称:',obj.BookName,',价格:',obj.Price,',数量:',ss.Quantity,',总价:',total].join('')
                    goodDesLog.push(goodDes)
                    break;
                }
            }
        }
    }).catch()
    // 支付宝支付
    const len=goodDesLog.length
    if(sum!=0&&len!=0){
        result.url = await alipay(sum,goodName, goodDesLog.join('&&'))
        ctx.session.shopcart=shopcart
        result.flag=true
    }
    ctx.body = result;
})
router.get('/order/callback', async(ctx, next) => {
    const body=ctx.request.query;
    const UserId=ctx.session.id;
    const shopcart=ctx.session.shopcart;
    const Seller_Id=body.seller_id
    const Out_Trade_No=body.out_trade_no
    const Trade_No=body.trade_no
    const Total_Amount=body.total_amount
    let result=false;
    let UserAddressId=-1;
    // 查询是否已经存在默认地址
    await userModel.selectUserDefaultAddress(UserId).then(res=>{
        if(res.length==1){
            UserAddressId=res[0].Id
        }
    }).catch((res)=>{
        console.log(res)
    })
    if(UserAddressId!=-1){
        let data=[]
        const len=shopcart.length
        if(len==1){
            data='('+[UserId,parseInt(shopcart[0].BookId),UserAddressId,Seller_Id,Out_Trade_No,Trade_No,shopcart[0].Quantity,Total_Amount].join(',')+')'
        }else{
            for(let i=0,j=len;i<j;i++){
                const obj=shopcart[i]
                const item='('+[UserId,parseInt(obj.BookId),UserAddressId,Seller_Id,Out_Trade_No,Trade_No,obj.Quantity,Total_Amount].join(',')+')'
                data.push(item)
            }
            data=data.join(',')
        }
        // 记录支付的结果
        await userModel.insertAliPay([data]).then(res=>{
            if(res.affectedRows==len){
                result=true;
            }
        }).catch((res)=>{
            console.log(res)
        })
    }
    await ctx.render('other/alipayResult',{
        result:result
    })
})
module.exports = router