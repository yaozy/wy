
const SQLAPI = require('../base/sqlapi').SQLAPI;


var api = new SQLAPI({
    table: 'userinfo',
    primaryKey: 'id',
    log: '用户'
});


module.exports = async function (context, next) {

    switch (context.request.method) {
        case 'GET':
            //await GET(context, next);
            break;

        case 'POST':
            await POST(context, next);
            break;

        case 'PUT':
            //await api.PUT(context, next);
            break;
    }
};

async function POST(context, next) {

    let data = await context.acceptData();
    let item;
    let log;
    let sql;

    data = JSON.parse(data);

    log = data.log;
    data = data.data;

    sql = ' update userinfo set userpassword = "' + data[2] + '"  where useraccount = "' + data[0] + '" and userpassword = "' + data[1] + '"';
    item = await context.app.sqlclient.query(sql, data);
    if (!item.affectedRows) {

        context.type = 'text';
        context.body = 1;

        await next();
        return;
    }

    if (log && api.log) {
        context.app.log(context.session.useraccount, '修改', log);
    }

    await next();

}

