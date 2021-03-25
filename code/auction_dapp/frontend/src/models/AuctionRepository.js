import Config from '../config'

export class AuctionRepository {

    web3 = null
    account = ''
    contractInstance = null
    gas = 4476768

    initialized = new Promise((resolve) => {
        console.log('AuctionRepository: Promise constructor')
        this.proxy = new Proxy({}, {
            set: function(obj, prop, value) {
                console.log(`AuctionRepository: set for ${prop} = ${value}`)
                if (prop === 'initializedDone' && value == true) {
                    console.log(`AuctionRepository: set for ${prop} = ${value}: RESOLVE`)
                    resolve()
                }
                return true
            },
        })
    })

    constructor(){
        this.gas = Config.GAS_AMOUNT
    }

    setWeb3(web3) {
        console.log('AuctionRepository: setWeb3')
        this.web3 = web3
        this.contractInstance = new this.web3.eth.Contract(Config.AUCTIONREPOSITORY_ABI, Config.AUCTIONREPOSITORY_ADDRESS)
        console.log('AuctionRepository: set initializedDone to true')
        this.proxy.initializedDone = true
        delete this.proxy
        console.log('AuctionRepository: setWeb3 is done')
    }

    getWeb3() {
        return this.web3
    }

    setAccount(account){
        this.account = account
    }

    getCurrentBlock() {
        return new Promise(async (resolve, reject) => {
            await this.initialized;
            this.web3.eth.getBlockNumber((err, blocknumber) => {
                if(!err) resolve(blocknumber)
                reject(err)
            })
        })
    }

    async watchIfCreated(cb) {
        const currentBlock = await this.getCurrentBlock()
        const eventWatcher = this.contractInstance.events.AuctionCreated({}, {fromBlock: currentBlock - 1}, cb)
    }

    async watchIfBidSuccess(cb) {
        const currentBlock = await this.getCurrentBlock()
        const eventWatcher = this.contractInstance.events.BidSuccess({}, {fromBlock: currentBlock - 1}, cb)
    }

    async watchIfCanceled(cb) {
        const currentBlock = await this.getCurrentBlock()
        const eventWatcher = this.contractInstance.events.AuctionCanceled({}, {fromBlock: currentBlock - 1}, cb)
    }

    async watchIfFinalized(cb) {
        const currentBlock = await this.getCurrentBlock()
        const eventWatcher = this.contractInstance.events.AuctionFinalized({}, {fromBlock: currentBlock - 1}, cb)
    }
    getCurrentBid(auctionId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialized;
                this.contractInstance.methods.getCurrentBid(auctionId).call({from: this.account, gas: this.gas }, (err, transaction) => {
                    if(!err) resolve(transaction)
                    reject(err)
                })
            } catch(e) {
                reject(e)
            }
        })
    }

    getBidCount(auctionId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialized;
                this.contractInstance.methods.getBidsCount(auctionId).call({from: this.account, gas: this.gas }, (err, transaction) => {
                    if(!err) resolve(transaction)
                    reject(err)
                })
            } catch(e) {
                reject(e)
            }
        })
    }

    getCount() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('AuctionRepository: getCount: waiting to be initialized')
                await this.initialized;
                console.log('AuctionRepository: getCount: done waiting for initialized')
                this.contractInstance.methods.getCount().call({from: this.account, gas: this.gas }, (err, transaction) => {
                    if(!err) resolve(transaction)
                    reject(err)
                })
            } catch(e) {
                reject(e)
            }
        })
    }

    bid(auctionId, price) {
        console.log(auctionId, this.web3.utils.toWei(price, 'ether'))
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialized;
                this.contractInstance.methods.bidOnAuction(auctionId).send({from: this.account, gas: this.gas, value: this.web3.utils.toWei(price, 'ether') }, (err, transaction) => {
                    if(!err) resolve(transaction)
                    reject(err)
                })
            } catch(e) {
                reject(e)
            }
        })
    }

    create(deedId, auctionTitle, metadata, startingPrice, blockDeadline) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('AuctionRepository.create: before wait for initialized')
                await this.initialized;
                console.log('AuctionRepository.create: initialized, not createAuction')
                this.contractInstance.methods.createAuction(Config.DEEDREPOSITORY_ADDRESS, deedId, auctionTitle, metadata, this.web3.utils.toWei(startingPrice, 'ether'), blockDeadline).send({from: this.account, gas: this.gas }, (err, transaction) => {
                    console.log('AuctionRepository.create: createAuction callback: ', err)
                    if(!err) resolve(transaction)
                    reject(err)
                })
            } catch(e) {
                reject(e)
            }
        })
    }

    cancel(auctionId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialized;
                this.contractInstance.methods.cancelAuction(auctionId).send({from: this.account, gas: this.gas }, (err, transaction) => {
                    if(!err) resolve(transaction)
                    reject(err)
                })
            } catch(e) {
                reject(e)
            }
        })
    }

    finalize(auctionId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialized;
                this.contractInstance.methods.finalizeAuction(auctionId).send({from: this.account, gas: this.gas }, (err, transaction) => {
                    if(!err) resolve(transaction)
                    reject(err)
                })
            } catch(e) {
                reject(e)
            }
        })
    }

    findById(auctionId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialized;
                this.contractInstance.methods.getAuctionById(auctionId).call({ from: this.account, gas: this.gas }, (err, transaction) => {
                    if(!err) resolve(transaction)
                    reject(err)
                })
            } catch(e) {
                reject(e)
            }
        })
    }

}
