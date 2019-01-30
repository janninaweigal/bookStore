const request = require("request");
const fs = require('fs');
const moment=require('moment')

/**
 * 切换导航
 * @param {*} name 
 */
export function switchNav(router) {
    const navArray = [
        {
            name:'热门专区',
            active:false,
            router:'/hotGoods'
        },
        {
            name:'会员专区',
            active:false,
            router:'/memberGoods'
        },
        {
            name:'购物车',
            active:false,
            router:'/shopcarts'
        },
        {
            name:'我的',
            active:false,
            router:'/about'
        }
    ]
    // 如果router有值，则修改成激活
    if(router){
        for(const index in navArray){
            if(navArray[index].router==router){
                navArray[index].active=true;
                break;
            }
        }
    }
    return navArray;
}
// 参数是否正确
export function isCorrectParam(params) {
    for (var value in params) {
        if(params[value]=='')return false
    }
    return true;
}
/**
 * 上传图片
 * @param {*} 图片链接 
 * @param {*} 是否 
 */
export async function writePhotoFile(BookPhoto,Name) {
    let dataBuffer = photoToBase64(BookPhoto);
    let upload = await new Promise((reslove,reject)=>{
        fs.writeFile('./public' + Name, dataBuffer, err => { 
            if (err) {
                reject(false)
                throw err;
            };
            reslove(true)
        });            
    })
    return upload;
}
export function photoToBase64(BookPhoto){
    let base64Data = BookPhoto.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(base64Data, 'base64');
    return dataBuffer;
}
/**
 * 得到文件名
 */
export function getFileName(){
    const fileName=(moment().format('YYYY-MM-DD')).toString() + '-' +1000*(Math.random().toFixed(2))
    return ['/images/',fileName,'.png'].join('');
}
/**
 * 下载图片
 * @param {*请求图片地址} url 
 * @param {*保存图片名称} name
 */
export async function updateImg(url, filename){
    let flag=false;
    if(url.indexOf('http')!=-1){
        flag= await new Promise((reslove,reject)=>{
            request(url).pipe(fs.createWriteStream('./public'+filename).on("close",function(err,res){
                if(err){
                    reject(false);
                }else{
                    reslove(true)
                }
            }))
        })
    }
    return flag;
}
/**
 * 
 * @param {*} totalAmount 价格
 * @param {*} subject 商品
 * @param {*} body 商品详情
 */
export async function alipay(totalAmount,subject, body){
    const AlipaySdk = require('alipay-sdk').default;
    const AlipayFormData = require('alipay-sdk/lib/form').default;
    const config = require('../config/default.js');    //引入默认文件
    const alipaySdk = new AlipaySdk({
        appId: '2016092400587087',
        gateway:'https://openapi.alipaydev.com/gateway.do',
        privateKey: fs.readFileSync('./private-key.pem', 'utf-8'),
        alipayPublicKey: fs.readFileSync('./public-key.pem', 'utf-8'),
    });
    const formData = new AlipayFormData();
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get');
    formData.addField('returnUrl', `http://${config.HOST}:${config.port}/callback`);
    formData.addField('notifyUrl', `http://${config.HOST}:${config.port}/callback`);
    formData.addField('bizContent', {
        outTradeNo: new Date().getTime(),
        productCode: 'FAST_INSTANT_TRADE_PAY',
        totalAmount: totalAmount,
        subject: subject,
        body: body,
    });

    const result =await alipaySdk.exec('alipay.trade.page.pay', {}, {
        // 通过 formData 设置请求参数
        formData: formData,
        validateSign: true,
    })
    return result;
}
