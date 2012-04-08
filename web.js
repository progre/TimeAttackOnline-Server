console.log('wakeup...');
//var conString = process.env.DATABASE_URL || "tcp://<ユーザー名>:<パスワード>@localhost:5432/testdb";
//console.log('db on: ' + conString);
var express = require('express');
var server = express.createServer();
server.get('/exists', function(req, res) {
    req.param('pass-phrase', '');
    var message = JSON.stringify({exists:false});
    res.send(message);
});
server.get('/add', function(req, res) {
    req.param('pass-phrase');
    res.send(JSON.stringify({result:true}));
});
var port = process.env.PORT || process.env.C9_PORT;
server.listen(port, function() {
    console.log("Listening on " + port);
});
