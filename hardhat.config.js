require("@nomicfoundation/hardhat-toolbox");

const { task } = require("hardhat/config");
const fs = require("fs");
const { mnemonic, etherscanApiKey } = require('./secrets.json');

module.exports = {
 solidity: "0.8.19",
 etherscan: {
   apiKey: etherscanApiKey,
 },
 networks: {
   hardhat: {
     chainId: 1337,
   },
   sepolia: {
     url: "https://eth-sepolia.g.alchemy.com/v2/remote",
     accounts: {
       mnemonic: mnemonic,
       path: "m/44'/60'/0'/0",
       initialIndex: 0,
       count: 20,
       passphrase: "",
     },
     chainId: 11155111,
   }
 }
};

task("deploy", "Deploys the Voting contract")
 .addParam("contractname", "The name of the contract")
 .setAction(async function(taskArgs, hre, runSuper) {
   const Voting = await hre.ethers.getContractFactory(taskArgs.contractname);
   const voting = await Voting.deploy();

   await voting.deployTransaction.wait();

   console.log(`${taskArgs.contractname} contract deployed to: ${voting.address}`);

   const abi = Voting.interface.format(); 

   fs.writeFileSync(`./${taskArgs.contractname}ABI.json`, abi);
});
