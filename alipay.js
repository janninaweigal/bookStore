const AlipaySdk = require('alipay-sdk').default;
const fs = require('fs');

const alipaySdk = new AlipaySdk({
    appId: '2016092400587087',
    gateway:'https://openapi.alipaydev.com/gateway.do',
    privateKey: fs.readFileSync('./private-key.pem', 'ascii'),
    alipayPublicKey: fs.readFileSync('./public-key.pem', 'ascii'),
});

const AlipayFormData = require('alipay-sdk/lib/form').default;
const formData = new AlipayFormData();
// 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
formData.setMethod('get');

formData.addField('returnUrl', 'http://dhh4xs.natappfree.cc/alipay');
formData.addField('notifyUrl', 'http://dhh4xs.natappfree.cc/alipay');
formData.addField('bizContent', {
  outTradeNo: new Date().getTime(),
  productCode: 'FAST_INSTANT_TRADE_PAY',
  totalAmount: '0.01',
  subject: '商品',
  body: '商品详情',
});

alipaySdk.exec('alipay.trade.page.pay', {}, {
  // 通过 formData 设置请求参数
  formData: formData,
  validateSign: false,
}).then(result => {
  console.log(result);
})