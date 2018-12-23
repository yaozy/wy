const app = require('../base/app');

const sqlroute = require('../base/sqlapi').sqlroute;



/*用户【userinfo】*/
app.route('/user', true, sqlroute({
    table: 'userinfo',
    //primaryKey:'id',
    //fields: 'id, name',
    like: 'useraccount,username,jobno,phone',
    autoIncreament: true,
    orderBy: 'sort',
    log: '用户'
}));


/*角色【roleinfo】*/
app.route('/role', true, sqlroute({
    table: 'roleinfo',
    like: 'rolecode,rolename',
    autoIncreament: true,
    orderBy: 'sort',
    log:'角色'
}));

/*图表分类【charttype】*/
// app.route('/charttype', true, sqlroute({
//     table: 'charttype',
//     like: 'charttypename',
//     autoIncreament: true,
//     orderBy: 'sort'
// }));

/*图表【chart】*/
// app.route('/chart', true, sqlroute({
//     table: 'chartinfo',
//     //like: 'chartname',     //与 where 不用同时使用，需要另写接口实现；
//     where: ' pid={0} ',
//     autoIncreament: true,
//     orderBy: 'sort'
// }));

/*组织树【orgtree】*/
// app.route('/orgtree', true, sqlroute({
//     table: 'orgtree',
//     primaryKey: 'id',
//     like: 'id,orgtreename',
//     where: ' pid={0} ',
//     orderBy: 'pid,sort'
// }));

/*物业项目【orginfo】*/
// app.route('/org', true, sqlroute({
//     table: 'orginfo',
//     primaryKey: 'id',
//     like: 'id,orgname',
//     where: ' pid={0} ',
//     orderBy: 'pid,sort'
// }));

//密码重置
app.route('/reset', false, require('./reset'));

//修改密码
app.route('/mainsetpwd', true, require('./mainsetpwd'));

app.route('/chartlist', false, require('./chartlist'));
app.route('/chart', true, require('./chart'));
app.route('/charttype', true, require('./charttype'));
app.route('/charttypeinit', false, require('./charttypeinit'));

app.route('/orgtreeinit', false, require('./orgtreeinit'));
app.route('/org', true, require('./org'));
app.route('/orgtree', true, require('./orgtree'));

app.route('/log', false, require('./log'));

app.route('/user2chart', false, require('./user2chart'));
app.route('/user2func', false, require('./user2func'));
app.route('/user2org', false, require('./user2org'));
app.route('/user2role', false, require('./user2role'));

app.route('/role2chart', false, require('./role2chart'));
app.route('/role2func', false, require('./role2func'));
app.route('/role2org', false, require('./role2org'));
app.route('/role2user', false, require('./role2user'));

app.route('/charttbstru', false, require('./charttbstru'));
app.route('/chartdata', false, require('./chartdata'));
