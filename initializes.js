exports.initialize = function (express, pg) {
    initializeServer(express);
    initializeDB(pg);
};

var Dao = require('./dao').Dao;

var dao;

function initializeServer(express) {
    console.log('Initialize: server');
    var server = express.createServer();
    initializeServerCommands(server);
    var port = process.env.PORT || process.env.C9_PORT;
    server.listen(port, function() {
        console.log('Initialize: server --> Succeeded.');
        console.log("Listening on " + port);
    });
}

function initializeServerCommands(server) {
    server.get('/get', function(req, res) {
        try {
            var passPhrase = req.param('pass-phrase');
            if (passPhrase === undefined) {
                res.send(400);
                return;
            }
            var timeAttackEvent = {};
            if (dao === undefined) {
//                res.send(500);
//                return;
                timeAttackEvent.title = '';
                timeAttackEvent.startTime = new Date();
            } else {
                dao.getTimeAttackEvent(passPhrase);
            }
            // TODO: DB Access

            if (timeAttackEvent === null) {
                res.send('failure');
                return;
            }
            res.send(JSON.stringify({
                title:timeAttackEvent.title,
                'start-time':timeAttackEvent.startTime.toString()
            }));
            return;
        } catch (e) {
            res.send(e.toString(), 500);
            return;
        }
    });
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
}

function initializeDB(pg) {
    console.log('Initialize: DB');
    if (!('DATABASE_URL' in process.env))
    {
        console.log('Initialize: DB --> has no database.');
        return;
    }
    pg.connect(process.env.DATABASE_URL, function(error, client) {
        dao = new Dao(client);
        console.log('Initialize: DB --> Succeeded. ' + error.toString());
    });
}