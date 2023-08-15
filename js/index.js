import { gameBoard } from "./gameboard.js";
import {
  waitForPlayersInfo,
  writeWhetherHumanOrAI,
  hideWhetherHumanOrAI,
  createPlayer,
} from "./player.js";

import {
  createNode,
  generateAllPossibleCombinationsFromState,
} from "./minimax.js";
/* gameBoard.initGame(
  createPlayer("test1", "x", false),
  createPlayer("test2", "o", false)
); */

/* gameBoard.playGame(); */

let nodeTree = generateAllPossibleCombinationsFromState(
  createNode({
    state: ["", "", "", "", "", "", "", "", ""],
    lastPlayer: "o",
    lastMove: null,
  })
);


console.log(nodeTree);

(async () => {
  while (true) {
    let playersData = await waitForPlayersInfo();

    writeWhetherHumanOrAI(playersData);
    gameBoard.initGame(
      createPlayer(playersData[0].name, "x", playersData[0].isHumanOrAI),

      createPlayer(playersData[1].name, "o", playersData[1].isHumanOrAI)
    );

    await gameBoard.playGame();
    hideWhetherHumanOrAI(playersData);
  }
})();

waitForPlayersInfo().then(async (playersData) => {});
