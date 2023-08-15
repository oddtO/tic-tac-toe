import { minimax_init, checkForWinner, checkForTie } from "./minimax.js";
const WINNING_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 4, 8],
  [2, 4, 6],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

const gridStateMotherNode = minimax_init();

let messages = document.querySelector("#event-shower");
export let gameBoard = (function () {
  let gridStateTree = null;
  let players = {
    turnCount: 0,
    playerOne: null,
    playerTwo: null,
    [Symbol.iterator]() {
      return this;
    },
    next() {
      ++this.turnCount;
      if (this.turnCount % 2) {
        return { done: false, value: this.playerOne };
      } else {
        return { done: false, value: this.playerTwo };
      }
    },
    checkForGameEndAndAct(player) {
      if (
        checkForWinner(
          gridStateTree.data.state,
          player.symbol
        ) /* this.checkForWinner(player) */
      ) {
        messages.textContent = `${player.name} (${player.symbol}) HAS WON!`;
        playersForm.classList.remove("game-running");
        return true;
      } else if (
        checkForTie(gridStateTree.data.state) /* this.checkForTie() */
      ) {
        messages.textContent = `TIE!`;
        playersForm.classList.remove("game-running");
        return true;
      }
      return false;
    },
  };

  let gameBoardElem = document.querySelector("#game-board");
  let playersForm = document.querySelector("body > form");
  playersForm.addEventListener("reset", (event) => {
    event.preventDefault();
    resetGame();
  });

  let abortController = new AbortController();
  return { initGame, playGame };

  async function playGame() {
    for (let player of players) {
      messages.textContent = `${player.name} (${player.symbol}) is making his move!`;
      let index = null;
      try {
        index = await getLegalMove(player);
      } catch (error) {
        if (error.type == "abort") continue;
        throw error;
      }
      // gridState[index] = player.symbol;
      gridStateTree = getNextStateNode(index);
      render();
      if (players.checkForGameEndAndAct(player)) break;
    }

    function getNextStateNode(index) {
      return gridStateTree.children.find((child) => {
        return child.data.lastMove == index;
      });
    }
    async function getLegalMove(player) {
      let index = null;
      do {
        index = await player.getMove(abortController.signal, gridStateTree);
      } while (gridStateTree.data.state[index]);
      return index;
    }
  }

  function initGame(playerOne, playerTwo) {
    resetGame();
    playersForm.classList.add("game-running");
    players = { ...players, playerOne, playerTwo };
  }

  function resetGame() {
    gridStateTree = gridStateMotherNode;
    players.turnCount = 0;
    render();
    abortController.abort();
    abortController = new AbortController();
  }

  function render() {
    for (let i = 0; i < gridStateTree.data.state.length; ++i) {
      // gameBoardElem.children[i].className = gridState[i];
      gameBoardElem.children[i].className = gridStateTree.data.state[i];
    }
  }
})();
