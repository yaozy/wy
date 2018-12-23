module.exports = {

    // 是否开发模式
    dev: true,

    // http配置
    http: {
        port: 8085
    },

    // session配置
    session: {
        // session过期时间(分钟)
        timeout: 20
    },

    // 数据库配置
    database: {
        // 使用的数据库类型
        type: 'mysql',

        // mysql数据库
        mysql: {
            connectionLimit: 50,
            host: '127.0.0.1',
            user: 'root',
            password: '123456',
            database: 'scbidb'
        },

        // postgresql数据库
        postgresql: {
            user: 'postgres',
            database: 'test',
            password: '123456',
            port: 5432,
            // 连接池最大连接数
            max: 20,
            // 连接最大空闲时间 3s
            idleTimeoutMillis: 3000
        }
    },

    // 日志
    log: {
        name: 'wy',
        src: true,
        streams: [
            {
                type: 'rotating-file',
                path: './log/log.txt',
                period: '1d',
                count: 31
            }
        ]
    }

}
