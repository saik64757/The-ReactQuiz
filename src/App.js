import Header from "./Components/Header";
import "./App.css";
import Main from "./Components/Main";
import { useEffect, useReducer } from "react";
import Loader from "./Components/Loader";
import Error from "./Components/Error";
import StartScreen from "./Components/StartScreen";
import Questions from "./Components/Questions";
import NextButton from "./Components/NextButton";
import Progress from "./Components/Progress";
import Finnished from "./Components/Finnished";
import Timer from "./Components/Timer";
import Footer from "./Components/Footer";

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

const SECS = 30;

function reducer(state, action) {
  switch (action.type) {
    case "dataRecevied":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "fetchFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };
    case "finnish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "nextQuestion":
      return {
        ...state,
        answer: null,
        index: state.index + 1,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "newAnswer":
      const Question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === Question.correctOption
            ? state.points + Question.points
            : state.points,
      };
    default:
      throw new Error("Action Unknown");
  }
}

function App() {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestion = questions.length;
  const MaxPoints =
    questions.length > 0
      ? questions.reduce((acc, curr) => {
          return (acc += curr.points);
        }, 0)
      : null;

  useEffect(() => {
    async function fetchData() {
      try {
        let data = await fetch("http://localhost:8000/questions");
        let res = await data.json();
        dispatch({ type: "dataRecevied", payload: res });
      } catch (err) {
        dispatch({ type: "fetchFailed" });
        throw new Error(err.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestion={numQuestion} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestion}
              points={points}
              MaxPoints={MaxPoints}
              answer={answer}
            />
            <Questions
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestion}
                index={index}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <Finnished
            points={points}
            MaxPoints={MaxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
