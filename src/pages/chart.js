const SQLAPI = require('../base/sqlapi').SQLAPI;

const clear = require('../chart/cache').clearCache;

const api = new SQLAPI({
    table: 'chartinfo',
    //like: 'chartname',     //与 where 不用同时使用，需要另写接口实现；
    //where: ' pid={0} ',
    autoIncreament: true,
    orderBy: 'sort',
    log:'图表'
});


module.exports = async function (context, next) {

    switch (context.request.method) {
        case 'GET':
            await GET(context, next);
            break;

        case 'POST':
            await api.POST(context, next);
            clear();
            break;

        case 'PUT':
            await api.PUT(context, next);
            break;
    }
};


async function GET(context, next) {

    let query = context.query;
    let query_SQL = 'select * from chartinfo where pid='+ query.pid + ' and (chartname like "%' + query.c + '%") order by pid,sort ';

    let list = await context.app.sqlclient.query(query_SQL);

    context.body = list;

    await next();
}



