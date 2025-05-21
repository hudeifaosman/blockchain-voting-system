// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Tracks vote counts by candidate
    mapping(bytes32 => uint256) public votesReceived;
    // List of valid candidates
    bytes32[] public candidateList;

    // Initialize with the list of candidates
    constructor(bytes32[] memory candidateNames) {
        candidateList = candidateNames;
    }

    // Return total votes for a given candidate
    function totalVotesFor(bytes32 candidate) public view returns (uint256) {
        require(validCandidate(candidate), "Voting: invalid candidate");
        return votesReceived[candidate];
    }

    // Cast a vote for a candidate
    function voteForCandidate(bytes32 candidate) public {
        require(validCandidate(candidate), "Voting: invalid candidate");
        votesReceived[candidate] += 1;
        emit VoteCast(candidate, votesReceived[candidate]);
    }

    // Check whether a name is in the candidate list
    function validCandidate(bytes32 candidate) public view returns (bool) {
        for (uint256 i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }

    // Emitted whenever a vote is cast
    event VoteCast(bytes32 indexed candidate, uint256 newTotal);
}
