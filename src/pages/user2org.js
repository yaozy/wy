

// const query_SQL = 'select (select max(orgtreename) from orgtree d where d.id = a.pid ) as orgtreename,a.* from orginfo a' +
//     ' where a.isuse = 1 ' +
//     ' and EXISTS(SELECT 1 from role2org b where b.orgid = a.id ' +
//     ' and EXISTS(select 1 from role2user c where b.roleid=c.roleid and c.userid=?)) ' +
//     ' order by a.pid,a.sort ';

const query_SQL = 'select id,pid,orgname as text,"icon-org" as icon from orginfo a' +
    ' where a.isuse = 1 ' +
    ' and EXISTS(SELECT 1 from role2org b where b.orgid = a.id ' +
    ' and EXISTS(select 1 from role2user c where b.roleid=c.roleid and c.userid=?)) ' +
    ' order by a.pid,a.sort ';


const cache = require('../pages/cache.js');



module.exports = async function (context, next) {

    let list = await context.app.sqlclient.query(query_SQL, context.paths[0]);

    context.body = await parse(list);

    await next();
}


async function parse(infos) {

    let orgtree = await cache.orglist();
    let list = [];
    let keys = {};

LOOP:
    for (let i = infos.length; i--;)
    {
        let item = infos[i],
            parent = keys[item.pid],
            node;

        item.id = -item.id;

        if (parent)
        {
            parent.children.push(item);
        }
        else if (node = orgtree[item.pid])
        {
            keys[node.id] = item = {
                id: node.id,
                pid: node.pid,
                text: node.text,
                icon: node.icon,
                children: [item]
            };

            while (parent = node.parent)
            {
                if (keys[parent.id])
                {
                    keys[parent.id].children.push(item);
                    continue LOOP;
                }

                keys[parent.id] = item = {
                    id: parent.id,
                    pid: parent.pid,
                    text: parent.text,
                    icon: parent.icon,
                    children: [item]
                };

                node = parent;
            }

            list.push(item);
        }
    }

    return list;
}

