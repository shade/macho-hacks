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
      let aObj = this._genAddress();
      return {
        address,
        wait: new Promise((resolve, reject) => {
          bitcoin.events.on(aObj.address, tx => {
            tx.vout.forEach((out,i) => {
              if (out.address === aObj.address && out.amount === amount) {
                //await deposit = bitmex.fetchDepositAddress();
                //this.depositOrSplit(amount);
                // Remove this listener for memory management
                amountLocal += amount;
                aObj.txid = txid;
                aObj.amount = amount;
                aObj.vout = i;

                bitcoin.events.removeListener(this.address, arguments.callee);
                resolve(txid);
              }
            });
          });
        })
      };
    }
    _genAddress () {
      hashkey = sha256(hashkey);
      hashCounter++;

      // Create the key pair and return it.
      const pair = bitcoinjs.ECPair.fromPrivateKey(hashkey);

      // The bitcoin
      const { address } = bitcoinjs.payments.p2pkh({
        pubkey: pair.publicKey
      });

      // Deteministically generate a new private key and increment.
      usedMap[hashCounter] = {
        sk: pair.pri,
        pk: pair.publicKey,
        address,
        amount: 0
      };

      return usedMap[hashCounter];
    }
    /**
     * send - sends money from the local wallet to a specified address
     * @param {string} toAddress - the address we're sending money to
     * @param {number} amount - number of satoshis we're sending.
     * @returns {Promise}
     */
    send (toAddress, amount, bitmex) {

      const txb = new bitcoin.TransactionBuilder(regtest);
      // Sort out the amount of money we send back, by the smallest first.
      let txids = Object.keys(usedMap)
        .filter(i => usedMap[i].amount)
        .sort((a,b) => {
          return usedMap[a].amount - usedMap[b].amount;
        })

      return new Promise((resolve, reject) => {
        if (amountLocal < amount) {
          reject()
        }

        let acc = 0;
        let i = 0;
        let remainder = 0;
        while (acc < amount) {
          acc += usedMap[i++].amount;
        }
        if (acc > amount) {
          remainder = acc - amount;
        }

        // Add inputs
        for (var n = 0; n < i; n++) {
          txb.addInput(usedMap[i].txid, usedMap[i].vout);
        }

        txb.addOutput(toAddress, amount);
        txb.addOutput(usedMap[i - 1], remainder);

        // Add sigs
        for (var n = 0; n < i; n++) {
          txb.sign(0, usedMap[i].sk);

          if (n != i - 1) {
            delete usedMap[i];
          }
        }

        tx = txb.build();

        usedMap[i - 1].amount = remainder;
        usedMap[i - 1].txid = tx.id();
        usedMap[i - 1].vout = 1;

        regtestUtils.broadcast(tx.toHex(), err => {
          if (err) {
            reject(err);
            return;
          }

          console.log(`Woohoo sent tx to ${toAddress}`);
          resolve(tx.id());
          amountLocal -= amount;
        });
      });
    }
  }

  return HWallet;
})();

