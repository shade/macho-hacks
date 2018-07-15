const fetch = require('node-fetch');
const crypto = require('crypto');
const qs = require('qs');
 
const apiKey = "bmtmfpw-vromkcpFsHxaEUdg";
const apiSecret = "ouN9KgJ5eIZiXzWtw6-KEy_CGtAbSwKWn_nCRdYqqpVW2ajC";

function makeRequest(verb, endpoint, data = {}) {
  const apiRoot = '/api/v1/';
 
  const expires = new Date().getTime() + (60 * 1000);  // 1 min in the future
 
  let query = '', postBody = '';
  if (verb === 'GET')
    query = '?' + qs.stringify(data);
  else
    // Pre-compute the reqBody so we can be sure that we're using *exactly* the same body in the request
    // and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
    postBody = JSON.stringify(data);
 
  const signature = crypto.createHmac('sha256', apiSecret)
    .update(verb + apiRoot + endpoint + query + expires + postBody).digest('hex');
 
  const headers = {
    'content-type': 'application/json',
    'accept': 'application/json',
    // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
    // https://www.bitmex.com/app/apiKeysUsage for more details.
    'api-expires': expires,
    'api-key': apiKey,
    'api-signature': signature,
  };
 
  const requestOptions = {
    method: verb,
    headers,
  };
  if (verb !== 'GET') requestOptions.body = postBody;  // GET/HEAD requests can't have body
 
  const url = 'https://testnet.bitmex.com' + apiRoot + endpoint + query;
 
  return fetch(url, requestOptions).then(response => response.json()).then(
    response => {
        //TODO: handle error?
      //if ('error' in response) throw new Error(response.error.message);
      return response;
    },
    error => console.error('Network error', error),
  );
}
 
async function fetchMarkPrice() {
  try {
    const result = await makeRequest('GET',  'instrument', {
      symbol: 'XBT',
      columns: 'markPrice'
    });
    return result[0].markPrice
  } catch (e) {
    console.error(e);
  };
};

async function fetchDepositAddress() {
    try {
      const result = await makeRequest('GET',  'user/depositAddress', {
        currency: 'XBt'
      });
      return result;
    } catch (e) {
      console.error(e);
    };
  };

  async function submitOrder(orderSize) {
    try {
      const result = await makeRequest('POST',  'order', {
        symbol: 'XBTUSD',
        orderQty: orderSize,
        ordType: 'Market'
      });
      return result;
    } catch (e) {
      console.error(e);
    };
  };

  async function fetchPositionSize() {
    try {
      const result = await makeRequest('GET',  'position', {
        symbol: 'XBTUSD',
      });
      return result[0].currentQty;
    } catch (e) {
      console.error(e);
    };
  };

  async function fetchLeverage() {
    try {
        const result = await makeRequest('GET',  'user/margin', {
          currency: 'XBt',
        });
        //console.log("margin result is: ")
        //console.log(result.marginLeverage)
        return result.marginLeverage;
      } catch (e) {
        console.error(e);
      };
  };

  async function fetchBalance() {
    try {
        const result = await makeRequest('GET',  'user/walletSummary', {
          currency: 'XBt',
        });
        return result[2].walletBalance;
      } catch (e) {
        console.error(e);
      };
  };


  
module.exports = {
    fetchMarkPrice : fetchMarkPrice,
    fetchDepositAddress : fetchDepositAddress,
    submitOrder : submitOrder,
    fetchPositionSize : fetchPositionSize,
    fetchLeverage : fetchLeverage,
    fetchBalance : fetchBalance
}