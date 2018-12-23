const fs = require('fs');

const App = require('flyingon-server');

const compile = require('flyingon-server/lib/sqlroute/compile');

const sqlclient = new App(require('../settings.js')).sqlclient;


const routes = Object.create(null);


function loadRoutes(file) {

    Object.assign(routes, compile(sqlclient, fs.readFileSync(file, 'utf8')));
}


loadRoutes('./db.js');



exports.GET = async function (path, paths) {

    return await sqlclient.queryAll(routes[path].GET({ 

        paths: paths
    }));
}


exports.POST = async function (path, posts) {

    return await sqlclient.queryAll(routes[path].POST({ 

        posts: posts
    }));
}


exports.PUT = async function (path, paths, posts) {

    return await sqlclient.queryAll(routes[path].PUT({ 

        paths: paths,
        posts: posts
    }));
}


exports.DELETE = async function (path, paths) {

    return await sqlclient.queryAll(routes[path].DELETE({ 

        paths: paths
    }));
}
