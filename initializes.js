exports.initialize = function (express, pg) {
    initializeServer(express);
    initializeDB(pg);
};

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

            // TODO: DB Access
            var timeAttackEvent = new object();
            timeAttackEvent.title = '';
            timeAttackEvent.startTime = new Date();

            if (timeAttackEvent == null) {
                res.send('failure');
                return;
            }
            res.send(JSON.stringify({
                title:timeAttackEvent.title,
                'start-time':timeAttackEvent.startTime.toString()
            }));
            return;
        } catch (e) {
            res.send('failure');
            return;
        }
    });
    server.get('/add', function(req, res) {
        try {
            var passPhrase = req.param('pass-phrase');
            var title = req.param('title');
            var startTime = new Date(req.param('start-time'));

            // TODO: DB Access

            res.send('success');
        } catch (e) {
            res.send('failure');
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
      console.log('Initialize: DB --> Succeeded.');
    });
}