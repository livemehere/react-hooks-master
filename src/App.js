import "./App.css";
import React, { useState, useEffect, useRef } from "react";

const useClick = (onClickFn) => {
  const element = useRef();

  useEffect(() => {
    element.current.addEventListener("click", () => {
      onClickFn();
    });

    return () => {
      element.current.removeEventListener("click", () => {
        onClickFn();
      });
    };
  }, []);

  return element;
};

function App() {
  const clickRef = useClick(() => console.log("hi"));

  return (
    <div className="App">
      <h1 ref={clickRef}>HELLO Click</h1>
    </div>
  );
}

export default App;
