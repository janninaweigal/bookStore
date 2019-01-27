const AlipayFormData = require('alipay-sdk/lib/form').default;
const formData = new AlipayFormData();
// 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
// formData: Object 文件上传类接口的请求参数，，默认 null
formData.setMethod('get');

formData.addField('notifyUrl', 'http://www.com/notify');
formData.addField('bizContent', {
  outTradeNo: 'out_trade_no',
  productCode: 'FAST_INSTANT_TRADE_PAY',
  totalAmount: '0.01',
  subject: '商品',
  body: '商品详情',
});

alipaySdk.exec('alipay.trade.page.pay', {},{ formData: formData }).then(result => {
  console.log(result);
})