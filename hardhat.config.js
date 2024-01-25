require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = process.env.PRIVATE_KEY
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const REDBELLY_RPC_URL = process.env.REDBELLY_RPC_URL
const REDBELLY_PRIVATE_KEY = process.env.REDBELLY_PRIVATE_KEY
module.exports = {
  solidity: {
    compilers:[
      {
        version:"0.8.0",
      },
      {
        version:"0.8.19",
      }
    ]
  },networks: {
    goerli: {
      chainId: 5,
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY]
    },
    RedbellyDevNet: {
      chainId: 152,
      url : REDBELLY_RPC_URL,
      accounts: [REDBELLY_PRIVATE_KEY]
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  }
};
