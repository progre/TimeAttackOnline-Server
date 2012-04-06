var express = require('express');
var server = express.createServer();
server.get('/add', function(req, res) {
    res.send('add command');
});
var port = process.env.PORT || process.env.C9_PORT;
server.listen(port, function() {
    console.log("Listening on " + port);
});
