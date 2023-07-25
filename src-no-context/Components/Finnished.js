import React from "react";

function Finnished({ points, MaxPoints, highScore, dispatch }) {
  const percentage = (points / MaxPoints) * 100;
  return (
    <>
      <p className="result">
        You Scored <strong>{points}</strong> Out of {MaxPoints} (
        {Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(HighScore is now {highScore})</p>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "restart" });
        }}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default Finnished;
