const Koa = require('./koa')
const app = new Koa()
const sleep = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
            console.log('sleep')
        }, 1000)
    })
}
app.use(async function (ctx, next) {
    console.log(1)
    await next()
    // throw new Error('error')
    console.log(2)
})
app.use(async function (ctx, next) {
    console.log(3)
    await sleep()
    await next()
    console.log(4)
})
app.use(async function (ctx, next) {
    console.log(5)
    await next()
    console.log(6)
})

app.listen(3001)

app.on('error', function (err) {
    console.log('err', err)
})