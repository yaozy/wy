



class SQLAPI {
    

    constructor(options) {

        this.table = options.table;
        this.primaryKey = options.primaryKey || 'id';
        this.autoIncreament = options.autoIncreament;

        this.select = 'select ' + (options.fields || '*') + ' from ' + this.table;
        this.where = options.where;
        this.like = options.like ? options.like.match(/\w+/g) : null;
        this.orderBy = options.orderBy ? ' order by ' + options.orderBy : '';
        this.log = options.log;
    }


    async GET(context, next) {

        let sql = this.select;
        let where = this.where;
        let like = this.like;
        let key;

        if (where)
        {
            sql += ' where ' + where.replace(/\{(\d)\}/, function (_, index) {

                return context.paths[index];
            });
        }
        else if (like && (key = context.paths[0]))
        {
            key = decodeURIComponent(key);
            key = ' like "%' + key.replace(/"/g, '\\"') + '%"';
            
            sql = sql + ' where ' + like.join(key + ' or ') + key; 
        }

        context.body = await context.app.sqlclient.query(sql + this.orderBy);
    
        await next();
    }


    async POST(context, next) {

        let data = await context.acceptData();
        let primaryKey = this.primaryKey;
        let logs = this.log && [];
        let list = [];
        let index = 0;
        let item;
    
        data = JSON.parse(data);

        while (item = data[index++])
        {
            let state = item['@'];

            delete item['@'];

            let sql;
            let keys = Object.keys(item);
            let values;

            if (logs)
            {
                logs.push(state, item);
            }

            // add
            if (state === 1)
            {
                if (this.autoIncreament)
                {
                    delete item[primaryKey];
                }

                keys = Object.keys(item);
                values = Object.values(item);

                sql = 'insert into ' + this.table + '(' + keys.join(', ') + ') values(' +
                    new Array(keys.length).join('?, ') + '?' +
                ')';
            }
            else // update
            {
                let key = item[primaryKey];

                delete item[primaryKey];

                keys = Object.keys(item);
                
                values = Object.values(item);
                values.push(key);

                sql = 'update ' + this.table + ' set ' + keys.join('=?, ') + '=? where ' + primaryKey + '=?';
            }

            list.push(sql, values);
        }

        list = await context.app.sqlclient.queryAll(list);
    
        context.body = list;

        if (logs)
        {
            context.app.logs(context.session.useraccount, this.log, logs, true);
        }
    
        await next();
    }


    async PUT(context, next) {

        let data = await context.acceptData();
        let primaryKey = this.primaryKey;
        let list = [];
        let index = 0;
        let item;
        let log;
    
        data = JSON.parse(data);

        log = data.log;
        data = data.data;

        while (item = data[index++])
        {
            list.push('delete from ' + this.table + ' where ' + primaryKey + '=?', [item]);
        }

        list = await context.app.sqlclient.queryAll(list);
    
        context.body = list;

        if (log && this.log)
        {
            context.app.logs(context.session.useraccount, this.log, log);
        }
    
        await next();
    }

}



exports.SQLAPI = SQLAPI;


exports.sqlroute = function (options) {

    let api = new SQLAPI(options);

    return async (context, next) => {

        await api[context.request.method](context, next);
    };
}

