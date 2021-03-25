import Vue from 'vue'
import App from './App'
import Config from './config'
import router from './router'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import { ChatRoom } from './models/ChatRoom'
import { DeedRepository } from './models/DeedRepository'
import { AuctionRepository } from './models/AuctionRepository'
import detectEthereumProvider from '@metamask/detect-provider';

// rename to avoid conflict between metamask
// will be used for whisper v5/6
var Web3_1 = require('web3')


Vue.use(VueResource)
Vue.use(Vuetify)
Vue.config.devtools = true
Vue.config.productionTip = false
Vue.config.performance = true

const EthMixin = {
    created: async function() {
        console.log('EthMixin: created')

        // Inject the models to components
        console.log('EthMixin: creating ChatRoom, DeedRepo, and AuctionRepo')
        this.$chatroomInstance = new ChatRoom(this.$http)
        this.$deedRepoInstance = new DeedRepository()
        this.$auctionRepoInstance = new AuctionRepository()
        console.log('EthMixin: created ChatRoom, DeedRepo, and AuctionRepo')

        console.log('EthMixin: detecting provider')
        let provider = await detectEthereumProvider()
        console.log('EthMixin: detected provider')

        // one instance of web3 available to all components
        console.log('EthMixin: setting web3 for deedRepo and auctionRepo')
        let web3 = new Web3_1(provider)
        store.setWeb3(web3)
        this.$deedRepoInstance.setWeb3(web3)
        this.$auctionRepoInstance.setWeb3(web3)
        console.log('EthMixin: set web3 for deedRepo and auctionRepo')

        store.setMetamaskInstalled()

        let netId = await web3.eth.net.getId()
        store.setNetworkId(netId)
        console.log('EthMixin: netWorkId is set')

        // pull accounts every 2 seconds
        setInterval(async function tryGetAccounts() {
            let data = await web3.eth.getAccounts()
            if (data.length > 0) {
                console.log("Got default account: ", data[0])
                store.setWeb3DefaultAccount(data[0])
            } else {
                console.log(`Could not get accounts: err ${err}, data.length ${data.length}`)
            }
        }, 2000)

        // inject config to components
        this.$config = Config
        console.log('EthMixin: done')
    }
}

// state management
var store = {
    debug: true,
    state: {
        // metamask state variable
        metamask: {
            web3DefaultAccount: '',
            metamaskInstalled: false,
            networkId: '',
        },

        // local web3 instance(not metamask)
        web3 : null,

    },
    setWeb3(val) {
        this.state.web3 = val
    },
    getWeb3() {
        return this.state.web3
    },
    networkReady() {
        return this.getNetworkId() != '' && this.getMetamaskInstalled() && this.getWeb3DefaultAccount() != ''
    },
    setNetworkId(networkId) {
        this.state.metamask.networkId = networkId
    },
    getNetworkId() {
        return this.state.metamask.networkId
    },

    setWeb3DefaultAccount(account) {
        this.state.metamask.web3DefaultAccount = account
    },
    getWeb3DefaultAccount() {
        return this.state.metamask.web3DefaultAccount
    },

    setMetamaskInstalled(){
        this.state.metamask.metamaskInstalled = true
    },
    getMetamaskInstalled(){
        return this.state.metamask.metamaskInstalled
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
}

new Vue({
    el: '#app',
    data: {
        globalState: store,
    },
    mixins: [ EthMixin ],
    router,
    render: h => h('app'),
    template: '<App/>',
    components: { app: App },
})
