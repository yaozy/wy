const vm = require('vm');
const sandbox = vm.createContext({}); // Empty Context

const app = require('../base/app');

const charts = Object.create(null);

const cache = Object.create(null);



async function loadChart(id) {

    let data = await app.sqlclient.query('select pagejson from homepage where pid=?', [id]);
    let config = vm.runInContext('(' + data[0].pagejson + ')', sandbox);

    let datasets = config.datasets;

    for (let name in datasets) {
        datasets[name] = datasets[name].replace(/\n\s*/g, ' ');
    }

    config.controls = JSON.stringify(config.controls);

    return (charts || (charts = Object.create(null)))[id] = config;
}


async function loadData(id, path) {

    let config = charts[id] || await loadChart(id);
    let dataset = config.dataset;
    let tables = {};

    let sSql = ' select 	orgname, 	longitude,	latitude,	'
        + ' ifnull(d1.feerec,0.00) as feerec,	'
        + ' ifnull(d1.feepaid,0.00) as feepaid,	'
        + ' ifnull(d1.feefailures,0.00) as feefailures, '
        + ' ifnull(round(feepaid*100.00/feerec,2),0.00) as feerate '
        + ' from orginfo d2 	left join ( 		select 			orgcode, '
        + ' ifnull(round(sum(feerec) / 10000,2),0.00) as feerec, '
        + ' ifnull(round(sum(feepaid) / 10000,2),0.00) as feepaid, '
        + ' ifnull(round(sum(feefailures) / 10000,2),0.00) as feefailures '
        + ' from t_hp_feetrend '
        + ' group by orgcode 		) d1 on d1.orgcode = d2.orgcode '
        + ' where citypath like ? ';

    path += '%';

    //let points = tables.points = await app.sqlclient.query('select orgname, longitude, latitude from orginfo where citypath like ?', [path]);
    let points = tables.points = await app.sqlclient.query(sSql, [path]);

    for (let i = points.length; i--;) {
        let item = points[i];

        points[i] = {

            name: item.orgname,
            value: [item.longitude, item.latitude],
            datas: [item.feerec, item.feepaid,item.feefailures,item.feerate]
        }
    }

    path = "'" + path + "'";

    for (let name in dataset) {
        tables[name] = await app.sqlclient.query(dataset[name].replace(/\?/g, path));
    }

    return '[' + config.controls + ', ' + JSON.stringify(tables) + ']';
}



module.exports = async (context, next) => {

    let id = context.paths[0] | 0;
    let path = decodeURIComponent(context.paths[1] || '');

    let data = cache[id];

    if (data) {
        // 1分钟内直接返回上次缓存的结果
        if ((data = data[path]) && new Date() - data.time < 60000) {
            context.body = data.data;
            await next();
            return;
        }
    }
    else {
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

    for (let name in charts) {
        delete charts[name];
    }

    for (let name in cache) {
        delete cache[name];
    }
}


