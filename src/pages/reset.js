
module.exports = async function (context, next) {

    switch (context.request.method) {
        case 'GET':
            //await GET(context, next);
            break;

        case 'POST':
            //await POST(context, next);
            break;

        case 'PUT':
            await PUT(context, next);
            break;
    }
};


async function PUT(context, next) {

    let data = await context.acceptData();
    let sql = '';

    data = JSON.parse(data);

    if (!(data[0] | 0)) {
        context.send(500, 'WARNING：Code injection;');
        return;
    }

    //update userinfo set userpassword = MD5(CONCAT(LOWER(useraccount),'@','123456')) where id = @id
    sql = 'update userinfo set userpassword = MD5(CONCAT("s0c7k5j5@123456")) where id = ' + data[0];

    //await context.app.sqlclient.query(sql, data);
    await context.app.sqlclient.query(sql);

   // context.app.log(context.session.useraccount, '修改', '密码重置');

    await next();
}


