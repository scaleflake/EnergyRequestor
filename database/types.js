exports.getRandomProfile = function(type) {
	this.types = [
		{
			profile: [
		         -55,  -55,  -55,  -55,  -55,  -55,  -55,  -55,  -57,  -62,  -66,  -72, 
		         -78,  -85,  -88,  -89,  -92,  -94,  -94,  -94,  -94,  -94,  -94,  -94, 
		        -100, -100, -100, -100, -100,  -94,  -94,  -88,  -88,  -83,  -77,  -72,  
		         -66,  -61,  -55,  -55,  -55,  -55,  -55,  -55,  -55,  -55,  -55,  -55
		    ],
			max: 500.0,
			factor: 0.075
		},
		{
			profile: [
		        15, 15, 15, 15,  15, 15, 15, 15, 15,  15,  20,  20, 
		        25, 25, 50, 90, 100, 95, 90, 95, 90,  90,  90,  90,
		        90, 95, 90, 85,  90, 95, 90, 90, 95, 100, 100, 100, 
		        95, 35, 15, 10,  10, 10, 10, 10, 10,  15,  15,  15      
		    ],
			max: 300.0,
			factor: 0.05
		},
		{
			profile: [
		        30, 20, 10, 10,  10,  10,  10, 12, 15, 23, 35, 45,
		        60, 70, 75, 78,  80,  68,  55, 42, 30, 27, 25, 27,
		        30, 35, 40, 25,  50,  42,  30, 25, 20, 25, 35, 45, 
		        60, 70, 80, 95, 100, 100, 100, 95, 90, 70, 60, 50
		    ],
		    max: 100.0,
		    factor: 0.1
		}
	];

	this.getRandomFloat = function(min, max) {
	    return (Math.random() * (max - min)) + min;
	}

	this.getRandomInt = function(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var profile = this.types[type].profile;
	var max = this.types[type].max;
	var factor = this.types[type].factor;

    for (var i = 0; i < 48; i++) {
        profile[i] = (profile[i] / 100 * max * this.getRandomFloat(1.0 - factor, 1.0 + factor));
    }
    return profile;
}