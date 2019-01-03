const fs = require('fs');

const app = require('../base/app');

const charts = Object.create(null);




// fs.watch('./home', function () {

//     charts = datasets = null;
// });


function loadChart(name) {

    let config = eval('var module = {}; ' + fs.readFileSync('./home/' + name + '.js', 'utf8'));
    let datasets = config.datasets;

    for (let name in datasets)
    {
        datasets[name] = datasets[name].replace(/\n\s*/g, ' ');
    } 

    config.controls = JSON.stringify(config.controls);

    return (charts || (charts = Object.create(null)))[name] = config;
}


async function loadData(name) {

    let config = loadChart(name);
    let dataset = config.dataset;
    let tables = {};
    
    for (let name in dataset)
    {
        tables[name] = await app.sqlclient.query(dataset[name]);
    }

    return '[' + config.controls + ', ' + JSON.stringify(tables) + ']';
}



module.exports = async (context, next) => {

    context.body = await loadData(context.paths[0]);
    await next();
}
