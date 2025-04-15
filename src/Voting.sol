// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    address public owner;
    Candidate[] public candidates;
    mapping(address => bool) public voters;
    uint256 public votingStart;
    uint256 public votingEnd;
    uint256 public lastCandidateId;

    event CandidateAdded(uint256 indexed candidateId, string name);
    event CandidateRemoved(uint256 indexed candidateId);
    event Voted(address indexed voter, uint256 indexed candidateId);
    event VotingStarted(uint256 startTime, uint256 endTime);
    event VotingReset(uint256 startTime, uint256 endTime);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action.");
        _;
    }

    modifier votingInactive() {
        require(!isVotingActive(), "Voting is not active.");
        _;
    }

    modifier duringVoting() {
        require(isVotingActive(), "Voting is not active.");
        _;
    }

    modifier afterVoting() {
        require(block.timestamp >= votingEnd, "Voting is still ongoing.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addCandidate(string memory _name) public onlyOwner votingInactive {
        lastCandidateId++;
        candidates.push(Candidate(lastCandidateId, _name, 0));
        emit CandidateAdded(lastCandidateId, _name);
    }

    function removeCandidate(uint256 _candidateId) public onlyOwner votingInactive {
        bool found;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].id == _candidateId) {
                candidates[i] = candidates[candidates.length - 1];
                candidates.pop();
                found = true;
                emit CandidateRemoved(_candidateId);
                break;
            }
        }
        require(found, "Invalid candidate ID.");
    }

    function startVoting(uint256 _durationInMinutes, string[] memory _names) public onlyOwner votingInactive {
        require(_names.length > 0, "At least one candidate is required.");
        
        delete candidates;
        lastCandidateId = 0;

        for (uint256 i = 0; i < _names.length; i++) {
            addCandidate(_names[i]);
        }

        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
        emit VotingStarted(votingStart, votingEnd);
    }

    function vote(uint256 _candidateId) public duringVoting {
        require(!voters[msg.sender], "You have already voted.");
        require(_validCandidate(_candidateId), "Invalid candidate ID.");
        
        voters[msg.sender] = true;
        candidates[_getCandidateIndex(_candidateId)].voteCount++;
        emit Voted(msg.sender, _candidateId);
    }

    function getWinner() public view afterVoting returns (uint256 winnerId, string memory winnerName, string memory note) {
        require(candidates.length > 0, "No candidates available.");
        
        uint256 winningVoteCount = 0;
        uint256 winnerCount = 0;
        uint256 tempWinnerId = 0;
        string memory tempWinnerName = "";

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                tempWinnerId = candidates[i].id;
                tempWinnerName = candidates[i].name;
                winnerCount = 1;
            } else if (candidates[i].voteCount == winningVoteCount) {
                winnerCount++;
            }
        }

        require(winningVoteCount > 0, "No votes cast.");

        if (winnerCount > 1) {
            return (0, "", "Voting resulted in a tie. Please conduct another round of voting.");
        }
        return (tempWinnerId, tempWinnerName, "Voting successful. A clear winner has been determined.");
    }

    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp >= votingEnd) return 0;
        return votingEnd - block.timestamp;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function isVotingActive() public view returns (bool) {
        return block.timestamp >= votingStart && block.timestamp < votingEnd;
    }

    function getVoterStatus(address _voter) public view returns (bool) {
        return voters[_voter];
    }

    function resetVoting(uint256 _durationInMinutes, string[] memory _names) public onlyOwner {
        require(block.timestamp >= votingEnd, "Voting is still ongoing.");
        
        delete candidates;
        lastCandidateId = 0;

        for (uint256 i = 0; i < _names.length; i++) {
            addCandidate(_names[i]);
        }

        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
        emit VotingReset(votingStart, votingEnd);
    }

    function extendVoting(uint256 _additionalMinutes) public onlyOwner {
        require(block.timestamp < votingEnd, "Voting has already ended.");
        votingEnd += (_additionalMinutes * 1 minutes);
        emit VotingStarted(votingStart, votingEnd);
    }

    function _validCandidate(uint256 _candidateId) internal view returns (bool) {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].id == _candidateId) return true;
        }
        return false;
    }

    function _getCandidateIndex(uint256 _candidateId) internal view returns (uint256) {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].id == _candidateId) return i;
        }
        revert("Candidate not found");
    }
}