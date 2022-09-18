import React, { useEffect, useState } from "react";
import { useThrottledCallback } from "use-debounce";

import { useGame } from "./hooks/useGame";
import { Helper } from "../../services/helper";
import { Board, animationDuration, tileCount } from "../Board";
import { useSwipeable } from "react-swipeable";

export const Game = ({ think, setThink, hintAct, setHintAct }: any) => {
  const [tiles, moveLeft, moveRight, moveUp, moveDown] = useGame();
  const [tileCnt, setTileCnt] = useState(0);
  const [hintMode, setHintMode] = useState(false);

  useEffect(() => {
    if (hintAct) {
      switch (think) {
        case "Up ⬆️":
          moveUp();
          break;
        case "Right ➡️":
          moveRight();
          break;
        case "Down ⬇️":
          moveDown();
          break;
        case "Left ⬅️":
          moveLeft();
          break;
      }
      setHintAct(false);
    }
  }, [hintAct, setHintAct, think, moveUp, moveRight, moveDown, moveLeft]);

  useEffect(() => {
    if (setThink) {
      setHintMode(true);
      setTileCnt(tiles.length - 1);
    }
    if (hintMode) {
      // console.log(tiles.length, tileCnt);
      if (tiles.length === tileCnt + 1) {
        // console.log("guess");
        const bestMove = new Helper(tiles).think();
        setThink(bestMove);
      }
      setTileCnt(tiles.length);
    }
  }, [tiles, setThink, tileCnt, hintMode]);

  const handlers = useSwipeable({
    onSwipedLeft: moveLeft,
    onSwipedRight: moveRight,
    onSwipedUp: moveUp,
    onSwipedDown: moveDown,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    // disables page scrolling with keyboard arrows
    e.preventDefault();

    switch (e.code) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowUp":
        moveUp();
        break;
      case "ArrowDown":
        moveDown();
        break;
    }
  };

  // protects the reducer from being flooded with events.
  const throttledHandleKeyDown = useThrottledCallback(
    handleKeyDown,
    animationDuration,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    window.addEventListener("keydown", throttledHandleKeyDown);

    return () => {
      window.removeEventListener("keydown", throttledHandleKeyDown);
    };
  }, [throttledHandleKeyDown]);

  return (
    <>
      <div className="touch-area" {...handlers} />
      {/* <img src={process.env.PUBLIC_URL + "/arrow-up.gif"} alt="up" /> */}
      <Board tiles={tiles} tileCountPerRow={tileCount} />
    </>
  );
};
