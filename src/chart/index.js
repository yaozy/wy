const app = require('../base/app');
const cache = require('./cache');




async function loadData(query, session) {

    let params = query[1];

    if (params)
    {
        params = params.slice(0);

        for (let i = params.length; i--;)
        {
            switch (params[i])
            {
                case 'userid':
                    params[i] = session.id;
                    break;

                case 'account':
                    params[i] = session.useraccount;
                    break;
            }
        }
    }

    return await app.sqlclient.query(query[0], params);
}



app.route('/chart-meta', async (context, next) => {

    let chart = await cache.find(context.paths[0]);

    if (chart)
    {
        let data = await loadData(chart.sql, context.session);

        context.body = '[' + chart.config + ',' + chart.computed + ',' + JSON.stringify(data) + ']';
    }
    else
    {
        context.body = null;
    }

    await next();
});



app.route('/chart-home', require('./home.js'));
