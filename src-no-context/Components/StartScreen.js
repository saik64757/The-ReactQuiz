import React from "react";

function StartScreen({ numQuestion, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to React Mastery</h2>
      <h3>{numQuestion} Questions to test your react Mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Lets Start
      </button>
    </div>
  );
}

export default StartScreen;
