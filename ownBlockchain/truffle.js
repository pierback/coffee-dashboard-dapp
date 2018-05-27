module.exports = {
  rpc: {
    host: "localhost",
    port: 8545
  },
  networks: {
    development: {
      host: "localhost",
      port: 8545, // port where your blockchain is running 
      network_id: "*",
      from: "2c5994173c3a8cbc0219512a5a1d8f0797cd6b73",
      gas: 18000000
    }
  }
};