// const query_SQL = ' select (select 1 from role2chart b where b.chartid = a.id and b.roleid=?) as XZ, ' +
//     ' id,chartname,remarks ' +
//     ' from chartinfo a  ' +
//     ' where isuse = 1  ' +
//     ' order by pid,sort ';

// const query_SQL = ' select id,pid,text,icon,checked ' +
//     ' from (select id,pid,charttypename as text,"icon-charttype" as icon,0 as checked,sort from charttype ' +
//     '	UNION ' +
//     '	select -id,pid,chartname as text,"icon-chart" as icon, ' +
//     '		case when b.roleid is not null then 1 else 0 end as checked,a.sort ' +
//     '	from chartinfo a left join role2chart b on b.chartid = a.id and b.roleid=?) d1 ' +
//     ' order by pid,sort ';

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

    let query_SQL = ' select id,pid,text,icon,checked ' +
        ' from ( ' +
        ' 	select id,pid,charttypename as text,"icon-charttype" as icon, ' +
        ' 				(exists(select 1 from chartinfo where id in (select chartid from role2chart where roleid=' + context.paths[0] + '))) as checked,sort  ' +
        ' 	from charttype where pid = 0 ' +
        ' 	UNION ' +
        ' 	select id,pid,charttypename as text,"icon-charttype" as icon, ' +
        ' 	(exists(select 1 from chartinfo where id in (select chartid from role2chart where roleid=' + context.paths[0] + ') and chartinfo.pid = charttype.id)) as checked,sort ' +
        ' 	from charttype where pid <> 0 ' +
        ' 	UNION ' +
        ' 	select -id,pid,chartname as text,"icon-chart" as icon, ' +
        ' 	case when b.roleid is not null then 1 else 0 end as checked,a.sort ' +
        ' 	from chartinfo a left join role2chart b on b.chartid = a.id and b.roleid=' + context.paths[0] +
        ' ) d1 ' +
        '  order by pid,sort ';

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

    while (chartid = data[index++]) {
        //
        if (chked === 1) {

            sql = 'insert into role2chart(roleid,chartid) select ' + roleid + ',' + chartid
                + ' where not exists(select 1 from role2chart where roleid=' + roleid + ' and chartid=' + chartid + ')';
        }
        else {
            sql = 'delete from role2chart where roleid=' + roleid + ' and chartid=' + chartid;
        }

        list.push(sql,[]);
    }

    list = await context.app.sqlclient.queryAll(list);

    context.body = list;
    await next();

    // let data = await context.acceptData();
    // let sql = '';

    // data = JSON.parse(data);
    // if (!(data[0] |= 0) || !(data[1] |= 0)) {
    //     context.send(500, 'WARNING：Code injection;');
    //     return;
    // }

    // if (data.pop()) {
    //     sql = 'insert into role2chart(roleid,chartid) select "' + data[0] + '",' + data[1]
    //         + ' where not exists(select 1 from role2chart where roleid=? and chartid=?)';
    // }
    // else {
    //     sql = 'delete from role2chart where roleid=? and chartid=?';
    // }

    // await context.app.sqlclient.query(sql, data);
    // await next();
}



