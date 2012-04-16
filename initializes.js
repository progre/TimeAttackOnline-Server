exports.initialize = function (express, pg) {
    var dao = initializeDBAsync(pg, function (dao) {
        initializeServer(express, dao);
    });
};

var ServerCommandsModel = require('./servercommandsmodel').ServerCommandsModel;
var Dao = require('./dao').Dao;

function initializeServer(express, dao) {
    console.log('Initialize: server');
    var server = express.createServer();
    initializeServerCommands(server, dao);
    var port = process.env.PORT || process.env.C9_PORT;
    server.listen(port, function() {
        console.log('Initialize: server --> Succeeded.');
        console.log("Listening on " + port);
    });
}

function initializeServerCommands(server, dao) {
    var serverCommandsModel = new ServerCommandsModel(dao);
    server.get('/get', serverCommandsModel.get);
    server.get('/add', function(req, res) {
        try {
            var passPhrase = req.param('pass-phrase');
            var title = req.param('title');
            var startTime = new Date(req.param('start-time'));
            if (passPhrase === undefined ||
                title === undefined ||
                startTime === undefined) {
                res.send(400);
                return;
            }
            console.log(startTime.toString());


            // TODO: DB Access

            res.send('success');
        } catch (e) {
            res.send(e.toString(), 500);
            return;
        }
    });
    server.get('/daotest', serverCommandsModel.daoTest);
}

function initializeDBAsync(pg, callback) {
    console.log('Initialize: DB');
    if (!('DATABASE_URL' in process.env))
    {
        console.log('Initialize: DB --> has no database.');
        callback(null);
        return;
    }
    pg.connect(process.env.DATABASE_URL, function(error, client) {
        var dao = new Dao(client);
        console.log('Initialize: DB --> Succeeded. ' + error.toString());
        callback(dao);
        return;
    });
}