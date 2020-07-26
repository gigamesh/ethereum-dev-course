### run geth
DAPPS/launch42.sh

### unlock
personal.unlockAccount(eth.accounts[0])

### send transaction
eth.sendTransaction({
  from: eth.accounts[0], 
  to: '0x3b873A919aA0512D5A0F09E6dCCEaA4a6727faFE', 
  value: '1001300000000000000',
  gasPrice: web3.toWei(63, 'gwei')
})

### Attach to same geth instance from second terminal (w/out logs)
geth attach ipc:/home/vagrant/.ethereum/net42/geth.ipc 


### contract
var deployTransactionObject = { from: eth.coinbase, data: "0x" + compiled.contracts[contractKey].bin, value: web3.toWei(1, "ether"), gas: 1000000 };
faucet contract: 0x0504015afb7eea31dfbaffef2b8f9def50167e61