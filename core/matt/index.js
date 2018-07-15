const hlib = require('./hlib');

var request = require('request');
var crypto = require('crypto');

var apiKey = "bmtmfpw-vromkcpFsHxaEUdg";
var apiSecret = "ouN9KgJ5eIZiXzWtw6-KEy_CGtAbSwKWn_nCRdYqqpVW2ajC";

//fake balance for testing purposes
var fakeBalance = 0.5

var posSize = null;
var apiFetches = [];

/* var price =  hlib.fetchMarkPrice().then(res => {
    console.log("Current price is: ");
    console.log(res)
});

var add =  hlib.fetchDepositAddress().then(res => { 
    console.log("Deposit address is: ");
    console.log(res);
});

var pos = hlib.getPositionSize().then(res => {
    console.log("Position size is: ");
    console.log(res);
}) */

var pos = hlib.getPositionSize();
var price = hlib.fetchMarkPrice();

//var ord = hlib.submitOrder(10);

Promise.all([pos, price]).then( res => {
    console.log("Position size is: ")
    console.log(res[0])
    console.log("Current price is: ")
    console.log(res[1])
    console.log("Short contracts needed to hedge: ")
    var targPos = -1 * (fakeBalance * res[1]);
    console.log(targPos)
    console.log("Contracts to add/remove to be balanced: ")
    var change = -1 * (res[0] - targPos);
    console.log(change)
});






