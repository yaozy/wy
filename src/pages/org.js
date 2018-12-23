const query_SQL = 'select * from orginfo where pid=? order by sort ';

const SQLAPI = require('../base/sqlapi').SQLAPI;

const api = new SQLAPI({
    table: 'orginfo',
    primaryKey: 'id',
    like: 'orgcode,orgname',
    //where: ' pid={0} ',
    orderBy: 'pid,sort',
    log:'物业项目'
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
            await api.PUT(context, next);
            break;
    }
};


async function GET(context, next) {

    let list = [];
    let query = context.query;

    if (query.pid) {
        let query_SQL2 = 'select * from orginfo where pid="' + query.pid + '" and ((orgcode like "%' + query.o + '%") or (orgname like "%' + query.o + '%") ) order by pid,sort ';
        list = await context.app.sqlclient.query(query_SQL2);
    }
    else {
        list = await context.app.sqlclient.query(query_SQL, decodeURIComponent(context.paths[0]));
    }

    context.body = list;

    await next();
}



