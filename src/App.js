import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(10);
  const [gameTimeLeft, setGameTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);

  let gameTimer;

  // Replace image URLs with color codes
  const colors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#000000", // Black
    "#808080", // Gray
  ];

  const startGame = () => {
    const shuffledCards = [...colors, ...colors]
      .sort(() => Math.random() - 0.5)
      .map((color, index) => ({ id: index, color, flipped: true }));
    setCards(shuffledCards);
    setGameStarted(true);
    setPreviewMode(true);

    const previewTimer = setInterval(() => {
      setPreviewTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(previewTimer);
          setCards((prevCards) =>
            prevCards.map((card) => ({ ...card, flipped: false }))
          );
          setPreviewMode(false);
          startGameTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGameTimer = () => {
    if (gameTimer) {
      clearInterval(gameTimer);
    }

    gameTimer = setInterval(() => {
      setGameTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(gameTimer);
          setShowScore(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCardClick = (id) => {
    if (isFlipping || flipped.length === 2 || matched.includes(id) || previewMode) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped.map((idx) => cards[idx]);
      if (first.color === second.color) {
        setMatched((prev) => [...prev, first.id, second.id]);
        setScore((prev) => prev + 1);
      }
      setIsFlipping(true);
      setTimeout(() => {
        setFlipped([]);
        setIsFlipping(false);
      }, 1000);
    }
  };

  return (
    <div className="game-container">
      <img
        src="https://www.paloozaland.com/wp-content/uploads/2024/12/Proposition-06__1_-removebg-preview-1.png"
        alt="Memory Matching Game Logo"
        className="game-logo"
      />
      {!gameStarted ? (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      ) : !showScore ? (
        <>
          <p>
            {previewMode
              ? `Preview Time Left: ${previewTimeLeft}s`
              : `Game Time Left: ${gameTimeLeft}s`}
          </p>
          <div className="card-grid">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`card ${
                  flipped.includes(index) ||
                  matched.includes(index) ||
                  card.flipped
                    ? "flipped"
                    : ""
                }`}
                onClick={() => handleCardClick(index)}
              >
                <div className="front"></div>
                <div
                  className="back"
                  style={{
                    backgroundColor: card.color, // Use color as background
                  }}
                ></div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="score-board">
          <h2>Game Over</h2>
          <p>Your Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default App;