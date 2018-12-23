const find = require('flyingon-server/lib/server/session').find;

const FUNC_SQL1 = ' select id, pid, type, funcname, funcurl, icon from funcinfo order by pid, sort';
const FUNC_SQL2 = ' select id, pid, type, funcname, funcurl, icon from funcinfo' +
    ' where pid=0 or exists(select 1 from role2user a, role2func b where a.userid=? and a.roleid=b.roleid and (b.funcid=funcinfo.id or b.funcid=funcinfo.pid))' +
    ' order by pid, sort';

const CHART_SQL1 = ' select id, chartname, (select charttypename from charttype where id = chartinfo.pid) as typename from chartinfo order by pid, sort';
const CHART_SQL2 = ' select id, chartname, (select charttypename from charttype where id = chartinfo.pid) as typename from chartinfo' +
    ' where exists(select 1 from role2user a, role2chart b where a.userid=? and b.roleid=a.roleid and b.chartid=chartinfo.id)' +
    ' order by pid, sort';


module.exports = async (context, next) => {

    let sqlclient = context.app.sqlclient,
        session = find(context);

    if (session)
    {
        let funcs, charts, orginfo;
  
        if (session.useraccount === 'system')
        {
            funcs = await sqlclient.query(FUNC_SQL1);
            charts = await sqlclient.query(CHART_SQL1);
        }
        else
        {
            funcs = await sqlclient.query(FUNC_SQL2, [session.id]);
            charts = await sqlclient.query(CHART_SQL2, [session.id]);
        }

        context.body = [
            menutree(funcs, charts),
            session
        ];
    }

    await next();
}


function menutree(funcs, charts) {

    let tree = [],
        keys = Object.create(null),
        cache;

    for (let i = 0, l = funcs.length; i < l; i++)
    {
        let item = funcs[i],
            id = item.id,
            pid = item.pid,
            icon = item.icon;

        item = {
            url: item.funcurl,
            type: item.type,
            text: item.funcname,
            icon: 'icon-' + icon
        };

        if (icon === 'chartlist')
        {
            item.children = chartList(charts);
            tree.push(item);
        }
        else if (cache = keys[pid])
        {
            (cache.children || (cache.children = [])).push(item);
        }
        else
        {
            tree.push(item);
        }

        keys[id] = item;
    }

    return tree;
}



function chartList(charts) {

    let list = [],
        item,
        children;

    for (let i = charts.length; i--;)
    {
        item = charts[i];
        children = list[item.typename];

        if (children)
        {
            children = children.children;
        }
        else
        {
            list.push(list[item.typename] = {

                type: 'chart-type',
                text: item.typename,
                icon: 'icon-charttype',
                children: children = []
            });
        }

        children.push({
            id: item.id,
            url: 'chart/' + item.id,
            type: 'chart',
            text: item.chartname,
            icon: 'icon-chart'
        });
    }

    return list;
}
