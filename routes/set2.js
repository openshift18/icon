var express = require('express');
var router = express.Router();
var logic = require('../logic/logic')
var db = require('../database/dbScore')
var clustering = require('density-clustering');

router.post('/', function (req, res, next) {
    var rawData = req.body.data
    var rawTime = req.body.time

    db.createSet2(function () {
        db.insertSet2Raw(JSON.stringify(rawData), rawTime, function () {
            res.send({state: true})
        })
    })
})


module.exports = router;
