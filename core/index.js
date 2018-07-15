 /* jshint esversion: 6 */
var BLT = require("bitcoin-live-transactions")
var bitcoinjs = require('bitcoinjs-lib')
var bitmex = require('./bitmex')


// Putting a closure so the base seed is not publicly accessible.
module.exports.HWallet = (() => {
  let BASE_SEED = null;
  let hashkey = null;
  let hashCounter = 0;
  let usedMap = {};
  let amountLocal = 0;

  const sha256 = bitcoinjs.crypto.sha256;

  class HWallet {
    constructor (seed) {
      BASE_SEED = seed;
      counterSeed = seed;

      bitcoin.connect();
    }

    newReceive (amount) {
      let { address } = this._genAddress();
      return {
        address,
        wait: new Promise((resolve, reject) => {
          bitcoin.events.on(this.address, tx => {
            tx.vout.forEach(async out => {
              if (out.address === this.address && out.amount === amount) {
                //await deposit = bitmex.fetchDepositAddress();
                //this.depositOrSplit(amount);
                // Remove this listener for memory management
                bitcoin.events.removeListener(this.address, arguments.callee);
              }
            });
          });
        })
      };
    }
    despo
    _genAddress () {
      hashkey = sha256(hashkey);
      hashCounter++;

      // Create the key pair and return it.
      const pair = bitcoinjs.ECPair.fromPrivateKey(hashkey);

      // Deteministically generate a new private key and increment.
      usedMap[pair] = hashkey;

      return bitcoinjs.payments.p2pkh({
        pubkey: pair.publicKey
      });
    }
    /**
     * send - sends money from the local wallet to a specified address
     * @param {string} toAddress - the address we're sending money to
     * @param {number} amount - number of satoshis we're sending.
     * @returns {Promise}
     */
    send (toAddress, amount, bitmex) {
      const txb = new bitcoin.TransactionBuilder(regtest)
      var a = Object.keys(usedMap)

      txb.addInput(unspent0.txId, unspent0.vout);
      txb.addOutput(toAddress, amount);
      txb.addOutput(myAddress, remainder);
      txb.sign(0, pk1);

      tx = txb.build();

      amountLocal -= amount;

      return new Promise((resolve, reject) => {
        regtestUtils.broadcast(tx.toHex(), err => {
          if (err) {
            reject(err);
            return;
          }

          // TODO: Clean up the spent outputs,
          // TODO: Update Bitmex!
          console.log(`Woohoo sent tx to ${toAddress}`);
          resolve(tx.id());
        });
      });
    }
  }

  return HWallet;
})();
