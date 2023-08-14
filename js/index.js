import { gameBoard } from "./gameboard.js";
import { waitForPlayersInfo, createPlayer } from "./player.js";

gameBoard.initGame(
  createPlayer("test1", "x", false),
  createPlayer("test2", "o", false)
);

gameBoard.playGame();


waitForPlayersInfo().then((playersData) => {

	console.log(playersData);
});
