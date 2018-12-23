const http = require('http');

const app = require('./base/app');
const static = require('./base/static');



// 静态资源
app.route('/index.html', false, static('./client/index.html', false));
app.route('/main.js', false, static('./client//main.js'));
app.route('/flyingon', false, static('./client/flyingon'));
app.route('/js', false, static('./client/js'));
app.route('/css', false, static('./client/css'));
app.route('/icon', false, static('./client/icon'));
app.route('/img', false, static('./client/img'));
app.route('/samples', false, static('./client/samples'));
app.route('/pages', false, static('./client/src'));



// 登录接口
require('./logon');


// 图表接口
require('./chart');


// 页面接口
require('./pages');



// 创建http服务
const server = http.createServer(app.dispatchHandler());

server.listen(app.http.port);

console.log('http server listening at port', app.http.port);
