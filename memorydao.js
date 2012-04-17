var MemoryDao = function () {
};

MemoryDao.prototype.getTimeAttackEventAsync = function (passPhrase, callback) {
    if (!(passPhrase in db.timeAttackEvents)) {
        return callback(null);
    }
    return callback(db.timeAttackEvents[passPhrase]);
};

MemoryDao.prototype.addTimeAttackEventAsync = function (passPhrase, timeAttackEvent, callback) {
    if (passPhrase in db.timeAttackEvents) {
        return callback(false);
    }
    db.timeAttackEvents[passPhrase] = timeAttackEvent;
    return callback(true);
};

var db = {};
db.timeAttackEvents = {};

exports.MemoryDao = MemoryDao;
