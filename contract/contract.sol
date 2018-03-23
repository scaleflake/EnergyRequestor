pragma solidity ^0.4.18;

contract EnergyRequestor { 
    address admin;

    int switchFine;
    int downtimeFine;

    function EnergyRequestor() public {
        admin = msg.sender;

        switchFine = 100;
        downtimeFine = 5;
    }

    mapping (uint => bool) participants;
    function participate(uint id) public {
        balances[id] -= switchFine;
        participants[id] = true;
    }

    function unparticipate(uint id) public {
        balances[id] -= switchFine;
        participants[id] = false;
    }

    function isParticipant(uint id) public constant returns(bool) {
        return participants[id];
    }

    mapping (uint => int) balances;
    function pay(uint id, int watts) public {
        if (msg.sender == admin) {
            balances[id] += watts;
        }
    }
    function fine(uint id) public {
        if (msg.sender == admin) {
            balances[id] -= downtimeFine;
        } 
    }
    function getBalance(uint id) public constant returns(int balance){
        return balances[id];
    }

    function addUser(uint id) public {
        participants[id] = false;
        balances[id] = 50;
    }

    function getTime() public constant returns(uint time) {
        return now;
    }
}