require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config()

module.exports = {
  solidity: {
    version: "0.8.10",
    settings: {
      evmVersion: 'berlin', 
      optimizer: {
        enabled: true,
        runs: 200 
      }
    }
  },
  networks: {
      hardhat: {
          chainId: 31337
      },    
      xrpl: {
        url: `https://rpc-evm-sidechain.xrpl.org`,
        accounts: [process.env.PRI_KEY],
        chainId: 1440002,
      },
  },


  etherscan: {
    apiKey: {
      xrpl: 'MOCK_API_KEY'
    },
    customChains: [
      {
        network: "xrpl",
        chainId: 1440002,
        urls: {
          apiURL: "https://evm-poa-sidechain.peersyst.tech/api",
          browserURL: "https://evm-sidechain.xrpl.org/"
        }
      }
    ]
  },

};
