// const query_SQL = 'select a.* from funcinfo a ' +
//     ' where EXISTS(SELECT 1 from role2func b where b.funcid = a.id ' +
//     ' and EXISTS(select 1 from role2user c where b.roleid=c.roleid and c.userid=?)) ' +
//     ' order by a.pid,a.sort ';

const query_SQL = 'select id,pid,funcname as text,"icon-moduletype" as icon from funcinfo a ' +
    ' where EXISTS(SELECT 1 from role2func b where b.funcid = a.id ' +
    ' and EXISTS(select 1 from role2user c where b.roleid=c.roleid and c.userid=?)) ' +
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



