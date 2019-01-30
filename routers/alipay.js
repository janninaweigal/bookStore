var router = require('koa-router')();
import {alipay} from '../utils/common'
router.post('/alipay', async(ctx, next) => {
    const result = await alipay(100000,'商品', '商品详情')
    ctx.body = result;
})
router.post('/callback', async(ctx, next) => {

})
module.exports = router