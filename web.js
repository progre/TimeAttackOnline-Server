var express = require('express');
var server = express.createServer();
server.get('/exists', function(req, res) {
    res.send(req.param('pass-phrase'));
});
server.get('/add', function(req, res) {
    res.send(req.param('pass-phrase'));
    res.send(req.param('title'));
    res.send(req.param('date'));
});
var port = process.env.PORT || process.env.C9_PORT;
server.listen(port, function() {
    console.log("Listening on " + port);
});
