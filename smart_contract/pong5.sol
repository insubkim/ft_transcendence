pragma solidity ^0.8.0;

contract TournamentScores {
    struct Score {
        string playerName;
        uint score;
    }

    mapping(uint => Score[]) public tournamentScores;

    function storeScore(uint tournamentId, string memory playerName, uint score) public {
        Score memory newScore = Score(playerName, score);
        tournamentScores[tournamentId].push(newScore);
    }

    function getScores(uint tournamentId) public view returns (Score[] memory) {
        return tournamentScores[tournamentId];
    }
}
