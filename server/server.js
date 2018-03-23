//{ different
    function getRandomFloat(min, max) {
        return (Math.random() * (max - min)) + min;
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
//} ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

//{ eth
    const fs = require('fs');
    const Web3 = require('web3');

    const web3 = new Web3('http://localhost:8545');

    var mainAccount = '';
    web3.eth.getAccounts(function(error, result) {
        if (error != null) {
            console.log("Couldn't get accounts");
        }
        mainAccount = result[0];
        console.log('Main account:');
        console.log(mainAccount);
        console.log('');
    });

    const interface = require('./../contract/interface.json');
    const address = require('./../contract/address.json');
    const instance = new web3.eth.Contract(interface, address);

    instance.methods.getTime().call().then(function(output) {
        // console.log('isParticipant(' + id + ')');
        console.log('TIME: ' + output);
    });

    function participate(id) {
        instance.methods.participate(id).send({from: mainAccount}, function(error, transactionHash) {
            if (error !== null) {
                console.log('fine(' + id + ') - ERROR');
            }
            // console.log('participate(' + id + ')');
        });
    }
    function unparticipate(id) {
        instance.methods.unparticipate(id).send({from: mainAccount}, function(error, transactionHash) {
            if (error !== null) {
                console.log('fine(' + id + ') - ERROR');
            }
            // console.log('unparticipate(' + id + ')');
        });
    }
    function isParticipant(id, callbackfunc) {
        instance.methods.isParticipant(id).call().then(function(output) {
            // console.log('isParticipant(' + id + ')');
            callbackfunc(output);
        });
    }
    function pay(id, watts) {
        instance.methods.pay(id, watts).send({from: mainAccount}, function(error, transactionHash) {
            if (error !== null) {
                console.log('fine(' + id + ') - ERROR');
            }
            // console.log('pay(' + id + ')');
        });
    }
    function fine(id) {
        instance.methods.fine(id).send({from: mainAccount}, function(error, transactionHash) {
            if (error !== null) {
                console.log('fine(' + id + ') - ERROR');
            }
            // console.log('fine(' + id + ')');
        });
    }
    function getBalance(id, callbackfunc) {
        instance.methods.getBalance(id).call().then(function(output) {
            // console.log('getBalance(' + id + ')');
            callbackfunc(output);
        });
    }
    function addUser(id) {
        instance.methods.addUser(id).send({from: mainAccount}, function(error, transactionHash) { 
            if (error !== null) {
                console.log('fine(' + id + ') - ERROR');
            }
            // console.log('addUser(' + id + ')');
        });
    }
//} ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

//{ database
    const GENERATOR = 0;
    const FACTORY = 1
    const HOUSEHOLD = 2;

    var profileGenerator = require('./../database/types.js')

    class Sensor {
        constructor(id, type) {
            this.id = id;
            this.type = type;

            this.current = 0;
            this.active = false;
            
            this.buffer = 0;
            this.profile = profileGenerator.getRandomProfile(type);

            addUser(id);
        }
    }

    var sensors = [];
    sensors.push(new Sensor(0, GENERATOR));
    sensors.push(new Sensor(1, FACTORY));
    sensors.push(new Sensor(2, HOUSEHOLD));
    sensors.push(new Sensor(3, HOUSEHOLD));
    sensors.push(new Sensor(4, HOUSEHOLD));
    sensors.push(new Sensor(5, HOUSEHOLD));
    console.log('');

    function callback(i, output) {
        sensors[i].active = output;
    }

    // updating participaition
    setInterval(function() {
        function isPart(id, callback) {
            instance.methods.isParticipant(id).call().then(function(output) {
                callback(id, output);
            });
        }
        for (i = 0; i < sensors.length; i++) {
            isPart(sensors[i].id, callback);
        }
    }, 1000 * 5);

    // var currentHour = (new Date()).getHours();
    // setInterval(function() {
    //     currentHour = (new Date()).getHours();
    // }, 1000 * 60);

    // setInterval(function() {
    //     for (i = 0; i < sensors.length; i++) {
    //         sensors[i].profile = profileGenerator.getRandomProfile(sensors[i].type);
    //     }
    // }, 1000 * 15);

    // time ticking
    var currentHour = 0;
    setInterval(function() {
        for (i = 0; i < sensors.length; i++) {
            sensors[i].profile[currentHour] = (sensors[i].profile[currentHour] * 0.9 + sensors[i].buffer) / 1.9;
            sensors[i].buffer = 0;
        }
        if (currentHour == 47) {
            currentHour = 0;
        } else {
            currentHour += 1;
        }
    }, 1000 * 6);

    function getEnergyByType(type) {
        var energy = 0;
        for (i = 0; i < sensors.length; i++) {
            if (sensors[i].type === type) {
                energy += sensors[i].current;
            }
        }
        return energy;
    }

    function getProfileByType(type) {
        var profile = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        for (i = 0; i < sensors.length; i++) {
            if (sensors[i].type == type) {
                for (j = 0; j < 48; j++) {
                    profile[j] += sensors[i].profile[j];
                }
            }
        }
        return profile;
    }

    function getEnergyById(id) {
        for (i = 0; i < sensors.length; i++) {
            if (sensors[i].id == id) {
                return sensors[i].current;
            }
        }
    }

    function getProfileById(id) {
        var profile = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        for (i = 0; i < sensors.length; i++) {
            if (sensors[i].id == id) {
                for (j = 0; j < 48; j++) {
                    profile[j] += sensors[i].profile[j];
                }
            }
        }
        return profile;
    }

    function processData(id, type, energy) {
        sensors[id].buffer += energy;
        sensors[id].current = energy;
        isParticipant(id, function(output) {
            if (output) {
                var profileValue = sensors[id].profile[currentHour];
                console.log(profileValue + ' vs ' + energy);
                if (profileValue * 0.6 > energy) {
                    console.log(profileValue - energy);
                    var watts = Math.floor(profileValue - energy)
                    console.log(watts);
                    pay(id, watts);
                } else {
                    var keys = Object.keys(users);
                    for (i = 0; i < keys.length; i++) {
                        if (users[keys[i]] === id) {
                            bot.sendMessage(keys[i], 'You got a fine!');
                        }
                    }
                    fine(id);
                }
            }
        });
    }
//} ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

//{ tcp
    const net = require('net');
    const tcpServer = net.createServer(function(sock) {
        console.log('Connected: ' + sock.remoteAddress + ':' + sock.remotePort);

        sock.on('data', function(data) {
        	var parsed = JSON.parse(data);
            processData(parsed['id'], parsed['type'], parsed['energy']);
        });

        sock.on('close', function(data) {
            console.log('Disconnected: ' + sock.remoteAddress + ':' + sock.remotePort);
        });
    });
    tcpServer.listen(8000, '127.0.0.1');
    console.log('TCP server started');
    console.log('');
//} ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

//{ bot and express
    process.env["NTBA_FIX_319"] = 1;

    const telebot = require('node-telegram-bot-api');

    const token = '530388368:AAGbKg9YarKBBPmrzhByZSPkOGQzVfbhUXU';
    const bot = new telebot(token, { polling: true });

    users = require('./../database/users.json');
    console.log('Telegram-bot started')
    console.log(users);
    console.log('');

    bot.on('message', function(msg) {
        if (msg.text === '/start') {
            bot.sendMessage(msg.chat.id, 'Please enter sensor ID:');
            users[msg.chat.id] = 0;
        } else {
            if (users[msg.chat.id] === 0) {
                users[msg.chat.id] = parseInt(msg.text);
                fs.writeFileSync('./../database/users.json', JSON.stringify(users, null, 4), 'utf-8');
                bot.sendMessage(msg.chat.id, 'ID: ' + String(users[msg.chat.id]), {
                "reply_markup": {
                    "keyboard": [["Balance", "Profile"],   ["Participate", "I'm participant?", "Unparticipate"]]
                    }
                });
            } else {
                if (msg.text === 'Balance') {
                    getBalance(users[msg.chat.id], function(output) {
                        bot.sendMessage(msg.chat.id, String(output) + ' points');
                    });
                } else if (msg.text === 'Participate') {
                    participate(users[msg.chat.id]);
                    setTimeout(function() {
                        isParticipant(users[msg.chat.id], function(output) {
                            bot.sendMessage(msg.chat.id, 'Participation: ' + String(output));      
                        });
                    }, 400);
                } else if (msg.text === 'Unparticipate') {
                    unparticipate(users[msg.chat.id]);
                    setTimeout(function() {
                        isParticipant(users[msg.chat.id], function(output) {
                            bot.sendMessage(msg.chat.id, 'Participation: ' + String(output));      
                        });
                    }, 400);
                } else if (msg.text === "I'm participant?") {
                    isParticipant(users[msg.chat.id], function(output) {
                        bot.sendMessage(msg.chat.id, 'Participation: ' + String(output));      
                    });
                } else if (msg.text === 'Profile') {
                    var string = 'Load profile:\n';
                    var profile = sensors[users[msg.chat.id]].profile;
                    for (i = 0; i < profile.length; i++) {
                        string += String(i) + ':00 - ' + profile[i].toFixed(3) + '\n';
                    }
                    bot.sendMessage(msg.chat.id, string);
                } else if (msg.text === '{unpart') {
                    for (i = 0; i < sensors.length; i++) {
                        unparticipate(i);
                    }
                } else if (msg.text === '{balances') {
                    function a(i) {
                        i--;
                        if (i !== -1) {
                            getBalance(i, function(output) {
                                bot.sendMessage(msg.chat.id, 'Balance ' + String(i) + ": " + String(output));      
                            });
                            a(i);
                        }
                    }
                    a(6)
                } else if (msg.text === '{parts') {
                    function a(i) {
                        i--;
                        if (i !== -1) {
                            isParticipant(i, function(output) {
                                bot.sendMessage(msg.chat.id, 'User ' + String(i) + ": " + String(output));      
                            });
                            a(i);
                        }
                    }
                    a(6)
                } else {
                    bot.sendMessage(msg.chat.id, 'ERROR');
                }
            }
        }
    });

    const express = require('express');
    const httpServer = express();

    httpServer.get('/getSensor', function(req, res) {
        if (req.query.type !== undefined) {
            var string = String(getEnergyByType(parseInt(req.query.type)))
            res.send(string);
        } else if (req.query.id !== undefined) {
            res.send(String(getEnergyById(parseInt(req.query.id))));
        }
    });

    httpServer.get('/getAvailable', function(req, res) {
        var energy = 0.0;
        for (i = 0; i < sensors.length; i++) {
            sensor = sensors[i];
            if (sensor.active){
                energy += sensor.profile[currentHour];
            }
        }
        res.send(String(energy));
    });

    httpServer.get('/getProfile', function(req, res) {
        if (req.query.type != undefined) {
            res.send(JSON.stringify(getProfileByType(parseInt(req.query.type))));
        } else if (req.query.id != undefined) {
            res.send(JSON.stringify(getProfileById(parseInt(req.query.id))));
        }
    });

    httpServer.get('/requestEnergy', function(req, res) {
        var string = 'Request from the company:\n' +
                     '```\n' + 
                     'Begining: ' + req.query.begin + '\n' + 
                     'Ending:   ' + req.query.end   + '\n' + 
                     'Watts:    ' + req.query.energy + '```';

        console.log(string);
        var keys = Object.keys(users);
        for (i = 0; i < keys.length; i++) {
            bot.sendMessage(keys[i], string, { parse_mode: 'Markdown' });
        }
        res.send('success');
    });

    httpServer.listen(9000);
    console.log('HTTP server started');
    console.log('');
//} ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄