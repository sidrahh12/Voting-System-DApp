// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../script/DeployVoting.s.sol";
import "../src/Voting.sol";

contract DeployVotingTest is Test {
    DeployVoting public deployScript;
    Voting public voting;

    function setUp() public {
        deployScript = new DeployVoting();
        voting = deployScript.run(); // Deploy the Voting contract and start the voting session
    }

    function testDeployment() public view {
        assertTrue(address(voting) != address(0), "Voting contract should be deployed");
    }

    function testOwner() public view {
        address owner = voting.owner();
        address deployer = vm.addr(vm.envUint("PRIVATE_KEY"));
        assertEq(owner, deployer, "Owner should be the deployer");
    }

    function testVotingDuration() public view {
        uint256 duration = voting.votingEnd() - voting.votingStart();
        assertEq(duration, 10 * 60, "Voting duration should be 10 minutes");
    }

    function testInitialCandidates() public view {
        (, string memory name1, ) = voting.candidates(0);
        assertEq(name1, "Rose", "First candidate should be Rose");

        (, string memory name2, ) = voting.candidates(1);
        assertEq(name2, "Jake", "Second candidate should be Jake");

        (, string memory name3, ) = voting.candidates(2);
        assertEq(name3, "Charlie", "Third candidate should be Charlie");
    }

    function testVotingIsActive() public view {
        bool active = voting.isVotingActive();
        assertTrue(active, "Voting should be active");
    }

    function testVotingFunctionality() public {
        // Ensure the voting period is active
        vm.warp(voting.votingStart() + 1); // Move to 1 second after voting starts

        // Vote for candidate 1 (Rose) from two different addresses
        vm.prank(address(1));
        voting.vote(1); // Candidate ID 1 corresponds to index 0 in the array

        vm.prank(address(2));
        voting.vote(1); // Candidate ID 1 corresponds to index 0 in the array

        // Check the vote count for candidate 1 (Rose)
        (, , uint256 voteCount) = voting.candidates(0); // Use index 0 for candidate ID 1
        assertEq(voteCount, 2, "Vote count for Rose should be 2");
    }
}