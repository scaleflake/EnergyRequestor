const net = require('net');

const GENERATOR = 0;
const FACTORY = 1
const HOUSEHOLD = 2;

class Sensor {
	constructor(id, type) {
		this.id = id;
		this.type = type;

		this.active = true;
		this.consumption = 90;

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
			sensor.consumption = sensor.input.value;
			console.log(sensor.consumption);
		}
		this.input = document.getElementById('i' + String(id));
		this.input.addEventListener("change", changeConsumption.bind(null, this));

		this.client = new net.Socket();
		this.client.connect(8000, '127.0.0.1', function() {
		    console.log('Connected');
		});
		this.client.on('close', function() {
		    console.log('Connection closed');
		});	
	}
	update() {
		if (this.active) {
			var usedEnergy;
			if (this.type === GENERATOR) {
				usedEnergy = getRandomFloat(-500.0, -400.0);
			} else if (this.type === FACTORY) {
				usedEnergy = getRandomFloat(300.0, 350.0);
			} else {
				usedEnergy = getRandomFloat(60.0, 70.0);
			}			
			usedEnergy *= this.consumption / 100.0;
			var data = JSON.stringify({ 'type': this.type, 'id': this.id, 'energy': usedEnergy })
			this.client.write(data);
			console.log(data);

			this.div.innerHTML = usedEnergy.toFixed(3) + ' watt\n<br>\n' + this.consumption + '%';
		}
	}
}



var sensors = [];
sensors.push(new Sensor(0, GENERATOR));
sensors.push(new Sensor(1, FACTORY));
sensors.push(new Sensor(2, HOUSEHOLD));
sensors.push(new Sensor(3, HOUSEHOLD));
sensors.push(new Sensor(4, HOUSEHOLD));
sensors.push(new Sensor(5, HOUSEHOLD));

setInterval(function() {
	for (i = 0; i < sensors.length; i++) {
		sensors[i].update();
	}
}, 5000);

function getRandomFloat(min, max) {
	return (Math.random() * (max - min)) + min;
}

