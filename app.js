const koa = require('koa');
const app = koa();
const fs = require('fs');
const serve = require('koa-static');
const _ = require('koa-route');

app.use(serve('./public'));

app.use(_.get('/apriori', function *(){
    this.body = fs.readFileSync(__dirname + '/views/apriori.html', 'utf-8');
}));

app.use(function *() {
    this.body = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
});

app.listen(process.env.PORT || 3000);