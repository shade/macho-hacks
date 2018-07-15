const hlib = require('./hlib');

var request = require('request');
var crypto = require('crypto');

var apiKey = "bmtmfpw-vromkcpFsHxaEUdg";
var apiSecret = "ouN9KgJ5eIZiXzWtw6-KEy_CGtAbSwKWn_nCRdYqqpVW2ajC";

//Leverage threshold before we send more funds to mex to use as collateral
var threshold = 4;
//Fake balance for testing purposes
var totalBalance = 2;

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

var pos = hlib.fetchPositionSize();
var price = hlib.fetchMarkPrice();
var margin = hlib.fetchLeverage();
let balance = hlib.fetchBalance();

//var ord = hlib.submitOrder(10);

Promise.all([pos, price, margin, balance]).then( res => {
    console.log("Position size is: ")
    console.log(res[0])
    console.log("Current price is: ")
    console.log(res[1])
    console.log("Short contracts needed to hedge: ")
    //Short contracts needed = -1 * (totalBalance * currentPrice) [where totalBalance is denoted in BTC]
    var targPos = -1 * (totalBalance * res[1]);
    console.log(targPos)
    console.log("Contracts to add/remove to be balanced: ")
    //Change in contracts needed to be balanced = -1 * (positionSize - targetPositionSize)
    var change = -1 * (res[0] - targPos);
    console.log(change);
    //Find current effective leverage
    console.log("Effective leverage is: ")
    console.log(res[2])
    //if(res[2] > threshold){ (If our leverage is over our threshold we need to deposit to add collateral)
    if (true) {
        console.log("We need to send funds to decrease leverage!");
        //Calculate how much we need to send to have 2x leverage
        //Our required amount of BTC on mex is half of our total balance if we are using 2x
        let targ = (totalBalance / 2);
        console.log("Total balance required on bitmex to maintain 2x: ");
        console.log(targ);
        console.log("Current balance: ");
        //Convert current balance to BTC from satoshis
        let balance = res[3] / 100000000
        console.log(balance);
        console.log("We need to send: ")
        //(Target amount of btc to have on mex) - (current balance on mex) = amount to send (BTC)
        console.log(targ - balance);
    }
});






