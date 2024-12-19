import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(10);
  const [showScore, setShowScore] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);

  const images = [
    "https://www.paloozaland.com/wp-content/uploads/2024/12/mobile.png",
    "https://www.paloozaland.com/wp-content/uploads/2024/12/router.png",
    "https://www.paloozaland.com/wp-content/uploads/2024/12/signal.png",
    "https://www.paloozaland.com/wp-content/uploads/2024/12/smart-car.png",
    "https://www.paloozaland.com/wp-content/uploads/2024/12/smart-home.png",
    "https://www.paloozaland.com/wp-content/uploads/2024/12/smartwatch.png",
    "https://www.paloozaland.com/wp-content/uploads/2024/12/camera.png",
    "https://www.paloozaland.com/wp-content/uploads/2024/12/game-console.png",
  ];

  const startGame = () => {
    document.body.style.background =
      'url("https://www.paloozaland.com/wp-content/uploads/2024/12/Background.png") no-repeat center center fixed';
    document.body.style.backgroundSize = "cover";

    const shuffledCards = [...images, ...images]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({ id: index, image, flipped: true }));

    setCards(shuffledCards);
    setGameStarted(true);
    setPreviewMode(true);
    setPreviewTimeLeft(10);

    const previewTimer = setInterval(() => {
      setPreviewTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(previewTimer);
          setCards((prevCards) =>
            prevCards.map((card) => ({ ...card, flipped: false }))
          );
          setPreviewMode(false);
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
      if (first.image === second.image) {
        setMatched((prev) => [...prev, first.id, second.id]);
        if (matched.length + 2 === cards.length) {
          setShowScore(true);
          return; // Exit early if all pairs are matched
        }
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
      {!gameStarted ? (
        <div className="start-screen">
          <button className="start-button" onClick={startGame}>
            <img
              src="https://www.paloozaland.com/wp-content/uploads/2024/12/Bouton-Start.png"
              alt="Start Game"
              className="start-button-image"
            />
          </button>
        </div>
      ) : (
        <>
          {previewMode ? (
            <div className="preview-container">
              <div className="countdown-wrapper">
                <div className="countdown-background">
                  <p className="countdown-timer">{previewTimeLeft}s</p>
                </div>
              </div>
              <div className="card-grid">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className={`card ${card.flipped ? "flipped" : ""}`}
                  >
                    <div className="front"></div>
                    <div
                      className="back"
                      style={{ backgroundImage: `url(${card.image})` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          ) : !showScore ? (
            <div className="card-grid">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className={`card ${
                    flipped.includes(index) || matched.includes(index)
                      ? "flipped"
                      : ""
                  }`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="front"></div>
                  <div
                    className="back"
                    style={{ backgroundImage: `url(${card.image})` }}
                  ></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="popup">
              <img
                src="https://www.paloozaland.com/wp-content/uploads/2024/12/Num-13.png"
                alt="Congratulations"
                className="popup-image"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;