const https = require("https");
const axios = require("axios");
const Web3 = require("web3");

const Tx = require("ethereumjs-tx").Transaction;

const web3 = new Web3(
  "wss://ropsten.infura.io/ws/v3/dc6f5f82858c47f88b1808a350e646cd"
);

const gasPrice = web3.utils.toBN("20000000000");
const faucetAddr = "0x3b873a919aa0512d5a0f09e6dcceaa4a6727fafe";
const myRopstenAddr = "0x32F0904823e3b7D58B6CAE4B566d03fA889C3936";

const dataToSend = web3.utils.fromUtf8("Matt Masurka");

const account = {
  addr: "0xEB344551366B96c75868F15ECbd72460ccbb97eF",
  key: Buffer.from(
    "18faaa9e167ade04b344b0ef25176b0697b4ef3ff9517eefd10b99282c1ed1b1",
    "hex"
  ),
};

// var wallet = ethWallet.fromPrivateKey(account.key);
// wallet.toV3String("password").then(console.log);

(async () => {
  let txFee, gas;
  try {
    const gasCallData = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_estimateGas",
      params: [
        {
          from: myRopstenAddr,
          to: faucetAddr,
        },
      ],
    });

    const gasResponse = await axios.post(
      "https://ropsten.infura.io/v3/dc6f5f82858c47f88b1808a350e646cd",
      gasCallData
    );
    gas = parseInt(gasResponse.data.result, 16);
    const gasBn = web3.utils.toBN(gas);
    txFee = gasPrice.mul(gasBn);

    console.log(txFee.toString());
  } catch (err) {
    console.error(err);
  }

  // txFee: 421020000000000

  try {
    let value = web3.utils.toBN("100000000000000000").sub(txFee);

    const txParams = {
      nonce: "0x04",
      gasPrice: gasPrice,
      gasLimit: "0x55F0",
      to: faucetAddr,
      value,
    };

    // The second parameter is not necessary if these values are used
    const tx = new Tx(txParams, {
      chain: "ropsten",
      // hardfork: "Istanbul",
    });
    tx.sign(account.key);
    const serializedTx = tx.serialize();

    const sendTxCallData = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_sendRawTransaction",
      params: ["0x" + serializedTx.toString("hex")],
    });

    const response = await axios.post(
      "https://ropsten.infura.io/v3/dc6f5f82858c47f88b1808a350e646cd",
      sendTxCallData
    );

    console.log(response);
  } catch (err) {
    if (err.response) {
      console.error(`${err.response.status} error, ${err.response.statusText}`);
    } else {
      console.error(err);
    }
  }
})();

// 100421020000000000
