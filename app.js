const koa = require('koa');
const app = koa();
const fs = require('fs');
const serve = require('koa-static');

app.use(serve('./public'));

app.use(function *() {
    this.body = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
});

app.listen(3000);