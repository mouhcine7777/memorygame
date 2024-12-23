import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isFlipping,  setIsFlipping] = useState(false);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(10);
  const [showScore, setShowScore] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);

  const images = [
    "../mobile.png",
    "../router.png",
    "../signal.png",
    "../smart-car.png",
    "../smart-home.png",
    "../smartwatch.png",
    "../camera.png",
    "../game-console.png",
  ];

  const startGame = () => {
    document.body.style.background =
      'url("../Background.png") no-repeat center center fixed';
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
    if (
      isFlipping || 
      flipped.length === 2 || 
      matched.includes(id) || 
      previewMode || 
      flipped.includes(id)
    ) return;

    setIsFlipping(true);
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped.map((idx) => cards[idx]);
      
      setTimeout(() => {
        if (first.image === second.image) {
          setMatched(prev => [...prev, first.id, second.id]);
          setFlipped([]);
          if (matched.length + 2 === cards.length) {
            setShowScore(true);
          }
        }
        setFlipped([]);
        setIsFlipping(false);
      }, 1000);
    } else {
      setIsFlipping(false);
    }
  };

  return (
    <div className="game-container">
      {!gameStarted ? (
        <div className="start-screen">
          <button className="start-button" onClick={startGame}>
            <img
              src="../Bouton-Start.png"
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
                src="../Num13.png"
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