// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/Voting.sol";

contract DeployVoting is Script {
    function run() external returns (Voting) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        console.log("Deployer address:", deployerAddress);

        vm.startBroadcast(deployerPrivateKey);
        
        Voting voting = new Voting();
        
        // Add initial candidates
        string[] memory candidateNames = new string[](3);
        candidateNames[0] = "Rose";
        candidateNames[1] = "Jake";
        candidateNames[2] = "Charlie";
        
        voting.startVoting(10, candidateNames); // 10 minutes
        
        console.log("Contract deployed to:", address(voting));
        
        vm.stopBroadcast();

        return voting;
    }
}