// const query_SQL = 'select * from roleinfo a where EXISTS(select 1 from role2user b where a.id=b.roleid and b.userid=?) order by sort';

const query_SQL = 'select id,pid,rolename as text,"icon-role" as icon from roleinfo a ' +
    ' where EXISTS(select 1 from role2user c where a.id=c.roleid and c.userid=?) ' +
    ' order by a.pid,a.sort ';


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

    let list = await context.app.sqlclient.query(query_SQL, context.paths[0]);

    context.body = list;

    await next();
}



