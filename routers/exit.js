var router = require('koa-router')();
var checkUser = require('../midllewares/checkUser');
router.get('/exit', async(ctx, next) => {
    ctx.session = null;
    ctx.redirect('/');
})

module.exports = router