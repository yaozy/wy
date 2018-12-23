const App = require('flyingon-server');

const plugins = App.plugins;

const gzip = plugins.gzip({ level: 1 });
const cache = plugins.cache(43200);


// 创建app实例
const app = module.exports = new App(require('../../settings'));


// 加载基础库
require('./utils');

// 扩展写日志功能
require('./log');


// 设置全局插件
app.use(gzip);
