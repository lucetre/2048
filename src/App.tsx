import React, { useState } from "react";
import { Button } from "./components/Button";
import { Game } from "./components/Game";

import "./App.less";

/* eslint-disable react/jsx-no-target-blank */
export const App = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [think, setThink] = useState<string>("Think");
  const [hintAct, setHintAct] = useState<boolean>(false);

  const handleThink = () => {
    alert("Let me give you some hints!");
    setThink("");
  };

  const handleHint = () => {
    setHintAct(true);
  };

  const handleReset = () => {
    setDate(new Date());
    setThink("Think");
    setHintAct(false);
  };

  return (
    <div className="App">
      <div className="header">
        <div>
          <h1>Play 2048</h1>
        </div>
        <div className="button-area">
          <Button onClick={think === "Think" ? handleThink : handleHint}>
            {think}
          </Button>
        </div>
        <div className="button-area">
          <Button onClick={handleReset}>Reset</Button>
        </div>
      </div>
      <Game
        key={date.toISOString()}
        think={think}
        setThink={think === "Think" ? null : setThink}
        hintAct={hintAct}
        setHintAct={setHintAct}
      />
    </div>
  );
};
/* eslint-enable react/jsx-no-target-blank */
