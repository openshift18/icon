var sqlite3 = require('sqlite3').verbose();
var dbNeuronal = new sqlite3.Database('./database/neuronal.db');


var selectNeuronal = function (callback) {
    var input = []
    var output = []
    dbNeuronal.serialize(() => {
        var sql = 'SELECT * FROM neuronal';
        dbNeuronal.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
               input.push([row.time, row.click])
            });

            var sql = 'SELECT * FROM result';
            dbNeuronal.all(sql, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                   output.push([row.output])
                });
                callback(input, output)
            })
        })
    })
}

var insertNeuronal = function (data, callback) {
    var time = Math.round(data.time)/10000
    var click = Math.round(data.click)/10000
    var stmt = dbNeuronal.prepare("INSERT INTO neuronal VALUES (?,?)");
    stmt.run(time, click);
    stmt.finalize();

    var stmt = dbNeuronal.prepare("INSERT INTO result VALUES (?)");
    stmt.run(data.result);
    stmt.finalize();

    callback();
}


module.exports =  {
    selectNeuronal: function (callback) {
        selectNeuronal(function (input, output) {

            const trainData = input.map((input,index) => {
                return {
                    input: input,
                    output: output[index]
                }
            });
            callback(trainData)
        })
    },
    insertNeuronal: function (data, callback) {
        insertNeuronal(data, function () {
            callback()
        })
    },
}