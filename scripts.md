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
$ geth attach ipc:/home/vagrant/.ethereum/net42/geth.ipc 