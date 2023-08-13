import { gameBoard } from "./gameboard.js";
import createPlayer from "./player.js";

gameBoard.startGame(
  createPlayer("test1", "x", false),
  createPlayer("test2", "o", false)
);
