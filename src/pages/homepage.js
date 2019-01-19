const SQLAPI = require('../base/sqlapi').SQLAPI;

const clear = require('../chart/home').clearCache;

const api = new SQLAPI({
    table: 'homepage',
    //like: 'pagename',     //与 where 不用同时使用，需要另写接口实现；
    //where: ' pid={0} ',
    autoIncreament: true,
    orderBy: 'sort',
    log:'首页图表'
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
            clear();
            break;
    }
};


async function GET(context, next) {

    let query = context.query;
   //let query_SQL = 'select * from homepage where pid='+ query.pid + ' and (pagename like "%' + query.c + '%") order by pid,sort ';
    let query_SQL = 'select id, pagejson from homepage where pid=0 limit 1 ';

    let list = await context.app.sqlclient.query(query_SQL);

    context.body = list[0];

    await next();
}


async function PUT(context, next) {

    let data = await context.acceptData();
    let sql = '';

    data = JSON.parse(data);

    if (!(data[0] | 0)) {
        context.send(500, 'WARNING：Code injection;');
        return;
    }

    sql = 'update homepage set pagejson=?  where id=?';

    await context.app.sqlclient.query(sql, [data[1], data[0]]);

    //context.app.log(context.session.useraccount, '修改', '密码重置');

    await next();
}


