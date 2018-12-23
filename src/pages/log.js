// const query_SQL = 'select * from loginfo  order by time desc';
// const query_SQL2 = 'select * from loginfo where (logby like "%?%" or text like "%?%") order by time desc';


module.exports = async function (context, next) {

    switch (context.request.method) {
        case 'GET':
            await GET(context, next);
            break;

        case 'POST':
            //POST(context, next);
            break;

        case 'PUT':
            //PUT(context, next);
            break;
    }
};


async function GET(context, next) {

    let array = [];
    let query = context.query;

    let query_SQL = 'select * from loginfo';

    if (query.l) {
        let list = decodeURIComponent(query.l).split('|');
        array.push('(type="' + list.join('" or type="') + '")');
    }

    if (query.s) {
        array.push('time>="' + new Date(+query.s).format('yyyy-MM-dd') + '"');
    }

    if (query.e) {
        array.push('time<="' + new Date(+query.e).format('yyyy-MM-dd') + '"');
    }

    if (query.t) {
        var tt = decodeURIComponent(query.t);
        array.push('(logby like "%' + tt + '%" or text like "%' + tt + '%")');
    }

    query_SQL = query_SQL + (array.length > 0 ? ' where ' + array.join(' and ') : '') + ' order by time desc ';

    let list = await context.app.sqlclient.query(query_SQL);

    context.body = list;

    await next();
}


