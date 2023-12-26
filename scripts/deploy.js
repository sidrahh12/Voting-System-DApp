const hre = require("hardhat");
const fs = require("fs");

async function main() {
 const Voting = await hre.ethers.getContractFactory("Voting");
 const voting = await Voting.deploy();

 await voting.deployed();

 console.log("Voting contract deployed to:", voting.address);

 // Get the contract's ABI
 const abi = JSON.stringify(Voting.interface.abi, null, 2);

 // Write the ABI to a JSON file
 fs.writeFileSync("Voting.json", JSON.stringify(abi, null, 2));

 // Exiting the script
 process.exit(0);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
