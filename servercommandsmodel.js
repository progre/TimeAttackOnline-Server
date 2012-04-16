var ServerCommandsModel = function (dao) {
    /** @private */
    this.dao_ = dao;
};

ServerCommandsModel.prototype.get = function (request, response) {
    tryFunction (response, function () {
        var passPhrase = request.param('pass-phrase');
        if (passPhrase === undefined) {
            response.send(400);
            return;
        }
        var resProc = new ResponseProcessor(response);
        if (this.dao_ === undefined) {
        //            response.send(500);
        //            return;
            var timeAttackEvent = {};
            timeAttackEvent.title = '';
            timeAttackEvent.startTime = new Date();
            resProc.onTimeAttackEventGet(timeAttackEvent);
            return;
        }
        this.dao_.getTimeAttackEventAsync(passPhrase,
            resProc.onTimeAttackEventGet);
    });
};

ServerCommandsModel.prototype.set = function(request, response) {
    tryFunction (response, function () {
        var passPhrase = request.param('pass-phrase');
        var title = request.param('title');
        var startTime = new Date(request.param('start-time'));
        if (passPhrase === undefined ||
            title === undefined ||
            startTime === undefined) {
            response.send(400);
            return;
        }

        // TODO: DB Access

        response.send('success');
    });
};

ServerCommandsModel.prototype.daoTest = function(request, response) {
    tryFunction (response, function () {
        var daotest = require('./daotest');
        new daotest.DaoTest(this.dao_).test(response);
    });
};


var ResponseProcessor = function (response){
    /** @private */
    this.response_ = response;
};

ResponseProcessor.prototype.onTimeAttackEventGet = function (timeAttackEvent) {
    if (timeAttackEvent === null) {
        this.response_.send('failure');
        return;
    }
    this.response_.send(JSON.stringify({
        title:timeAttackEvent.title,
        'start-time':timeAttackEvent.startTime.toString()
    }));
};

function tryFunction(response, callback) {
    try {
        callback();
    } catch (e) {
        response.send(e.toString(), 500);
        return;
    }
}

exports.ServerCommandsModel = ServerCommandsModel;
