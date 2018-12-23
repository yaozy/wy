// const query_SQL = ' select (select 1 from role2func b where b.funcid = a.id and b.roleid=?) as XZ, ' +
//     ' id,pid,funcname,type,remarks ' +
//     ' from funcinfo a  ' +
//     ' where a.pid<>0 ' +
//     ' order by a.pid,a.sort  ';

const query_SQL = 'select id,pid,funcname as text,"icon-moduletype" as icon,'+
' case when b.roleid is not null then 1 else 0 end as checked'+
' from funcinfo a left join role2func b on b.funcid = a.id and b.roleid=?'+
' order by a.pid,a.sort';


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

    let list = await context.app.sqlclient.query(query_SQL, context.paths[0]);

    context.body = list;

    await next();
}

async function POST(context, next) {

    let data = await context.acceptData();
    let sql = '';
    let list = [];
    let index = 0;

    data = JSON.parse(data);

    let chked = data.shift();
    let roleid = data.shift();

    while (funcid = data[index++]) {
        //
        if (chked === 1) {

            sql = 'insert into role2func(roleid,funcid) select ' + roleid + ',' + funcid
                + ' where not exists(select 1 from role2func where roleid=' + roleid + ' and funcid=' + funcid + ')';
        }
        else {
            sql = 'delete from role2func where roleid=' + roleid + ' and funcid=' + funcid;
        }

        list.push(sql,[]);
    }

    list = await context.app.sqlclient.queryAll(list);

    context.body = list;
    await next();



    // let data = await context.acceptData();
    // let sql;
    
    // data = JSON.parse(data);

    // if (!(data[0] |= 0) || !(data[1] |= 0))
    // {
    //     context.send(500, 'WARNING：Code injection;');
    //     return;
    // }

    // if (data.pop())
    // {
    //     // sql = 'insert into role2func(roleid,funcid) select "' + data[0].replace(/"/g, '\\"') + '",'  + (data[1] | 0) 
    //     //     + ' where not exists(select 1 from role2func where roleid=? and funcid=?)';
        
    //         sql = 'insert into role2func(roleid,funcid) select ' + data[0]  + ','  + data[1]
    //         + ' where not exists(select 1 from role2func where roleid=? and funcid=?)';
    // }
    // else
    // {
    //     sql = 'delete from role2func where roleid=? and funcid=?';
    // }

    // await context.app.sqlclient.query(sql, data);
    // await next();
}


