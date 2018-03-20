var Tools = {
	getCookie: function(name) {
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	},
	setCookie: function(name, value, options) {
		options = options || {};
		var expires = options.expires;
		if (typeof expires == "number" && expires) {
			var d = new Date();
			d.setTime(d.getTime() + expires * 1000);
			expires = options.expires = d;
		}
		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}
		value = encodeURIComponent(value);
		var updatedCookie = name + "=" + value;
		for (var propName in options) {
			updatedCookie += "; " + propName;
			var propValue = options[propName];
			if (propValue !== true) {
				updatedCookie += "=" + propValue;
			}
		}
		document.cookie = updatedCookie;
	},
	delCookie: function(name) {
		this.setCookie(name, "", {
			expires: -1
		});
	},
	getParam: function(name) {
		// *GET* param
		if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
			return decodeURIComponent(name[1]);
	},
	floatToStrRusPrice: function(price) {
		// 124900.73 --> 124900 руб. 73 коп.
		// dollars.toLocaleString("en-US", {style:"currency", currency:"USD"}); // 16.29 --> "$16.29"
		if(price.toString().indexOf('.') > -1)
			return price.toString().substr(0, price.toString().length-3) + " руб. " + price.toString().substr(price.toString().length-2, price.toString().length) + " коп.";
		else {
			price = price.toString() + ".00";
			return price.toString().substr(0, price.toString().length-3) + " руб. " + price.toString().substr(price.toString().length-2, price.toString().length) + " коп.";
		}
	},
	strRusPriceToFloat: function(price) {
		// 124900 руб. 73 коп. --> 124900.73
		return price.replace(" коп.", "").replace(" руб. ", ".");
	},
	fixFloatPrice: function(price) {
		price = price.toString();
		if((price.length - price.indexOf(".")) == 2) {
			console.log("fix1");
			price = price + "0";
		} else if((price.length - price.indexOf(".")) == 1) {
			console.log("fix2");
			price = price + "00";
		} else if((price.indexOf(".") == -1) && (price.indexOf(",") == -1)) {
			console.log("fix4");
			price = price + ".00";
		}
		console.log(price);
		return parseFloat(price).toFixed(2);
	},
	getCurrentDate: function() {
		var currentDate = new Date().toJSON().slice(0,10);//.replace(/-/g,'/');
		return currentDate;
	},
	randomHash: function(hashLength) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < hashLength; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	},
	randomNumber: function(min, max) {
		var rand = min + Math.random() * (max + 1 - min);
		rand = Math.floor(rand);
		return rand;
	},
	remove000WebHostAdvert: function() {
		$("a").each(function() {
			if(this.target == "_blank") {
				this.remove();
			}
		});
	},
}