var Dao = function (client) {
    /* private */
    this.client_ = client;
    initializeTables(client);
};

Dao.prototype.getTimeAttackEventAsync = function (passPhrase, callback) {
    var timeAttackEvent;
    var query = this.client_.query('SELECT * FROM time_attack_events WHERE pass_phrase = $1', [passPhrase]);
    query.on('error', function (error) {
        console.log('PG: Error: ' + error.toString());
    });
    query.on('row', function (row) {
        timeAttackEvent = toTimeAttackEvent(row);
    });
    // 最後の行に到達したときの処理
    query.on('end', function (row, error) {
        console.log('PG: End: ' + row.toString() + error.toString());
        callback(timeAttackEvent);
    });
};

Dao.prototype.addTimeAttackEventAsync = function (passPhrase, callback) {
    var rows = [];
    var query = this.client_.query('SELECT * FROM time_attack_events WHERE pass_phrase = $1', [passPhrase]);
    query.on('error', onError);
    query.on('row', function (row) {
        rows.push(row);
    });
    // 最後の行に到達したときの処理
    query.on('end', function (row, error) {
        console.log('PG: End: ' + row.toString() + error.toString());
    });
};

function toTimeAttackEvent(row) {
    var timeAttackEvent = {};
    timeAttackEvent.passPhrase = row.pass_phrase;
    timeAttackEvent.title = row.title;
    timeAttackEvent.startDate = row.start_date;
    return timeAttackEvent;
}
// Test
var row = {};
row.pass_phrase = 'A';
row.title = 'B';
row.start_date = 'C';
var timeAttackEvent = toTimeAttackEvent(row);
if (row.pass_phrase != timeAttackEvent.passPhrase ||
    row.title != timeAttackEvent.title ||
    row.start_date != timeAttackEvent.startDate) {
    throw new Error();
}
// end of Test

function initializeTables(client) {
    existsTableAsync(client, 'time_attack_events', function (exists) {
        if (!exists)
        {
            createTimeAttackEventsTable(client);
        }
    });
}

function existsTableAsync(client, tableName, callback) {
    var query = client.query('SHOW TABLE STATUS FROM $1', [tableName]);
    query.on('error', onError);
    var exists = false;
    query.on('row', function (row) {
        exists = true;
    });
    query.on('end', function (row, error) {
        console.log('PG: End: ' + row.toString() + error.toString());
        callback(exists);
    });
}

function createTimeAttackEventsTable(client) {
    var query = client.query('CREATE TABLE time_attack_events (' +
        'pass_phrase TEXT primary key, title TEXT, start_date DATETIME)'
    );
    query.on('error', onError);
}

function onError(error) {
    throw new Error('PG: Error: ' + error.toString());
}

exports.Dao = Dao;
