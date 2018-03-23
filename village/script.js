const net = require('net');

const GENERATOR = 0;
const FACTORY = 1
const HOUSEHOLD = 2;

// var currentHour = (new Date()).getHours();
// setInterval(function() {
//     currentHour = (new Date()).getHours();
// }, 1000 * 60);

const ip = '92.255.206.247';

var currentHour = 40;
var div = document.getElementById('day');
var input = document.getElementById('iday');
input.addEventListener('input', function() {
	div.innerHTML = String(input.value);
	currentHour = input.value * 2.0;
});

const http = require('http');




function setTime(time) {
	http.get('http://92.255.206.247:9000/setTime?time=' + time, function(resp) {
	    var data = '';
	    resp.on('data', function(chunk) {
	        data += chunk;
	    });
	    resp.on('end', function() {
			// console.log(data);
	    });
	});
}

setInterval(function() {
	if (currentHour != 47) {
		currentHour += 1;
		div.innerHTML = String(currentHour / 2);
		input.value = currentHour / 2;
	} else {
		currentHour = 0;
		div.innerHTML = String(currentHour / 2);
		input.value = currentHour / 2;
	}
	setTime(currentHour);
}, 1500);

const profilesGenerator = require('./../database/types.js');

class Sensor {
	constructor(id, type) {
		this.id = id;
		this.type = type;

		this.active = true;
		this.consumption = 0.9;

		this.profile = profilesGenerator.getRandomProfile(type);
		//this.currentRate = this.profile[currentHour];

		function switchState(sensor) {
			if (sensor.active) {
				sensor.active = false;
				sensor.div.style.backgroundColor = "lightgray";
			} else {
				sensor.active = true;
				sensor.div.style.backgroundColor = "#FFDA73";
			}
		}
		this.div = document.getElementById(String(id));
		this.div.addEventListener("click", switchState.bind(null, this));

		function changeConsumption(sensor) {
			sensor.consumption = parseFloat(sensor.input.value) / 100.0;
			console.log(sensor.consumption);
		}

		this.input = document.getElementById('i' + String(id));
		this.input.addEventListener("input", changeConsumption.bind(null, this));

		this.client = new net.Socket();
		this.client.connect(8000, ip, function() {
		    console.log('Connected');
		});
		this.client.on('close', function() {
		    console.log('Connection closed');
		});	
	}
	start() {
		var sensor = this;
		setInterval(function() {
			if (sensor.active) {
				var usedEnergy = sensor.profile[currentHour] * getRandomFloat(0.9, 1.1) * sensor.consumption;
				var data = JSON.stringify({ 'type': sensor.type, 'id': sensor.id, 'energy': usedEnergy })
				sensor.client.write(data);
				sensor.div.innerHTML = usedEnergy.toFixed(3) + ' watt\n<br>\n' + sensor.consumption * 100 + '%';
			}
		}, 500);
		setInterval(function() {
			sensor.profile = profilesGenerator.getRandomProfile(sensor.type);
		}, 36000);
	}
}



var sensors = [];
sensors.push(new Sensor(0, GENERATOR));
sensors.push(new Sensor(1, FACTORY));
sensors.push(new Sensor(2, HOUSEHOLD));
sensors.push(new Sensor(3, HOUSEHOLD));
sensors.push(new Sensor(4, HOUSEHOLD));
sensors.push(new Sensor(5, HOUSEHOLD));

for (i = 0; i < sensors.length; i++) {
	sensors[i].start();
}

function getRandomFloat(min, max) {
	return (Math.random() * (max - min)) + min;
}

