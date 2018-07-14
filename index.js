 /* jshint esversion: 6 */
var BLT = require("bitcoin-live-transactions")
var bitcoin = new BLT()
var bitmex = require('./bitmex')

// Putting a closure so the base seed is not publicly accessible.
module.exports.HWallet = (() => {
  let BASE_SEED = null;
  const seedCounter = 0;

  class HWallet {
    constructor (seed) {
      BASE_SEED = seed;
      bitcoin.connect();
    },
    newReceive () {
      let address = this.genAddress();
      bitcoin.events.on(this.address,tx => {

        // Remove this listener for memory management
        bitcoin.events.removeListener(this.address, arguments.callee);
      });

    }
    setAmount () {

    }
    address () {
      return this.address
    }
    hedgeHash () {

    }
  }

  return HWallet;
})();
