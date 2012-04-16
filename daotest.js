var DaoTest = function (dao) {
    this.dao_ = dao;
};

DaoTest.prototype.test = function (response) {
    var message = 'Start dao test-->\n';
    message += '<--end of dao test';
    response.send(message);
};

exports.DaoTest = DaoTest;
