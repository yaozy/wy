const cache = require('../chart/cache.js');


module.exports = async function (context, next) {

    switch (context.request.method) {
        case 'GET':
            await GET(context, next);
            break;

        case 'POST':
            await POST(context, next);
            break;

        case 'PUT':
            await PUT(context, next);
            break;
    }
}


async function GET(context, next) {

}


async function POST(context, next) {

    let data = await context.acceptData();
    let table = '';
    let primarykey = '';
    let list = [];
    let index = 0;
    let item;

    data = JSON.parse(data);

    table = data.tblname;
    primarykey = data.primarykey;
    data = JSON.parse(data.data);

    while (item = data[index++]) {
        let state = item['@'];

        delete item['@'];

        let keys;
        let sql;
        let values;


        // add
        if (state === 1) {

            keys = Object.keys(item);
            values = Object.values(item);
            
            sql = 'insert into ' + table + '(' + keys.join(', ') + ') values(' +
                new Array(keys.length).join('?, ') + '?' +
                ')';
        }
        else // update
        {
            let key = item[primarykey];

            delete item[primarykey];

            keys = Object.keys(item);
            values = Object.values(item);
            values.push(key);

            sql = 'update ' + table + ' set ' + keys.join('=?, ') + '=? where ' + primarykey + '=?';
        }

        list.push(sql, values);
    }

    list = await context.app.sqlclient.queryAll(list);

    context.body = list;

    await next();
}


async function PUT(context, next) {

    let data = await context.acceptData();
    let table = '';
    let primarykey = '';
    let list = [];
    let index = 0;
    let item;

    data = JSON.parse(data);

    table = data.tblname;
    primarykey = data.primarykey;
    data = data.data;

    while (item = data[index++]) {
        list.push('delete from ' + table + ' where ' + primarykey + '=?', [item]);
    }

    list = await context.app.sqlclient.queryAll(list);

    context.body = list;

    await next();

}
