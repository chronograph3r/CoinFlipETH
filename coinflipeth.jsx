import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CoinFlipGameContract from './CoinFlipGame.json'; // Replace with your contract ABI
import Web3 from 'web3';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [games, setGames] = useState([]);
  const [gameId, setGameId] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [gameResult, setGameResult] = useState('');
  const [winner, setWinner] = useState('');

  const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address

  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();

        // Prompt user to connect their wallet
        try {
          await window.ethereum.enable();
        } catch (error) {
          console.error('User denied access to the wallet');
        }

        setWeb3(provider);
        setContract(new ethers.Contract(contractAddress, CoinFlipGameContract, provider));
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);

        // Fetch existing games
        const games = await contract.getAllGames();
        setGames(games);
      } else {
        console.error('MetaMask not found. Please install MetaMask');
      }
    }

    initWeb3();
  }, []);

  async function createGame() {
    try {
      await contract.createGame({ value: ethers.utils.parseEther(betAmount.toString()) });
      const games = await contract.getAllGames();
      setGames(games);
    } catch (error) {
      console.error('Error creating the game:', error);
    }
  }

  async function joinGame() {
    try {
      await contract.joinGame(gameId, { value: ethers.utils.parseEther(betAmount.toString()) });
      const games = await contract.getAllGames();
      setGames(games);
    } catch (error) {
      console.error('Error joining the game:', error);
    }
  }

  async function flipCoin() {
    try {
      const result = await contract.flipCoin(gameId);
      setGameResult(result ? 'Heads' : 'Tails');
      const winner = await contract.getWinner(gameId);
      setWinner(winner);
      const games = await contract.getAllGames();
      setGames(games);
    } catch (error) {
      console.error('Error flipping the coin:', error);
    }
  }

  return (
    <div className="App">
      <h1>Coin Flip Game</h1>
      <p>Connected Account: {account}</p>

      <div>
        <h2>Create Game</h2>
        <input
          type="number"
          placeholder="Bet Amount (in ETH)"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
        <button onClick={createGame}>Create Game</button>
      </div>

      <div>
        <h2>Join Game</h2>
        <select onChange={(e) => setGameId(e.target.value)}>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              Game {game.id}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Bet Amount (in ETH)"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
        <button onClick={joinGame}>Join Game</button>
      </div>

      <div>
        <h2>Flip Coin</h2>
        <button onClick={flipCoin}>Flip Coin</button>
        {gameResult && <p>Game Result: {gameResult}</p>}
        {winner && <p>Winner: {winner}</p>}
      </div>
    </div>
  );
}

export default App;