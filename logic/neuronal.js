var brain = require('brain.js')

var net = new brain.NeuralNetwork({activation: 'sigmoid', hiddenLayers: [2],  iterations: 20000, learningRate: 0.5 });

module.exports =  {
    train: function (data) {
        console.log("train neuronal network")
        net.train(data)
        return
    },
    out: function (data) {
        return net.run(data)
    },
}