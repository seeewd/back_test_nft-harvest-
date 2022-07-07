const SmartContract = artifacts.require('SmartContract')

module.exports = function (deployer) {
  deployer.deploy(
    SmartContract,
    'testt',
    'ttt',
    'https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg',
  )
}
