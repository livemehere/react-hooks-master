import "./App.css";
import React, { useState, useEffect, useRef } from "react";

const useBeforeLeave = (callback) => {
  const handle = (e) => {
    const { clientY } = e;
    if (clientY <= 0) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  }, []);
};

function App() {
  useBeforeLeave(() => console.log("dont leave.."));
  return (
    <div className="App">
      <h1>Mouse Leave event</h1>
    </div>
  );
}

export default App;
