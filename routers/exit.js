var router = require('koa-router')();
router.get('/exit', async(ctx, next) => {
    ctx.session = null;
    ctx.redirect('/');
})

module.exports = router