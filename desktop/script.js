const http = require('http');

const wattCost = 4.0;

const host = 'http://92.255.206.247:9000/';
//const host = 'http://127.0.0.1:9000/';

function from(method) {
    var uri = host + method;
    if (arguments.length > 1) {
        if (arguments.length % 2 == 1) {
            uri += '?' + arguments[1] + '=' + arguments[2];
            for (i = 3; i < arguments.length; i += 2) {
                uri += '&' + arguments[i] + '=' + String(arguments[i+1]);
            }
        }
    }
    return uri;
}

class RealTimeChart {
    constructor() {
        this.buffer = {
            values: []
        };

        this.data = {
            labels: [ 
                " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", 
                " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ",
                " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "
            ],
            datasets: []
        };

        this.handlers = [];

        var options = {
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
                    },

                }]
            }
        };

        var canvasContext = document.getElementById("generationAndConsumption").getContext("2d");
        this.chart = new Chart(canvasContext, {
            type: 'line',
            data: this.data,
            options: options
        });
    }
    addChart(label, color, handler) {
        this.buffer.values.push(0);
        this.data.datasets.push({
            label: label,
            backgroundColor: Samples.utils.transparentize(color, 0.9),
            borderColor: Samples.utils.transparentize(color, 0.2),
            data: [ 
                NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 
                NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN
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
        }, 1000 * 2);
    }
}

class ProfilesChart {
    constructor() {
        this.data = {
            labels: [ 
                "00:--", " ", "01:--", " ", "02:--", " ", "03:--", " ", "04:--", " ", "05:--", " ", 
                "06:--", " ", "07:--", " ", "08:--", " ", "09:--", " ", "10:--", " ", "11:--", " ",
                "12:--", " ", "13:--", " ", "14:--", " ", "15:--", " ", "16:--", " ", "17:--", " ",
                "18:--", " ", "19:--", " ", "20:--", " ", "21:--", " ", "22:--", " ", "23:--", " ",
            ],
            datasets: []
        };

        this.handlers = [];

        var options = {
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
        };

        var canvasContext = document.getElementById("dayProfile").getContext("2d");
        this.chart = new Chart(canvasContext, {
            type: 'line',
            data: this.data,
            options: options
        });
    }
    addChart(label, color, handler) {
        this.data.datasets.push({
            label: label,
            backgroundColor: Samples.utils.transparentize(color, 0.8),
            borderColor: color,
            data: [ 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0  
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
        function update() {
            for (var i = 0; i < chart.handlers.length; i++) {
                chart.handlers[i](chart.data, i);
            }
        }
        
        update();
        setTimeout(function() {
            chart.chart.update();

            setInterval(function() {
                update();
                chart.chart.update();
            }, 1000 * 6);
        }, 200);
    }
} 

// const $ = require('jquery');

document.addEventListener("DOMContentLoaded", function(event) { 
    const begin = document.getElementById('begin');
    const end = document.getElementById('end');

    const energyDiv = document.getElementById('energydiv')
    const energy = document.getElementById('energy');

    energy.addEventListener("input", function() {
        energyDiv.innerHTML = energy.value;
    });

    function requestEnergy() {
        http.get(from('requestEnergy', 'begin', begin.value, 'end', begin.end, 'energy', energy.value), function(resp) {
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




    var realTimeChart = new RealTimeChart();

    function createReciever(buffer, i) {
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

    realTimeChart.addChart("Генерация", "blue", function(buffer, i) {
        http.get(from('getSensor', 'type', 0), function(resp) {
            var data = '';
            resp.on('data', function(chunk) {
                data += chunk;
            });
            resp.on('end', function() {
                buffer.values[i] = parseFloat(data) * -1;
            });
        });
    });

    realTimeChart.addChart("Фабрики", "green", function(buffer, i) {
        http.get(from('getSensor', 'type', 1), createReciever(buffer, i));
    });

    realTimeChart.addChart("Домохозяйства", "gray", function(buffer, i) {
        http.get(from('getSensor', 'type', 2), createReciever(buffer, i));
    });

    realTimeChart.addChart("Ваше потребление", "orange", function(buffer, i) {
        http.get(from('getSensor', 'id', 1), function(resp) {
            var data = '';
            resp.on('data', function(chunk) {
                data += chunk;
            });
            resp.on('end', function() {
                buffer.values[i] = parseFloat(data);
            });
        });
    });

    realTimeChart.addChart("Недостаток", "red", function(buffer, i) {
        var generation = buffer.values[0] * -1;
        var ownConsumption = buffer.values[1];
        var othersConsumtion = buffer.values[2];

        var deficiency = generation + ownConsumption + othersConsumtion;
        document.getElementById('deficiency').innerHTML = String(deficiency.toFixed(3)) + ' Ватт*час';
        document.getElementById('wholeExpenses').innerHTML = String((deficiency * wattCost).toFixed(3)) + ' руб.';
        document.getElementById('ownExpenses').innerHTML = String((deficiency * wattCost * ownConsumption / (ownConsumption + othersConsumtion)).toFixed(3)) + ' руб.';

        buffer.values[i] = deficiency;
    });

    realTimeChart.addChart("Доступно для запроса", "purple", function(buffer, i) {
        http.get(from('getAvailable'), createReciever(buffer, i));
    });

    realTimeChart.start();















    var profilesChart = new ProfilesChart();

    profilesChart.addChart('Генерация', 'blue', function(chartdata, i) {
        http.get(from('getProfile', 'type', 0), function(resp) {
            var data = '';
            resp.on('data', function(chunk) {
                data += chunk;
            });
            resp.on('end', function() {
                var parsed = JSON.parse(data);
                for (j = 0; j < 48; j++) {
                    chartdata.datasets[i].data[j] = parsed[j] * -1;
                }
            });
        });
    });

    profilesChart.addChart('Фабрики', 'green',function(chartdata, i) {
        http.get(from('getProfile', 'type', 1), function(resp) {
            var data = '';
            resp.on('data', function(chunk) {
                data += chunk;
            });
            resp.on('end', function() {
                var parsed = JSON.parse(data);
                chartdata.datasets[i].data = parsed;
            });
        });
    });

    profilesChart.addChart('Домохозяйства', 'gray', function(chartdata, i) {
        http.get(from('getProfile', 'type', 2), function(resp) {
            var data = '';
            resp.on('data', function(chunk) {
                data += chunk;
            });
            resp.on('end', function() {
                var parsed = JSON.parse(data);
                chartdata.datasets[i].data = parsed;
            });
        });
    });

    profilesChart.addChart("Ваше потребление", "orange", function(chartdata, i) {
        http.get(from('getProfile', 'id', 1), function(resp) {
            var data = '';
            resp.on('data', function(chunk) {
                data += chunk;
            });
            resp.on('end', function() {
                var parsed = JSON.parse(data);
                chartdata.datasets[i].data = parsed;
            });
        });
    });

    profilesChart.addChart('Недостаток', 'red', function(chartdata, i) {
        for (j = 0; j < 48; j++) {
            chartdata.datasets[i].data[j] = chartdata.datasets[0].data[j] - chartdata.datasets[1].data[j] - chartdata.datasets[2].data[j];
        }
    });
    
    profilesChart.addChart('Доступно для запроса', 'purple', function(chartdata, i) {

    });

    profilesChart.start();
});