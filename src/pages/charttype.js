//const query_SQL = 'select * from charttype where pid<>0 order by sort ';


const SQLAPI = require('../base/sqlapi').SQLAPI;

const api = new SQLAPI({
    table: 'charttype',
    like: 'charttypename',
    autoIncreament: true,
    orderBy: 'pid,sort',
    log:'图表分类'
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
            break;
    }
};


async function GET(context, next) {

    let list = [];


    if (context.paths[0]) {
        
        let query_SQL2 = 'select * from charttype where pid<>0 and (charttypename like "%' + decodeURIComponent(context.paths[0]) + '%") ' + api.orderBy;

        list = await context.app.sqlclient.query(query_SQL2);
    }
    else {
        let query_SQL = 'select * from charttype where pid<>0 ' + api.orderBy;
        list = await context.app.sqlclient.query(query_SQL);
    };

    context.body = list;

    await next();
};

async function PUT(context, next) {

    let data = await context.acceptData();
    let index = 0;
    let item;
    let log;
    let sql;

    let connection = await context.app.sqlclient.createConnection();

    data = JSON.parse(data);

    log = data.log;
    data = data.data;

    try {
        connection.beginTransaction();

        while (item = data[index++]) {

            sql = ' delete from charttype where id = ? and not EXISTS(select d1.pid from (select pid from charttype where pid= ?) d1) and not EXISTS(select 1 from chartinfo where pid = ?)';
            item = await connection.query(sql, [item, item, item]);

            if (!item.affectedRows) {

                connection.rollback();

                context.type = 'text';
                context.body = index;

                await next();
                return;
            }
        }

        connection.commit();

        if (log && api.log) {
            context.app.logs(context.session.useraccount, api.log, log);
        }

        await next();
    }
    catch (e) {
        connection.rollback();
        throw e;
    }
    finally {
        connection.close();
    }

}



