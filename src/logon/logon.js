const USER_SQL = 'select * from userinfo where useraccount=? and userpassword=?';


module.exports = async (context, next) => {

    let query = context.query,
        user = await context.app.sqlclient.query(USER_SQL, [query.user, query.password]);

    if (user = user[0])
    {
        await context.createSession(user);

        context.body = user;
        context.app.log(user.useraccount, '登录', '登录系统'); 
    }

    await next();
}

