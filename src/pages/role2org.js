// const query_SQL = ' select (select 1 from role2org b where b.orgid = a.id and b.roleid=?) as XZ, ' +
//     ' id,orgcode,orgname,remarks ' +
//     ' from orginfo a  ' +
//     ' where isuse = 1 ' +
//     ' order by pid,sort '

// const query_SQL = ' select id,pid,text,icon,checked  ' +
//     ' from (select id,pid,orgtreename as text,"icon-orgtree" as icon,(select ifnull(max(1),0) from orginfo ' +
//     ' where locate(orgtree.orgtreecode,orginfo.codepath) > 0 ' +
//     ' and orginfo.id in (select orgid from role2org where role2org.orgid = orginfo.id and role2org.roleid=?)) as checked,sort from orgtree 	' +
//     ' UNION 	' +
//     ' select -id,pid,orgname as text,"icon-org" as icon, 	' +
//     ' case when b.roleid is not null then 1 else 0 end as checked,a.sort 	' +
//     ' from orginfo a left join role2org b on b.orgid = a.id and b.roleid=?) d1  order by pid,sort ';

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

    let query_SQL = ' select id,pid,text,icon,checked  ' +
        ' from (select id,pid,orgtreename as text,"icon-orgtree" as icon,(select ifnull(max(1),0) from orginfo ' +
        ' where locate(orgtree.orgtreename,orginfo.namepath) > 0 ' +
        ' and orginfo.id in (select orgid from role2org where role2org.orgid = orginfo.id and role2org.roleid=' + context.paths[0] + ')) as checked,sort from orgtree 	' +
        ' UNION 	' +
        ' select -id,pid,orgname as text,"icon-org" as icon, 	' +
        ' case when b.roleid is not null then 1 else 0 end as checked,a.sort 	' +
        ' from orginfo a left join role2org b on b.orgid = a.id and b.roleid=' + context.paths[0] + ') d1  order by pid,sort ';

    let list = await context.app.sqlclient.query(query_SQL);

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

    while (orgid = data[index++]) {
        //
        if (chked === 1) {

            sql = 'insert into role2org(roleid,orgid) select ' + roleid + ',' + orgid
                + ' where not exists(select 1 from role2org where roleid=' + roleid + ' and orgid=' + orgid + ')';
        }
        else {
            sql = 'delete from role2org where roleid=' + roleid + ' and orgid=' + orgid;
        }

        list.push(sql, []);
    }

    list = await context.app.sqlclient.queryAll(list);

    context.body = list;
    await next();

    // let data = await context.acceptData();
    // let sql = '';

    // data = JSON.parse(data);

    // if (!(data[0] | 0)) {
    //     context.send(500, 'WARNING：Code injection;');
    //     return;
    // }

    // if (data.pop()) {
    //     sql = 'insert into role2org(roleid,orgid) select ' + data[0] + ',' + data[1]
    //         + ' where not exists(select 1 from role2org where roleid=? and orgid=?)';
    // }
    // else {
    //     sql = 'delete from role2org where roleid=? and orgid=?';
    // }

    // await context.app.sqlclient.query(sql, data);
    // await next();
}


