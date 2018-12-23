const cache = require('../chart/cache.js');

module.exports = async function (context, next) {

    let config = await cache.find(context.paths[0]);
    let dataset = config.dataset;
    let fields = dataset.fields;
    let orderby = dataset.orderby;

    if (orderby) {
        orderby = ' order by ' + orderby;
    } else { orderby = ''; }

    let columns = [];
    let names = [dataset.primarykey];

    for (let i = 0; i < fields.length; i++) {

        if(fields[i].field === ''){
            continue;
        };

        let item = {
            name: fields[i].field,
            title: fields[i].name,
            type: fields[i].type,
            size: fields[i].width,
        };

        columns.push(item);

        if (fields[i].type === 'number') {
            item.type = 'number';
            item.align = 'right';
            item.digits = fields[i].digits;
            item.summary = fields[i].summary;
            item.precision = fields[i].digits;

        } else if (fields[i].type === 'boolean') {
            item.type = 'checkbox';
        } else {
            item.type = 'textbox';
        }

        names.push(fields[i].field);

    }


    query_SQL = 'select ' + names.join(',') + ' from ' + dataset.table + orderby;

    let data = await context.app.sqlclient.query(query_SQL);

    context.body = [{
        table: dataset.table,
        primarykey: dataset.primarykey,
        columns: columns
    }, data];

    await next();
}

  