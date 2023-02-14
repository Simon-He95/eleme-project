const koa = require('koa')
const Router = require('koa-router')
const { seller, goods, ratings } = require('../data.json')
const app = new koa()
const router = new Router


app.use(async(ctx,next)=>{
	ctx.set('Access-Control-Allow-Origin','*')
	ctx.set('Access-Control-Allow-Headers','Content-Type,Content-Length,Authorization,Accept,X-Requested-With')
	ctx.set('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS')
	if(ctx.method=='OPTIONS'){
		ctx.body = 200;
	}else{
		await next()
	}
}
)


router.get('/api/seller', (ctx, next) => {
  // ctx.router available
  ctx.status = 200
  ctx.body = {
    errno: 0,
    data: seller
  }
});

router.get('/api/goods',(ctx, next)=> {
  ctx.status = 200

  ctx.body = {
    errno:0,
    data: goods
  }
}),
router.get('/api/ratings',(ctx, next)=> {
  ctx.status = 200
  ctx.body = {
    errno:0,
    data: ratings
  }
})

app.use(router.routes()).use(router.allowedMethods());
app.listen(3333, () => {
  console.log('3333 start');
})
