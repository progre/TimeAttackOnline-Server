function ServerCommandsModel(dao) {
    /** @private */
    this.dao_ = dao;
}

ServerCommandsModel.prototype.get = function (request, response) {
    var self = this;
    tryFunction (response, function () {
        var passPhrase = request.param('pass-phrase');
        if (passPhrase === undefined) {
            response.send(400);
            return;
        }
        self.dao_.getTimeAttackEventAsync(passPhrase, function (timeAttackEvent) {
            if (timeAttackEvent === null) {
                response.send(JSON.stringify({result: "failure"}));
                return;
            }
            response.send(JSON.stringify(
                {
                    result: "success",
                    title: timeAttackEvent.title,
                    "start-date": timeAttackEvent.startDate
                }
            ));
        });
    });
};

ServerCommandsModel.prototype.add = function(request, response) {
    var self = this;
    tryFunction (response, function () {
        var passPhrase = request.param('pass-phrase');
        var title = request.param('title');
        var startDate = new Date(request.param('start-date'));
        console.log('start-date: ' + startDate.toString());
        if (passPhrase === undefined ||
            title === undefined ||
            startDate === undefined) {
            response.send(400);
            return;
        }
        if (passPhrase.length < 6) {
            response.send(400);
        }
        var timeAttackEvent = {};
        timeAttackEvent.title = title;
        timeAttackEvent.startDate = startDate;
        self.dao_.addTimeAttackEventAsync(passPhrase, timeAttackEvent, function (success) {
            if (!success) {
                response.send('failure');
            }
            response.send('success');
        });
    });
};

ServerCommandsModel.prototype.daoTest = function(request, response) {
    var self = this;
    tryFunction (response, function () {
        if (self.dao_ === undefined || self.dao_.client_ === undefined) {
            throw new Error();
        }
        var daotest = require('./daotest');
        new daotest.DaoTest(self.dao_).test(response);
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
        response.send(e.stackTrace, 500);
        return;
    }
}

exports.ServerCommandsModel = ServerCommandsModel;
