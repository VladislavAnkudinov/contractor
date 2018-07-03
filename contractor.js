console.log('run contractor!')
const CONTRACT_ADDRESS = '0xf49ae4fd19ae216f961019ffe82efe16db09de82'
const ETH_ADDRESS = '0x2Cd14eeafee98E500A8b4B6a38C331aD9b0Dab12'
const ETH_KEY = '0xc4b06cc7b80a31fdc95ebd675da72e07e7c7246086b9b1d3388a737687a6d986'
const RET_ADDRESS = '0xDEADC0DE00000000000000000000000000000010'
const CONTRACT_ABI = require('./contractABI')
const SUPPLY_AMOUNT = 10
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
let tokenContract = null
let account = null
const supplyTx = {
  from: 0,
  to: CONTRACT_ADDRESS,
  value: SUPPLY_AMOUNT
}
let transferTx
Promise.resolve()
  .then(() => {
    tokenContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)
    console.log('tokenContract, keys =', Object.keys(tokenContract))
    account = web3.eth.accounts.privateKeyToAccount(ETH_KEY)
    web3.eth.accounts.wallet.add(account)
    console.log('accounts.wallet.length =', web3.eth.accounts.wallet.length)
  })
  .then(() => console.log('\n*** before ***\n'))
  .then(() => web3.eth.getBalance(ETH_ADDRESS))
  .then(res => console.log('ETH_ADDRESS, balance =', res))
  .then(() => web3.eth.getBalance(RET_ADDRESS))
  .then(res => console.log('RET_ADDRESS, balance =', res))
  .then(() => tokenContract.methods.balanceOf(ETH_ADDRESS).call())
  .then(balanceOf => console.log('ETH_ADDRESS, balanceOf =', balanceOf))
  .then(() => tokenContract.methods.balanceOf(RET_ADDRESS).call())
  .then(balanceOf => console.log('RET_ADDRESS, balanceOf =', balanceOf))
  .then(() => tokenContract.methods.totalSupply().call())
  .then(totalSupply => console.log('totalSupply =', totalSupply))

  .then(() => console.log('\n*** main ***\n'))
  .then(() => tokenContract.methods.name().call())
  .then(name => console.log('name =', name))
  .then(() => tokenContract.methods.symbol().call())
  .then(symbol => console.log('symbol =', symbol))
  .then(() => tokenContract.methods.decimals().call())
  .then(decimals => console.log('decimals =', decimals))
  .then(() => web3.eth.estimateGas({...supplyTx, from: ETH_ADDRESS}))
  .then(estimateSupplyTx => {
    console.log('estimateSupplyTx =', estimateSupplyTx)
    return web3.eth.sendTransaction({...supplyTx, gasLimit: '0x' + estimateSupplyTx.toString(16)})
      .on('transactionHash', transactionHash => console.log('EV supplyTx transactionHash =', transactionHash))
      // .on('receipt', receipt => console.log('EV receipt =', receipt))
      // .on('confirmation', (confirmationNumber, receipt) => console.log('EV confirmationNumber =', confirmationNumber, 'receipt =', receipt))
      // .on('error', (error, receipt) => console.log('EV error =', error.message, 'receipt =', receipt))
  })
  .then(res => {
    console.log('supplyTx, res =', res)
  })
  .then(() => {
    transferTx = tokenContract.methods.transfer(RET_ADDRESS, SUPPLY_AMOUNT)
    return transferTx.estimateGas({from: ETH_ADDRESS})
  })
  .then(estimateTransferTx => {
    console.log('estimateTransferTx =', estimateTransferTx)
    return transferTx.send({from: ETH_ADDRESS, gasLimit: '0x' + estimateTransferTx.toString(16)})
      .on('transactionHash', transactionHash => console.log('EV transferTx transactionHash =', transactionHash))
  })
  .then(res => {
    console.log('transferTx, res =', res)
  })
  .catch(error => console.log('main catch, error =', error.message))

  .then(() => console.log('\n*** after ***\n'))
  .then(() => web3.eth.getBalance(ETH_ADDRESS))
  .then(res => console.log('ETH_ADDRESS, balance =', res))
  .then(() => web3.eth.getBalance(RET_ADDRESS))
  .then(res => console.log('RET_ADDRESS, balance =', res))
  .then(() => tokenContract.methods.balanceOf(ETH_ADDRESS).call())
  .then(balanceOf => console.log('ETH_ADDRESS, balanceOf =', balanceOf))
  .then(() => tokenContract.methods.balanceOf(RET_ADDRESS).call())
  .then(balanceOf => console.log('RET_ADDRESS, balanceOf =', balanceOf))
  .then(() => tokenContract.methods.totalSupply().call())
  .then(totalSupply => console.log('totalSupply =', totalSupply))

  .catch(err => console.log('final catch, err =', err.message))
  .then(() => console.log('done!'))