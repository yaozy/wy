// const query_SQL = 'select (select max(charttypename) from charttype d where d.id = a.pid ) as charttypename,a.* from chartinfo a ' +
//     ' where a.isuse = 1 ' +
//     ' and EXISTS(SELECT 1 from role2chart b where b.chartid = a.id ' +
//     ' and EXISTS(select 1 from role2user c where b.roleid=c.roleid and c.userid=?)) ' +
//     ' order by a.pid,a.sort ';


// const query_SQL = 'select d5.id,d5.pid,d5.text,d5.icon' +
//     ' from (select id,pid,charttypename as text,"icon-chartlist" as icon,sort ' +
//     '			from charttype ' +
//     '			where exists(select 1 from chartinfo c1 ' +
//     '										where charttype.id = c1.pid ' +
//     '														and exists(select 1 from role2user a1, role2chart b1 where a1.userid=? and b1.roleid=a1.roleid and b1.chartid=c1.id)) ' +
//     '			UNION ' +
//     '			select -id,pid,chartname as text,"icon-chart" as icon,sort ' +
//     '			from chartinfo ' +
//     '			where exists(select 1 from role2user a, role2chart b where a.userid=? and b.roleid=a.roleid and b.chartid=chartinfo.id) ' +
//     ') d5 order by d5.pid, d5.sort';


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

    let query_SQL = 'select d5.id,d5.pid,d5.text,d5.icon' +
        ' from (select id,pid,charttypename as text,"icon-charttype" as icon,sort ' +
        '			from charttype ' +
        '			where exists(select 1 from chartinfo c1 ' +
        '										where charttype.id = c1.pid ' +
        '														and exists(select 1 from role2user a1, role2chart b1 where a1.userid=' + context.paths[0] + ' and b1.roleid=a1.roleid and b1.chartid=c1.id)) ' +
        '			UNION ' +
        '			select -id,pid,chartname as text,"icon-chart" as icon,sort ' +
        '			from chartinfo ' +
        '			where exists(select 1 from role2user a, role2chart b where a.userid=' + context.paths[0] + ' and b.roleid=a.roleid and b.chartid=chartinfo.id) ' +
        ') d5 order by d5.pid, d5.sort';

    let list = await context.app.sqlclient.query(query_SQL);

    context.body = list;

    await next();
}



