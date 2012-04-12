var Dao = function (client) {
    /** @private */
    this.client_ = client;
    existsTableAsync('time_attack_events', function (exists) {

    });
};

Dao.getTimeAttackEvent = function (passPhrase) {
    var rows = [];
    var query = this.client_.query('SELECT * FROM time_attack_events WHERE pass_phrase = $1', [passPhrase]);
    query.on('error', function (error) {
        console.log('PG: Error: ' + error.toString());
    });
    query.on('row', function (row) {
        rows.push(row);
    });
    // 最後の行に到達したときの処理
    query.on('end', function (row, error) {
        console.log('PG: End: ' + row.toString() + error.toString());
    });
};

Dao.addTimeAttackEvent = function (passPhrase) {
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

/** @private */
function existsTableAsync(client, tableName, callback) {
    var query = client.query('SHOW TABLE STATUS FROM $1', [tableName]);
    query.on('error', onError);
    var exists = false;
    query.on('row', function (row) {
        exists = true;
    });
    query.on('end', function (row, error) {
        if (exists) {
            throw new Error('attayo');
        }
        console.log('PG: End: ' + row.toString() + error.toString());
        callback(exists);
    });
}

function onError(error) {
    throw new Error('PG: Error: ' + error.toString());
}

exports.Dao = Dao;
