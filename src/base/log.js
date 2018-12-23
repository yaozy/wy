const app = require('./app');

const LOG_SQL = 'insert into loginfo(logby, type, text, time) values(?, ?, ?, ?)';
const caches = [];

let delay;



app.log = function (user, type, text) {

    let date = new Date().format('yyyy-MM-dd hh:mm:ss');

    caches.push([user, type, text, date]);

    if (delay)
    {
        clearTimeout(delay);
        delay = 0;
    }
    
    write();
}


app.logs = function (user, text, logs, post) {

    let date = new Date().format('yyyy-MM-dd hh:mm:ss');

    for (let i = 0, l = logs.length; i < l; i++)
    {
        if (post)
        {
            let type = logs[i++] === 1 ? '新增' : '修改';
            let item = logs[i];

            caches.push([user, type, text + '  ' + type + '数据: ' + JSON.stringify(item), date]);
        }
        else
        {
            caches.push([user, '删除', text + '  删除数据: ' + logs[i], date]);
        }
    }

    if (delay)
    {
        clearTimeout(delay);
        delay = 0;
    }
    
    write();
}


async function write() {

    try
    {
        await app.sqlclient.query(LOG_SQL, caches[0]);

        caches.shift();

        if (caches[0])
        {
            write();
        }
    }
    catch (e)
    {
        delay = setTimeout(write, 5000);
    }
}

