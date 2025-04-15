// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../src/Voting.sol";

contract VotingTest is Test {
    Voting voting;
    address owner = address(0x123); // Mock owner address

    function setUp() public {
        // Deploy the Voting contract
        voting = new Voting();

        // Start a new voting session with candidates
        string[] memory candidateNames = new string[](3); // Correct length
        candidateNames[0] = "Rose";
        candidateNames[1] = "Jake";
        candidateNames[2] = "Charlie";

        // Start the voting session
        voting.startVoting(10, candidateNames); // 10 minutes
    }

    function testOwnerIsDeployer() public view {
        assertEq(voting.owner(), address(this), "Deployer is not the contract owner.");
    }

    function testVote() public {
        // Ensure the voting period is active
        vm.warp(voting.votingStart() + 1); // Move to 1 second after voting starts

        voting.vote(1); // Vote for Rose
        Voting.Candidate[] memory candidates = voting.getCandidates();
        assertEq(candidates[0].voteCount, 1, "Vote count should be 1.");
    }

    function testCannotVoteTwice() public {
        // Ensure the voting period is active
        vm.warp(voting.votingStart() + 1); // Move to 1 second after voting starts

        voting.vote(1); // Vote for Rose
        vm.expectRevert("You have already voted.");
        voting.vote(1); // Attempt to vote again
    }

    function testInvalidCandidateVote() public {
        // Ensure the voting period is active
        vm.warp(voting.votingStart() + 1); // Move to 1 second after voting starts

        vm.expectRevert("Invalid candidate ID.");
        voting.vote(999); // Attempt to vote for an invalid candidate
    }

    function testGetRemainingTime() public view {
        uint256 remainingTime = voting.getRemainingTime();
        assertGt(remainingTime, 0, "Remaining time should be greater than 0.");
    }

    function testGetCandidates() public view {
        Voting.Candidate[] memory candidates = voting.getCandidates();
        assertEq(candidates.length, 3, "Incorrect number of candidates."); // Updated to 3
        assertEq(candidates[0].name, "Rose", "Candidate name mismatch.");
        assertEq(candidates[1].name, "Jake", "Candidate name mismatch.");
        assertEq(candidates[2].name, "Charlie", "Candidate name mismatch."); // Added for Charlie
        assertEq(candidates[0].voteCount, 0, "Initial vote count mismatch.");
        assertEq(candidates[1].voteCount, 0, "Initial vote count mismatch.");
        assertEq(candidates[2].voteCount, 0, "Initial vote count mismatch."); // Added for Charlie
    }

    function testClearWinner() public {
        // Ensure the voting period is active
        vm.warp(voting.votingStart() + 1); // Move to 1 second after voting starts

        // Simulate voting from different addresses
        vm.prank(address(1)); // Change msg.sender to address(1)
        voting.vote(1); // Rose

        vm.prank(address(2)); // Change msg.sender to address(2)
        voting.vote(1); // Rose

        vm.prank(address(3)); // Change msg.sender to address(3)
        voting.vote(2); // Jake

        vm.warp(block.timestamp + 601); // Simulate time passing

        (uint256 winnerId, string memory winnerName, string memory note) = voting.getWinner();
    
        assertEq(winnerId, 1, "Winner ID should be 1 (Rose).");
        assertEq(winnerName, "Rose", "Winner name should be Rose.");
        assertEq(note, "Voting successful. A clear winner has been determined.", "Incorrect note.");
    }

    function testTie() public {
        // Ensure the voting period is active
        vm.warp(voting.votingStart() + 1); // Move to 1 second after voting starts

        // Simulate voting from different addresses
        vm.prank(address(1)); // Change msg.sender to address(1)
        voting.vote(1); // Rose

        vm.prank(address(2)); // Change msg.sender to address(2)
        voting.vote(2); // Jake

        vm.prank(address(3)); // Change msg.sender to address(3)
        voting.vote(1); // Rose

        vm.prank(address(4)); // Change msg.sender to address(4)
        voting.vote(2); // Jake

        vm.warp(block.timestamp + 601); // Simulate time passing

        (uint256 winnerId, string memory winnerName, string memory note) = voting.getWinner();
    
        assertEq(winnerId, 0, "Winner ID should be 0 in case of a tie.");
        assertEq(winnerName, "", "Winner name should be empty in case of a tie.");
        assertEq(note, "Voting resulted in a tie. Please conduct another round of voting.", "Incorrect note.");
    }

    function testNoWinner() public {
        vm.warp(block.timestamp + 601); // Simulate time passing without votes
        vm.expectRevert("No votes cast.");
        voting.getWinner(); // This should revert because no votes were cast
    }

    function testGetVoterStatus() public {
    // Ensure the voting period is active
    vm.warp(voting.votingStart() + 1);

    // Check voter status before voting
    bool statusBeforeVoting = voting.getVoterStatus(address(1));
    assertFalse(statusBeforeVoting, "Voter should not have voted yet.");

    // Vote and check status again
    vm.prank(address(1));
    voting.vote(1);

    bool statusAfterVoting = voting.getVoterStatus(address(1));
    assertTrue(statusAfterVoting, "Voter should have voted.");
    }

    function testResetVoting() public {
    // Ensure the voting period has ended
    vm.warp(voting.votingEnd() + 1);

    // Reset the voting session with new candidates
    string[] memory newCandidateNames = new string[](2);
    newCandidateNames[0] = "Alice";
    newCandidateNames[1] = "Bob";

    voting.resetVoting(10, newCandidateNames);

    // Check if the new candidates are added
    Voting.Candidate[] memory candidates = voting.getCandidates();
    assertEq(candidates.length, 2, "Incorrect number of candidates.");
    assertEq(candidates[0].name, "Alice", "Candidate name mismatch.");
    assertEq(candidates[1].name, "Bob", "Candidate name mismatch.");
    }

    function testExtendVoting() public {
    // Ensure the voting period is active
    vm.warp(voting.votingStart() + 1);

    // Extend the voting period by 5 minutes
    uint256 originalEndTime = voting.votingEnd();
    voting.extendVoting(5);

    // Check if the voting period was extended
    uint256 newEndTime = voting.votingEnd();
    assertEq(newEndTime, originalEndTime + 5 minutes, "Voting period was not extended correctly.");
    }

    function testVoteAfterVotingEnds() public {
    // Move time to after the voting period
    vm.warp(voting.votingEnd() + 1);

    // Attempt to vote
    vm.expectRevert("Voting is not active.");
    voting.vote(1);
    }

    function testResetVotingWhileActive() public {
    // Ensure the voting period is active
    vm.warp(voting.votingStart() + 1);

    // Attempt to reset the voting session
    string[] memory newCandidateNames = new string[](2);
    newCandidateNames[0] = "Alice";
    newCandidateNames[1] = "Bob";

    vm.expectRevert("Voting is still ongoing.");
    voting.resetVoting(10, newCandidateNames);
    }

    function testExtendVotingAfterEnds() public {
    // Move time to after the voting period
    vm.warp(voting.votingEnd() + 1);

    // Attempt to extend the voting period
    vm.expectRevert("Voting has already ended.");
    voting.extendVoting(5);
    }
}