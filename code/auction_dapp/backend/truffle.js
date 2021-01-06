module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 3000000
    }
  },
  compilers: {
    solc: {
      version: "0.4.21",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};
