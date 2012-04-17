var express = require('express');
var pg = require('pg');
var ServerCommandsModel = require('./servercommandsmodel').ServerCommandsModel;
var Dao = require('./dao').Dao;
var MemoryDao = require('./memorydao').MemoryDao;

function initialize() {
    initializeDBAsync(function (dao) {
        initializeServer(dao, function (port) {
            if (port < 0) {
                console.log('Initialize: server --> Failed.');
                return;
            }
            console.log('Initialize: server --> Succeeded.');
            console.log("Listening on " + port);
        });
    });
}

function initializeDBAsync(callback) {
    console.log('Initialize: DB');
    if (!('DATABASE_URL' in process.env))
    {
        console.log('Initialize: DB --> has no database.');
        callback(new MemoryDao());
        return;
    }
    pg.connect(process.env.SHARED_DATABASE_URL, function(error, client) {
        console.log('Initialize: DB --> Succeeded. ' + error.toString());
        callback(new Dao(client));
        return;
    });
}

function initializeServer(dao, callback) {
    console.log('Initialize: server');
    var server = express.createServer();
    initializeServerCommands(server, dao);
    var port = process.env.PORT || process.env.C9_PORT;
    server.listen(port, function () {
        callback(port);
    });
}

function initializeServerCommands(server, dao) {
    var serverCommandsModel = new ServerCommandsModel(dao);
    server.get('/get', function (req, res) { serverCommandsModel.get(req, res); });
    server.get('/add', function(req, res) { serverCommandsModel.add(req, res); });
    server.set('/add', function(req, res) { serverCommandsModel.add(req, res); });
    server.get('/daotest', function (req, res) { serverCommandsModel.daoTest(req, res); });
}

exports.initialize = initialize;
