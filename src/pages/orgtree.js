//const query_SQL = 'select * from orgtree where pid = ? order by sort ';

const SQLAPI = require('../base/sqlapi').SQLAPI;


var api = new SQLAPI({
    table: 'orgtree',
    primaryKey: 'id',
    like: 'orgtreecode,orgtreename',
    orderBy: 'pid,sort',
    log: '组织树'
});


module.exports = async function (context, next) {

    switch (context.request.method) {
        case 'GET':
            await GET(context, next);
            break;

        case 'POST':
            await api.POST(context, next);
            break;

        case 'PUT':
            await PUT(context, next);
            //await api.PUT(context, next);
            break;
    }
};


async function GET(context, next) {

    let list = [];
    let query = context.query;
    let query_SQL = '';

    if (query.ot) {
        query_SQL = 'select * from orgtree where pid=' + query.pid + ' and ((orgtreecode like "%' + query.ot + '%") or (orgtreename like "%' + query.ot + '%") ) ' + api.orderBy;
        list = await context.app.sqlclient.query(query_SQL);
    }
    else {
        query_SQL = 'select * from orgtree where pid=' + query.pid + api.orderBy;
        list = await context.app.sqlclient.query(query_SQL);
    }

    context.body = list;

    await next();
};

async function PUT(context, next) {

    let data = await context.acceptData();
    //let list = [];
    let index = 0;
    let item;
    let log;
    let sql;

    let connection = await context.app.sqlclient.createConnection();

    data = JSON.parse(data);

    log = data.log;
    data = data.data;

    try {
        await connection.beginTransaction();

        while (item = data[index++]) {

            sql = ' delete from orgtree where id = ? and not EXISTS(select d1.pid from (select pid from orgtree where pid= ?) d1) and not EXISTS(select 1 from orginfo where pid = ?)';
            item = await connection.query(sql, [item, item, item]);

            if (!item.affectedRows) {

                await connection.rollback();

                context.type = 'text';
                context.body = index;

                await next();
                return;
            }
        }

        await connection.commit();

        if (log && api.log) {
            context.app.logs(context.session.useraccount, api.log, log);
        }

        await next();
    }
    catch (e) {
        await connection.rollback();
        throw e;
    }
    finally {
        connection.release();
    }

}

