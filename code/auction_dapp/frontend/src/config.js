var DeedRepository = require('./contracts/DeedRepository')
var AuctionRepository = require('./contracts/AuctionRepository')

module.exports = {
	// Swarm endpoint is used to upload the asset represented by the NFT;
    BZZ_ENDPOINT: '127.0.0.1:1733',

    DEEDREPOSITORY_ADDRESS: '0xA4fBc0b0c4F079ea61f0d7D5d8091FD62b558f31',
    AUCTIONREPOSITORY_ADDRESS: '0xdF16fceA69cc8A7f5E15D69E75E3EE79D6D5436C',

    DEEDREPOSITORY_ABI: DeedRepository.abi,
    AUCTIONREPOSITORY_ABI: AuctionRepository.abi,

    GAS_AMOUNT: 500000,
}

//web3.eth.sendTransaction({from: web3.eth.accounts[0], to: "0x96aFAa5C5c06c033b4f148E289e8CF66B353482e" , value: web3.utils.toWei(1, 'ether'), gasLimit: 21000, gasPrice: 20000000000})
