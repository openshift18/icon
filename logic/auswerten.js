var db = require('../database/dbScore')

var clustering = require('density-clustering');
var kmeans = new clustering.KMEANS();
var optics = new clustering.OPTICS();
var dbscan = new clustering.DBSCAN();

var skmeans = require("skmeans");

module.exports = {

    auswerten: function (callback) {

        db.selectGeldRaw(function (raw, dataTime) {
            var data = []
            var min = []
            var max = []

            //console.log(JSON.parse(raw[1]).length)
            //console.log(time[1])

            // console.log(JSON.parse(raw[0]))

            for (var z = 0; z < raw.length; z++) {


                var rawData = JSON.parse(raw[z])
                var rawTime = dataTime[z]
                var x = []
                var y = []
                var strecke = 0
                var time = 0
                var inputSpeed = 0
                var mouse = 0
                var tab = 0
                for (var i = 0; i < rawData.length; i++) {
                    //Strecke & MoveSpeed
                    if (rawData[i].type == "move") {
                        if (rawData[i].key == "mouse") {
                            mouse++
                            time = time + ( rawData[i].end - rawData[i].start )
                            x = rawData[i].x
                            y = rawData[i].y
                            for (var j = 0; j < x.length - 1; j++) {
                                strecke = strecke + Math.sqrt(Math.pow(Math.abs(x[j]) - Math.abs(x[j + 1]), 2) + Math.pow(Math.abs(y[j]) - Math.abs(y[j + 1]), 2))
                            }
                        } else {
                            tab++
                        }
                    }
                    //Input speed
                    if (rawData[i].type == "input") {
                        if (rawData[i].keyCount > 0) {
                            inputSpeed = inputSpeed + (( rawData[i].end - rawData[i].start ) / rawData[i].keyCount )
                        }
                    }
                }
                var moveSpeed = strecke / time
                //console.log("strecke: " + strecke + " moveSpeed: " + moveSpeed + " inputSpeed: " + inputSpeed + " tab: " + tab + " mouse: " + mouse + " time: " + time)
                //  console.log(strecke + " ; " + moveSpeed + " ; " + inputSpeed + " ; " + tab + " ; " + mouse)


                if (min.length == 0 && max.length == 0) {
                    console.log("length ===== 0")
                    min.push(strecke, moveSpeed, inputSpeed, tab, mouse, rawTime)
                    max.push(strecke, moveSpeed, inputSpeed, tab, mouse, rawTime)
                } else {
                    //min
                    if (min[0] > strecke) {
                        min[0] = strecke
                    }
                    if (min[1] > moveSpeed) {
                        min[1] = moveSpeed
                    }
                    if (min[2] > inputSpeed) {
                        min[2] = inputSpeed
                    }
                    if (min[3] > tab) {
                        min[3] = tab
                    }
                    if (min[4] > mouse) {
                        min[4] = mouse
                    }
                    if (min[5] > rawTime) {
                        min[5] = rawTime
                    }

                    //max
                    if (max[0] < strecke) {
                        max[0] = strecke
                    }
                    if (max[1] < moveSpeed) {
                        max[1] = moveSpeed
                    }
                    if (max[2] < inputSpeed) {
                        max[2] = inputSpeed
                    }
                    if (max[3] < tab) {
                        max[3] = tab
                    }
                    if (max[4] < mouse) {
                        max[4] = mouse
                    }
                    if (max[5] < rawTime) {
                        max[5] = rawTime
                    }
                }

                data.push([strecke, moveSpeed, inputSpeed, tab, mouse, rawTime])
            }



            var normData = []
            var normOutData = []
            for (var i = 0; i < data.length; i++) {
              //  normData.push([((data[i][0] - min[0]) / (max[0] - min[0])), ((data[i][1] - min[1]) / (max[1] - min[1])), ((data[i][2] - min[2]) / (max[2] - min[2])), ((data[i][3] - min[3]) / (max[3] - min[3])), ((data[i][4] - min[4]) / (max[4] - min[4]))])
                normData.push([((data[i][0] - min[0]) / (max[0] - min[0])), ((data[i][1] - min[1]) / (max[1] - min[1])), ((data[i][2] - min[2]) / (max[2] - min[2])), 0, ((data[i][4] - min[4]) / (max[4] - min[4]))])
              //  normOutData.push([Math.round(((data[i][0] - min[0]) / (max[0] - min[0]))*1000)/1000+";"+ Math.round(((data[i][1] - min[1]) / (max[1] - min[1]))*1000)/1000+";"+ Math.round(((data[i][2] - min[2]) / (max[2] - min[2]))*1000)/1000+";"+ Math.round(((data[i][3] - min[3]) / (max[3] - min[3]))*1000)/1000+";"+ Math.round(((data[i][4] - min[4]) / (max[4] - min[4]))*1000)/1000])
                normOutData.push([Math.round(((data[i][0] - min[0]) / (max[0] - min[0]))*1000)/1000+";"+ Math.round(((data[i][1] - min[1]) / (max[1] - min[1]))*1000)/1000+";"+ Math.round(((data[i][2] - min[2]) / (max[2] - min[2]))*1000)/1000+";"+0+";"+ Math.round(((data[i][4] - min[4]) / (max[4] - min[4]))*1000)/1000])
            }
            //  console.log(data)

            //  console.log(max)
            //  console.log(min)
            // console.log(normData)


         /*    var res = skmeans(normData, 4, ["kmpp"], [20000])

            var res = skmeans(normData, 4, [[ 0, 0, 0.2894590972991365, 0, 0.23529411764705882],
                                           [1,0.48869234924517113,0.17801444477695727,0,0.4117647058823529],
                                           [0.3490197434864035,0.37453329620947545,0.03905828199092338,0,0.17647058823529413],
                                            [0.3447312407560549,0.3844999378828552,0.26494284865128725,0.5,0]], [20000])

            console.log(res)
            console.log("################################### CLUSTER 1 #################################")
            console.log(res.idxs)
            for (var i = 0; i < res.idxs.length; i++) {
                if (res.idxs[i] == '0') {
                    console.log(normData[i].toString())
                }
            }
            console.log("################################### CLUSTER 2 #################################")
            for (var i = 0; i < res.idxs.length; i++) {
                if (res.idxs[i] == "1") {
                    console.log(normData[i].toString())
                }
            }
            console.log("################################### CLUSTER 3 #################################")
            for (var i = 0; i < res.idxs.length; i++) {
                if (res.idxs[i] == "2") {
                   console.log(normData[i].toString())
                }
            }
            console.log("################################### CLUSTER 4 #################################")
            for (var i = 0; i < res.idxs.length; i++) {
                if (res.idxs[i] == "3") {
                   console.log(normData[i].toString())
                }
            }
*/


            var clusters = kmeans.run(normData, 4);
            console.log("####################################################################")


            //var clusters = dbscan.run(normData, 0.2, 2);

            //console.log(normData)
            //  var clusters = optics.run(data, 9000, 3);
            //var plot = optics.getReachabilityPlot();
            //console.log(clusters)

            for (var i = 0; i < clusters.length; i++) {
                 console.log('###############################    CLUSTER ' + (i + 1) + " Länge " + clusters[i].length + '      #####################################')
                for (var j = 0; j < clusters[i].length; j++) {
                      console.log(normOutData[clusters[i][j]].toString())
                     //  if (clusters[i][j] == (data.length - 1)) {
                    //    clusternr = i + 1;
                   //  }
                }
            }

            //console.log('###############################    LAST CLUSTER ' + " Länge " + dbscan.noise.length + '      #####################################')
            //for (var i = 0; i < dbscan.noise.length; i++) {
            //    console.log(data[dbscan.noise[i]])
            // }
            //      console.log(dbscan.noise)


            callback();

        })
    }
}


