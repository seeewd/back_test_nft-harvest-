const SmartContract = artifacts.require('SmartContract')

module.exports = function (deployer) {
  deployer.deploy(
    SmartContract,
    'testt',
    'ttt',
    'https://s3.ap-northeast-2.amazonaws.com/ssulahome.com/images/',
  )
}
