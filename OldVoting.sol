// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Voting {
    // Candidate structure
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // State variables
    address public owner;
    mapping(uint256 => Candidate) public candidates; // Candidate storage
    uint256 public candidatesCount; // Total candidates
    mapping(address => bool) public voters; // Track who has voted
    uint256 public votingStart; // Voting start timestamp
    uint256 public votingEnd; // Voting end timestamp

    // Events for better logging
    event CandidateAdded(uint256 indexed candidateId, string name);
    event Voted(address indexed voter, uint256 indexed candidateId);
    event VotingStarted(uint256 startTime, uint256 endTime);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action.");
        _;
    }

    modifier duringVoting() {
        require(block.timestamp >= votingStart && block.timestamp < votingEnd, "Voting is not active.");
        _;
    }

    modifier afterVoting() {
        require(block.timestamp >= votingEnd, "Voting is still ongoing.");
        _;
    }

    // Constructor to initialize owner and start voting
    constructor(uint256 _durationInMinutes) {
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);

        emit VotingStarted(votingStart, votingEnd);
    }

    // Add candidates (onlyOwner)
    function addCandidate(string memory _name) public onlyOwner {
        require(bytes(_name).length > 0, "Candidate name cannot be empty.");
        require(bytes(_name).length <= 32, "Candidate name is too long.");

        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    // Vote for a candidate
    function vote(uint256 _candidateId) public duringVoting {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit Voted(msg.sender, _candidateId);
    }

    // Get remaining voting time
    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    // Get all candidates
    function getCandidates() public view returns (uint256[] memory, string[] memory, uint256[] memory) {
        uint256[] memory ids = new uint256[](candidatesCount);
        string[] memory names = new string[](candidatesCount);
        uint256[] memory voteCounts = new uint256[](candidatesCount);

        for (uint256 i = 0; i < candidatesCount; i++) {
            Candidate memory candidate = candidates[i + 1];
            ids[i] = candidate.id;
            names[i] = candidate.name;
            voteCounts[i] = candidate.voteCount;
        }

        return (ids, names, voteCounts);
    }

    // Determine the winner (after voting ends)
    function getWinner() public view afterVoting returns (uint256 winnerId, string memory winnerName, string memory note) {
        uint256 winningVoteCount = 0;
        uint256 winnerCount = 0;
        uint256 tempWinnerId = 0;
        string memory tempWinnerName = "";

        // First pass: Find the winning vote count and the first candidate with that count
        for (uint256 i = 0; i < candidatesCount; i++) {
            Candidate memory candidate = candidates[i + 1];
            if (candidate.voteCount > winningVoteCount) {
                winningVoteCount = candidate.voteCount;
                tempWinnerId = candidate.id;
                tempWinnerName = candidate.name;
                winnerCount = 1; // Reset winner count since we found a new highest vote count
                } else if (candidate.voteCount == winningVoteCount) {
                    winnerCount++; // Increment winner count if another candidate has the same vote count
                    }
                }

        require(winningVoteCount > 0, "No votes cast.");

        // If there is a tie, return 0 winners and a note
        if (winnerCount > 1) {
        return (0, "", "Voting resulted in a tie. Please conduct another round of voting.");
        }

        // If there is a clear winner, return the winner's details
        return (tempWinnerId, tempWinnerName, "Voting successful. A clear winner has been determined.");
    }

    // Check if voting is active
    function isVotingActive() public view returns (bool) {
        return block.timestamp >= votingStart && block.timestamp < votingEnd;
    }

    // Check if a voter has voted
    function getVoterStatus(address _voter) public view returns (bool) {
        return voters[_voter];
    }
}