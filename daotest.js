var DaoTest = function (dao) {
    this.dao_ = dao;
};

DaoTest.prototype.test = function (response) {
    var message = '<p>\nStart dao test-->\n';
    this.dao_.existsTableAsync(this.dao_.client_, "test_table", function (exists) {
        message += 'table exists: ' + exists;
        message += '<--end of dao test</p>';
        response.send(message);
    });
};

exports.DaoTest = DaoTest;
