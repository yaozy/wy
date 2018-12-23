const query_SQL = 'select (select 1 from role2user b where b.userid = a.id and b.roleid=?) as XZ, ' +
    ' a.id,useraccount,username,jobno,phone,email,remarks ' +
    ' from userinfo a ' +
    ' where isuse = 1 and useraccount <> "system" ' +
    ' order by a.sort ';


//const SQLAPI = require('./sqlapi').SQLAPI;

module.exports = async function (context, next) {

    switch (context.request.method) {
        case 'GET':
            await GET(context, next);
            break;

        case 'POST':
            await POST(context, next);
            break;

        case 'PUT':
            //await PUT(context, next);
            break;
    }
};


async function GET(context, next) {

    let list = await context.app.sqlclient.query(query_SQL, context.paths[0], context.paths[1]);

    context.body = list;

    await next();
};

async function POST(context, next) {

    let data = await context.acceptData();
    let sql = '';

    data = JSON.parse(data);
    if (!(data[0] | 0)) {
        context.send(500, 'WARNING：Code injection;');
        return;
    }

    if (data.pop()) {

        sql = 'insert into role2user(roleid,userid) select ' + data[0] + ',' + data[1]
            + ' where not exists(select 1 from role2user where roleid=? and userid=?)';
    }
    else {
        sql = 'delete from role2user where roleid=? and userid=?';
    }

    await context.app.sqlclient.query(sql, data);
    await next();
};


