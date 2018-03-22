function getRandomFloat(min, max) {
    return (Math.random() * (max - min)) + min;
}

function getRandomProfile(profile, scale, bias) {
    for (var i = 0; i < 48; i++) {
        profile[i] = (profile[i] / 100 * scale) * getRandomFloat(0.9, 1.1)  + getRandomFloat(-bias, bias);
    }
    return profile;
}

const wattCost = 4.0;

const http = require('http');

class EnergyChart {
    constructor(bufferSize) {
        this.buffer = {
            values: []
        }

        for (var i = 0; i < bufferSize; i++) {
            this.buffer.values.push(0.0);
        }

        this.options = {
            animation: false,
            responsive: true,
            elements: {
                line: {
                    tension: 0.5
                }
            },
            title: {
                display: true,
                text: ''
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Watts'
                    },

                }]
            }
        };

        this.data = {
            labels: [ 
                " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", 
                " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ",
                " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "
            ],
            datasets: []
        };

        var canvasContext = document.getElementById("generationAndConsumption").getContext("2d");
        this.chart = new Chart(canvasContext, {
            type: 'line',
            data: this.data,
            options: this.options
        });

        this.handlers = [];
    }
    addChart(label, color, handler) {
        this.data.datasets.push({
            label: label,
            backgroundColor: Samples.utils.transparentize(color, 0.9),
            borderColor: Samples.utils.transparentize(color, 0.2),
            data: [ 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0.5, 1, 1.5, 2, 3, 4, 6.5, 9, 12.5, 16
            ],
            borderWidth: 2.0,
            fill: true,
            hidden: false, // hides dataset
            pointRadius: 2,
            pointHoverRadius: 4,
            pointBackgroundColor: Samples.utils.transparentize(color, 0.0)
        });

        this.handlers.push(handler);
    }
    start() {
        var chart = this;

        function getData() {
            for (var i = 0; i < chart.handlers.length; i++) {
                chart.handlers[i](chart.buffer, i);
            }
        }

        function pushData() {
            for (var i = 0; i < chart.data.datasets.length; i++) {
                chart.data.datasets[i].data.push(chart.buffer.values[i]);
                chart.data.datasets[i].data.shift();
            }

            var time = new Date();
            chart.data.labels.push(String(time.getHours()) + ":" + String(time.getMinutes()) + ":" + String(time.getSeconds()));
            chart.data.labels.shift();
        }

        getData();
        chart.chart.update();
        setInterval(function() {
            getData();
            pushData();
            chart.chart.update();
        }, 1000 * 5);
    }
}

const sensorId = 2;
var dayProfilesChart = {
    data: {
        labels: [ 
            "00:--", " ", "01:--", " ", "02:--", " ", "03:--", " ", "04:--", " ", "05:--", " ", 
            "06:--", " ", "07:--", " ", "08:--", " ", "09:--", " ", "10:--", " ", "11:--", " ",
            "12:--", " ", "13:--", " ", "14:--", " ", "15:--", " ", "16:--", " ", "17:--", " ",
            "18:--", " ", "19:--", " ", "20:--", " ", "21:--", " ", "22:--", " ", "23:--", " ",
        ],
        datasets: [{
            label: 'Среднее потребление',
            backgroundColor: Samples.utils.transparentize("orange"),
            borderColor: "orange",
            data: [ 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0  
            ],
            fill: true,
        }, {
            label: 'Генерация завтра',
            backgroundColor: Samples.utils.transparentize("grey"),
            borderColor: "grey",
            data: [ 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0  
            ],
            fill: true,
        }]
    },
    options: {
        animation: false, responsive: true,
        elements: {
            line: {
                tension: 0.5
            }
        },
        title: {
            display: true,
            text: ''
        },
        legend: {
            display: false,
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Watts'
                }
            }]
        }
    },
    start: function() {
        var ctx = document.getElementById("dayProfile").getContext("2d");

        var chart = new Chart(ctx, {
            type: 'line',
            data: this.data,
            options: this.options
        });

        function updateConsumption() {
            dayProfilesChart.data.datasets[0].data = getRandomProfile([
                15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 
                25, 25, 50, 90, 100, 95, 90, 95, 90, 90, 90, 90,
                90, 95, 90, 85, 90, 95, 90, 90, 95, 100, 100, 100, 
                95, 35, 15, 10, 10, 10, 10, 10, 10, 15, 15, 15
            ], 300, 3);
        }

        function updateGeneration() {
            dayProfilesChart.data.datasets[1].data = getRandomProfile([
                100, 100, 100, 100, 100, 100, 100, 100, 100, 110, 120, 130, 
                140, 150, 160, 160, 160, 170, 170, 170, 170, 170, 170, 170, 
                180, 180, 180, 180, 180, 170, 170, 160, 160, 150, 140, 130,  
                120, 110, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100
            ], 200, 10);
        }
        
        updateConsumption();
        updateGeneration();

        chart.update();
        setInterval(function() {
            updateConsumption();
            updateGeneration();
            chart.update();
        }, 1000 * 10);
    },
} 

const $ = require('jquery');

$(document).ready(function() {
    const begin = $('#begin');
    const end = $('#end');

    const energyDiv = document.getElementById('energydiv')
    const energy = document.getElementById('energy');

    energy.addEventListener("input", function() {
        energyDiv.innerHTML = energy.value;
    });

    function requestEnergy() {
        console.log(begin.val() + ' ' + end.val() + ' ' + String(energy.value));
        var string = 'http://127.0.0.1:9000/requestEnergy?begin=' + begin.val() + '&end=' + end.val() + '&energy=' + String(energy.value);
        console.log(string);

        http.get(string, function(resp) {
            var data = '';

            resp.on('data', function(chunk) {
                data += chunk;
            });

            resp.on('end', function() {
                console.log(data);
            });
        });
    }

    const button = document.getElementById('requestButton');
    button.addEventListener("click", requestEnergy);

    var energyChart = new EnergyChart(5);

    function bind(buffer, i) {
        return function(resp) {
            var data = '';

            resp.on('data', function(chunk) {
                data += chunk;
            });

            resp.on('end', function() {
                buffer.values[i] = parseFloat(data);
            });
        }
    }

    energyChart.addChart("Генерация", "blue", function(buffer, i) {
        http.get('http://127.0.0.1:9000/getGenerators', function(resp) {
            var data = '';
            resp.on('data', function(chunk) {
                data += chunk;
            });
            resp.on('end', function() {
                buffer.values[i] = parseFloat(data) * -1;
            });
        });
    });

    energyChart.addChart("Фабрики", "red", function(buffer, i) {
        http.get('http://127.0.0.1:9000/getFactories', bind(buffer, i));
    });

    energyChart.addChart("Домохозяйства", "green", function(buffer, i) {
        http.get('http://127.0.0.1:9000/getHomeholds', bind(buffer, i));
    });

    energyChart.addChart("Недостаток", "orange", function(buffer, i) {
        var generation = buffer.values[0] * -1;
        var ownConsumption = buffer.values[1];
        var othersConsumtion = buffer.values[2];

        var deficiency = generation + ownConsumption + othersConsumtion;
        document.getElementById('deficiency').innerHTML = String(deficiency.toFixed(3)) + ' Ватт*час';
        document.getElementById('wholeExpenses').innerHTML = String((deficiency * wattCost).toFixed(3)) + ' руб.';
        document.getElementById('ownExpenses').innerHTML = String((deficiency * wattCost * ownConsumption / (ownConsumption + othersConsumtion)).toFixed(3)) + ' руб.';

        buffer.values[i] = deficiency;
    });

    energyChart.addChart("Доступно для запроса", "purple", function(buffer, i) {
        http.get('http://127.0.0.1:9000/getAvailable', bind(buffer, i));
    });

    energyChart.start();

    dayProfilesChart.start();
});