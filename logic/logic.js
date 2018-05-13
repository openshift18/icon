module.exports =  {

    score: function (elements, data) {
        var pt = 0.00
        var points = []
        var skip = 0
        var cnt = elements
        var strecke = 0
        var time = 0

        var x = []
        var y = []

        function include(id, callback) {
            var result = { state: false, index: 0}
            for(var i = 0; i < points.length; i++) {
                if (points[i].id == id) {
                    result.state = true
                    result.index = i
                    break;
                }
            }
            callback(result)
        }


        for(var i = 0; i<data.length; i++) {
            if(data[i].type == "move" ){
                x = data[i].x
                y = data[i].y
                for (var j = 0; j < x.length - 1; j++) {
                    strecke = strecke + Math.sqrt(Math.pow(Math.abs(x[j]) - Math.abs(x[j + 1]), 2) + Math.pow(Math.abs(y[j]) - Math.abs(y[j + 1]), 2))
                }
                time = time + data[i].end - data[i].start
            }

            if( data[i].type == "input" ) {
                if(data[i].keyCount != 0) {
                    //console.log(strecke, time)
                   // pt = data[i].id  + (time/1000) + (strecke/1000)



                    //pt = data.length - i + ( data[i].skip * 0.4 * data[i].time / 10000  )

                    include(data[i].id, function (result) {
                        if (result.state == false) {
                            pt = cnt  + (time/1000) + (strecke/1000)
                            time = strecke = 0
                            //points.push({id: data[i].id, points: pt})
                            points.push({id: data[i].id, points: pt})
                            cnt--
                        } else {
                            points[result.index].points = points[result.index].points + (time/1000)
                            time = strecke = 0
                        }
                    })
                }
            }
        }
        return points
    }
}

