// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlipGame {
    struct Game {
        uint256 gameId;
        uint256 betAmount;
        address creator;
        address player;
        bool coinResult; // true for heads, false for tails
        address winner;
    }

    Game[] public games;

    function createGame(uint256 betAmount) public payable {
        require(msg.value == betAmount, "Incorrect bet amount sent");
        Game memory newGame = Game(games.length, betAmount, msg.sender, address(0), false, address(0));
        games.push(newGame);
    }

    function joinGame(uint256 gameId) public payable {
        require(gameId < games.length, "Game does not exist");
        Game storage game = games[gameId];
        require(!game.coinResult, "Game has already been played");
        require(msg.value == game.betAmount, "Incorrect bet amount sent");
        game.player = msg.sender;
    }

    function flipCoin(uint256 gameId) public {
        require(gameId < games.length, "Game does not exist");
        Game storage game = games[gameId];
        require(!game.coinResult, "Game has already been played");
        game.coinResult = (block.timestamp % 2 == 0); // Randomly determine the result
        game.winner = game.coinResult ? game.creator : game.player;
    }

    function getWinner(uint256 gameId) public view returns (address winner) {
        require(gameId < games.length, "Game does not exist");
        Game storage game = games[gameId];
        require(game.coinResult, "Game result is not available yet");
        return game.winner;
    }
}
