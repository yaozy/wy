const query_SQL = 'select id,pid,orgtreecode,orgtreename as text,"icon-orgtree" as icon from orgtree order by pid,sort ';


module.exports = async function (context, next) {

    let list = await context.app.sqlclient.query(query_SQL);

    context.body = list;

    //console.log(list);

    await next();
}



