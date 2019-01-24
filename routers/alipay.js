var router = require('koa-router')();

router.post('/alipay', async(ctx, next) => {
    ctx.body = false
})

module.exports = router