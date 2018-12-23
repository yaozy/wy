const query_SQL = 'select * from chartinfo order by pid,sort ',
    query_SQL2 = 'select * from chartinfo where pid=? order by pid,sort ';

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

    let list = [];
    if (context.paths[0] === '1') {
        list = await context.app.sqlclient.query(query_SQL);
    }
    else {
        list = await context.app.sqlclient.query(query_SQL2, context.paths[0]);
    };

    context.body = list;

    await next();
}



