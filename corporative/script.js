function getRandomFloat(min, max) {
    return (Math.random() * (max - min)) + min;
}

function getRandomProfile() {
    var profile = [
        15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 
        25, 25, 50, 90, 100, 95, 90, 95, 90, 90, 90, 90,
        90, 95, 90, 85, 90, 95, 90, 90, 95, 100, 100, 100, 
        95, 35, 15, 10, 10, 10, 10, 10, 10, 15, 15, 15
    ];
    for (var i = 0; i < 48; i++) {
        profile[i] = (profile[i] / 100 * 300) * getRandomFloat(0.9, 1.1)  + getRandomFloat(-3.0, 3.0);
    }
    return profile;
}

const wattCost = 4.0;

const http = require('http');
var generationAndConsumptionChart = {
    data: {
        labels: [ 
            " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", 
            " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ",
            " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "
        ],
        datasets: [{
            label: 'Генерация',
            backgroundColor: Samples.utils.transparentize("blue", 0.7),
            borderColor: "blue",
            data: [ 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 
            ],
            fill: true,
        }, {
            label: 'Фабрика',
            backgroundColor: Samples.utils.transparentize("red", 0.7),
            borderColor: "red",
            data: [ 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 
            ],
            fill: true,
        }, {
            label: 'Домохозяйства',
            backgroundColor: Samples.utils.transparentize("green", 0.7),
            borderColor: "green",
            data: [ 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 
            ],
            fill: true,
        }, {
            label: 'Доступно для запроса',
            backgroundColor: Samples.utils.transparentize("purple", 0.7),
            borderColor: "purple",
            data: [ 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 
            ],
            fill: true,
        }]
    },
    options: {
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
                }
            }]
        }
    },
    ctx: null,
    generation: 0.0,
    ownConsumption: 0.0,
    othersConsumtion: 0.0,
    initialize: function() {
        this.ctx = document.getElementById("generationAndConsumption").getContext("2d");

        function updateData() {
            http.get('http://127.0.0.1:9000/getGenerators', function(resp) {
                var data = '';

                resp.on('data', function(chunk) {
                    data += chunk;
                });

                resp.on('end', function() {
                    generationAndConsumptionChart.generation = parseFloat(data);
                    generationAndConsumptionChart.data.datasets[0].data.push(parseFloat(data) * (-1.0));
                    generationAndConsumptionChart.data.datasets[0].data.shift();
                });
            });

            http.get('http://127.0.0.1:9000/getFactories', function(resp) {
                var data = '';

                resp.on('data', function(chunk) {
                    data += chunk;
                });

                resp.on('end', function() {
                    generationAndConsumptionChart.ownConsumption = parseFloat(data);
                    generationAndConsumptionChart.data.datasets[1].data.push(parseFloat(data));
                    generationAndConsumptionChart.data.datasets[1].data.shift();
                });
            });
            
            http.get('http://127.0.0.1:9000/getHomeholds', function(resp) {
                var data = '';

                resp.on('data', function(chunk) {
                    data += chunk;
                });

                resp.on('end', function() {
                    generationAndConsumptionChart.othersConsumtion = parseFloat(data);
                    generationAndConsumptionChart.data.datasets[2].data.push(parseFloat(data));
                    generationAndConsumptionChart.data.datasets[2].data.shift();
                });
            });

            http.get('http://127.0.0.1:9000/getAvailable', function(resp) {
                var data = '';

                resp.on('data', function(chunk) {
                    data += chunk;
                });

                resp.on('end', function() {
                    generationAndConsumptionChart.data.datasets[3].data.push(parseFloat(data));
                    generationAndConsumptionChart.data.datasets[3].data.shift();
                });
            });

            var time = new Date();
            generationAndConsumptionChart.data.labels.push(String(time.getHours()) + ":" + String(time.getMinutes()) + ":" + String(time.getSeconds()));
            generationAndConsumptionChart.data.labels.shift();

            var deficiency = generationAndConsumptionChart.generation +
                             generationAndConsumptionChart.ownConsumption +
                             generationAndConsumptionChart.othersConsumtion;
            document.getElementById('deficiency').innerHTML = String(deficiency.toFixed(3)) + ' Ватт*час';
            document.getElementById('wholeExpenses').innerHTML = String((deficiency * wattCost).toFixed(3)) + ' руб.';
            document.getElementById('ownExpenses').innerHTML = String((deficiency * wattCost * generationAndConsumptionChart.ownConsumption / 
                (generationAndConsumptionChart.ownConsumption + generationAndConsumptionChart.othersConsumtion)).toFixed(3)) + ' руб.';
        }

        function drawChart() {
            var chart = {
                type: 'line',
                data: generationAndConsumptionChart.data,
                options: generationAndConsumptionChart.options
            };
            window.myLine = new Chart(generationAndConsumptionChart.ctx, chart);
        }

        updateData();
        drawChart();
        setInterval(function() {
            updateData();
            drawChart();
        }, 1000 * 5);
    },
    addChart: function() {

    }
};

const sensorId = 2;
var dayProfileChart = {
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
    ctx: null,
    initialize: function() {
        this.ctx = document.getElementById("dayProfile").getContext("2d");

        function updateProfile() {
            function calculateProfile() {
                var profile = getRandomProfile();
                return profile;
            }
            dayProfileChart.data.datasets[0].data = getRandomProfile();
        }

        function drawChart() {
            chart = {
                type: 'line',
                data: dayProfileChart.data,
                options: dayProfileChart.options
            };
            window.myLine = new Chart(dayProfileChart.ctx, chart);
        }

        updateProfile();
        drawChart();
        setInterval(function() {
            updateProfile();
            drawChart();
        }, 1000 * 10);
    },
} 

const $ = require('jquery');

$(document).ready(function() {
    const begin = $('#begin');
    const end = $('#end');
    const energy = $('#energy');

    function requestEnergy() {
        console.log(begin.val() + ' ' + end.val() + ' ' + String(energy.val()));
        var string = 'http://127.0.0.1:9000/requestEnergy?begin=' + begin.val() + '&end=' + end.val() + '&energy=' + String(energy.val());
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

    var ctx = document.getElementById("generationAndConsumption").getContext("2d");

    generationAndConsumptionChart.initialize();
    dayProfileChart.initialize();
});