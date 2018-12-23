const query_SQL = 'select id,pid,charttypename as text,"icon-moduletype" as icon from charttype where pid<>0 ORDER BY pid,sort ';


module.exports = async function (context, next) {

    let list = await context.app.sqlclient.query(query_SQL);

    context.body = list;

    await next();
};
