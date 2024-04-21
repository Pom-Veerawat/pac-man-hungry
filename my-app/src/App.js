import React, { useState, useEffect } from 'react';

const GameSettingsModal = ({ onStartGame }) => {
  const [playerNames, setPlayerNames] = useState([]);
  const [velocity, setVelocity] = useState({ x: 10, y: 10 });

  const handlePlayerNameChange = (index, newName) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = newName;
    setPlayerNames(newPlayerNames);
  };

  const handleStartGame = () => {
    onStartGame(playerNames, velocity);
  };

  return (
    <div className="modal">
      {Array.from({ length: 25 }, (_, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Enter player ${index + 1} name`}
          value={playerNames[index] || ''}
          onChange={(e) => handlePlayerNameChange(index, e.target.value)}
        />
      ))}
      <input
        type="number"
        placeholder="Enter horizontal velocity"
        value={velocity.x}
        onChange={(e) => setVelocity({ ...velocity, x: parseInt(e.target.value, 10) })}
      />
      <input
        type="number"
        placeholder="Enter vertical velocity"
        value={velocity.y}
        onChange={(e) => setVelocity({ ...velocity, y: parseInt(e.target.value, 10) })}
      />
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
};

const GameBoard = ({ players, initialVelocity, onGameOver }) => {
  const [pacmanPosition, setPacmanPosition] = useState({ x: 0, y: 0 });
  const [remainingPlayers, setRemainingPlayers] = useState(players);
  const [velocity, setVelocity] = useState(initialVelocity);

  useEffect(() => {
    const movePacman = () => {
      let nextX = pacmanPosition.x + velocity.x;
      let nextY = pacmanPosition.y + velocity.y;

      // Check for boundary collision
      if (nextX <= 0 || nextX >= 800) {
        setVelocity((prev) => ({ ...prev, x: -prev.x }));
        nextX = pacmanPosition.x;
      }
      if (nextY <= 0 || nextY >= 800) {
        setVelocity((prev) => ({ ...prev, y: -prev.y }));
        nextY = pacmanPosition.y;
      }

      // Check if Pacman eats a player
      const eatenPlayerIndex = remainingPlayers.findIndex((player) =>
        Math.abs(player.position.x - nextX) < 10 && Math.abs(player.position.y - nextY) < 10
      );
      if (eatenPlayerIndex !== -1) {
        const newPlayers = remainingPlayers.filter((_, index) => index !== eatenPlayerIndex);
        setRemainingPlayers(newPlayers);
        // Increase Pac-Man's speed
        setVelocity((prev) => ({ x: prev.x * 1.1, y: prev.y * 1.1 }));
      }

      setPacmanPosition({ x: nextX, y: nextY });

      // Stop the game if only one player is left
      if (remainingPlayers.length === 1) {
        onGameOver(remainingPlayers[0]);
      }
    };

    const intervalId = setInterval(movePacman, 1000);

    return () => clearInterval(intervalId);
  }, [pacmanPosition, remainingPlayers, onGameOver, velocity]);

  return (
    <div style={{ width: '800px', height: '800px', position: 'relative' }}>
      {remainingPlayers.map((player, index) => (
        <div
          key={index}
          style={{ position: 'absolute', left: player.position.x, top: player.position.y }}
        >
          {player.name}
        </div>
      ))}
      <div
        style={{ position: 'absolute', left: pacmanPosition.x, top: pacmanPosition.y }}
      >
        Pac-Man
      </div>
    </div>
  );
};

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameVelocity, setGameVelocity] = useState({ x: 10, y: 10 });

  const handleGameOver = (winner) => {
    alert(`Game Over! The winner is ${winner.name}`);
    setGameStarted(false);
  };

  const handleStartGame = (playerNames, velocity) => {
    const initialPlayers = playerNames.map((name, index) => ({
      name: name || `Player ${index + 1}`,
      position: { x: Math.random() * 800, y: Math.random() * 800 },
    }));
    setPlayers(initialPlayers);
    setGameVelocity(velocity);
    setGameStarted(true);
  };

  return (
    <div>
      {!gameStarted && <GameSettingsModal onStartGame={handleStartGame} />}
      {gameStarted && <GameBoard players={players} initialVelocity={gameVelocity} onGameOver={handleGameOver} />}
    </div>
  );
};

export default App;
