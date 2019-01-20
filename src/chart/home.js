const vm = require('vm');
const sandbox = vm.createContext({}); // Empty Context

const app = require('../base/app');

const charts = Object.create(null);

const cache = Object.create(null);



async function loadChart(id) {

    let data = await app.sqlclient.query('select pagejson from homepage where pid=?', [id]);
    let config = vm.runInContext('(' + data[0].pagejson + ')', sandbox);

    let datasets = config.datasets;

    for (let name in datasets)
    {
        datasets[name] = datasets[name].replace(/\n\s*/g, ' ');
    }

    config.controls = JSON.stringify(config.controls);

    return (charts || (charts = Object.create(null)))[id] = config;
}


async function loadData(id, path) {

    let config = charts[id] || await loadChart(id);
    let dataset = config.dataset;
    let tables = {};

    let points = tables.points = await app.sqlclient.query('select orgname, longitude, latitude from orginfo where citypath like ?', [path || '%']);
    
    for (let i = points.length; i--;)
    {
        let item = points[i];

        points[i] = {
            name: item.orgname,
            value: [item.longitude, item. latitude]
        }
    }

    path = "'" + (path !== '%' ? path + '%' : path) + "'";

    for (let name in dataset)
    {
        tables[name] = await app.sqlclient.query(dataset[name].replace(/\?/g, path));
    }

    return '[' + config.controls + ', ' + JSON.stringify(tables) + ']';
}



module.exports = async (context, next) => {

    let id = context.paths[0] | 0;
    let path = decodeURIComponent(context.paths[1]);

    let data = cache[id];

    if (data)
    {
        // 1分钟内直接返回上次缓存的结果
        if ((data = data[path]) && new Date() - data.time < 60000) 
        {
            context.body = data.data;
            await next();
            return;
        }
    }
    else
    {
        cache[id] = Object.create(null);
    }

    data = await loadData(id, path);

    cache[id][path] = {
        time: new Date(),
        data: data
    }

    context.body = data;
    await next();
}



module.exports.clearCache = function () {

    for (let name in charts)
    {
        delete charts[name];
    }

    for (let name in cache)
    {
        delete cache[name];
    }
}


