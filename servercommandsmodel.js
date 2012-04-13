var ServerCommandsModel = function (dao) {
    /** @private */
    this.dao_ = dao;
};

ServerCommandsModel.prototype.get = function (request, response) {
    try {
        var passPhrase = request.param('pass-phrase');
        if (passPhrase === undefined) {
            response.send(400);
            return;
        }
        if (this.dao_ === undefined) {
//            response.send(500);
//            return;
            var timeAttackEvent = {};
            timeAttackEvent.title = '';
            timeAttackEvent.startTime = new Date();
            new ResponseProcessor(response).onTimeAttackEventGet(timeAttackEvent);
            return;
        } else {
            this.dao_.getTimeAttackEventAsync(passPhrase,
                new ResponseProcessor(response).onTimeAttackEventGet);
            return;
        }
    } catch (e) {
        response.send(e.toString(), 500);
        return;
    }
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

exports.ServerCommandsModel = ServerCommandsModel;
