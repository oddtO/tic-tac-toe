import { gameBoard } from "./gameboard.js";
import createPlayer from "./player.js";

gameBoard.initGame(
  createPlayer("test1", "x", false),
  createPlayer("test2", "o", false)
);

gameBoard.playGame();
