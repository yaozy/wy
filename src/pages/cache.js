const query_SQL = 'select id,pid,orgtreename as text,"icon-orgtree" as icon from orgtree order by pid,sort ';


const app = require('../base/app');

var cache;

exports.orglist = async function () {

    if (cache) {
        return cache;
    }

    let list = await app.sqlclient.query(query_SQL);

    let keys = {};

    for (let i = list.length; i--;)
    {
        let item = list[i];
        keys[item.id] = item;
    }

    for (let i = list.length; i--;) {

        let item = list[i],
            pid = item.pid;

        if (pid)
        {
            item.parent = keys[pid];
        }
    }

    return cache = keys;
}
