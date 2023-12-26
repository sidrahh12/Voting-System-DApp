// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Voting {
   // Model a Candidate
   struct Candidate {
       uint id;
       string name;
       uint voteCount;
    }

   // Store Candidates
   mapping(uint => Candidate) public candidates;
   // Store Candidates Count
   uint public candidatesCount;

   // Store accounts that have voted
   mapping(address => bool) public voters;

   // Constructor
   constructor () {
       addCandidate("Ruby");
       addCandidate("Jaden");
    }

   function addCandidate (string memory _name) private {
       candidatesCount ++;
       candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

   function vote (uint _candidateId) public {
       // require that they haven't voted before
       require(!voters[msg.sender], "The voter has already voted.");

       // require a valid candidate
       require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

       // record that voter has voted
       voters[msg.sender] = true;

       // update candidate vote Count
       candidates[_candidateId].voteCount ++;
    }

   function getVoteCount(uint _candidateId) public view returns (uint) {
       // require a valid candidate
       require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

       return candidates[_candidateId].voteCount;
    }

   function getCandidates() public view returns (uint[] memory, string[] memory) {
       uint[] memory candidateIds = new uint[](candidatesCount);
       string[] memory candidateNames = new string[](candidatesCount);

       for (uint i = 0; i < candidatesCount; i++) {
           Candidate storage candidate = candidates[i+1];
           candidateIds[i] = candidate.id;
           candidateNames[i] = candidate.name;
        }

       return (candidateIds, candidateNames);
    }

   function getWinner() public view returns (uint winnerId, string memory winnerName) {
       uint winningVoteCount = 0;
       for (uint i = 0; i < candidatesCount; i++) {
           Candidate storage candidate = candidates[i+1];
           if (candidate.voteCount > winningVoteCount) {
               winningVoteCount = candidate.voteCount;
               winnerId = candidate.id;
               winnerName = candidate.name;
            }
        }
    }
}
