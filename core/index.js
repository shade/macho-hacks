 /* jshint esversion: 6 */
var BLT = require("bitcoin-live-transactions")
var bitcoinjs = require('bitcoinjs-lib')
var bitmex = require('./bitmex')


// Putting a closure so the base seed is not publicly accessible.
module.exports.HWallet = (() => {
  let BASE_SEED = null;
  let counterSeed = null;
  const seedCounter = 0;

  class HWallet {
    constructor (seed) {
      BASE_SEED = seed;
      counterSeed = seed;

      bitcoin.connect();
    }
    newReceive (amount) {
      let { address } = this.genAddress();

      bitcoin.events.on(this.address, tx => {
        tx.vout.forEach(out => {
          if (out.address === this.address && out.amount === amount) {
            console.info('Wooohoo, payment received');

            // Remove this listener for memory management
            bitcoin.events.removeListener(this.address, arguments.callee);
          }
        })
      });

    }
    setAmount () {

    }
    genAddress () {
      let pk = sha256()
    }
    hedgeHash () {

    }
  }

  return HWallet;
})();
