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

let messages = document.querySelector("#event-shower");
export let gameBoard = (function () {
  let gridState = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = null;
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
    checkForWinner(playerToCheck) {
      let symbol = playerToCheck.symbol;
      return WINNING_PATTERNS.find((pattern) => {
        return (
          gridState[pattern[0]] == symbol &&
          gridState[pattern[1]] == symbol &&
          gridState[pattern[2]] == symbol
        );
      });
    },

    checkForTie() {
      return WINNING_PATTERNS.every((pattern) => {
        let stateOfPatternInGrid = pattern.map((index) => {
          return gridState[index];
        });

        return (
          stateOfPatternInGrid.includes(this.playerOne.symbol) &&
          stateOfPatternInGrid.includes(this.playerTwo.symbol)
        );
      });
    },
    checkForGameEndAndAct(player) {
      if (this.checkForWinner(player)) {
        messages.textContent = `${player.name} (${player.symbol}) HAS WON!`;
        playersForm.classList.remove("game-running");
        return true;
      } else if (this.checkForTie()) {
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
  return { initGame, render, playGame };

  async function playGame() {
    for (let player of players) {
      messages.textContent = `${player.name} (${player.symbol}) is making his move!`;
      let index = null;
      try {
        index = await getLegalMove(player);
      } catch (error) {
        continue;
      }
      gridState[index] = player.symbol;
      render();
      if (players.checkForGameEndAndAct(player)) break;
    }

    async function getLegalMove(player) {
      let index = null;
      do {
        index = await player.getMove(abortController.signal);
      } while (gridState[index]);
      return index;
    }
  }

  function initGame(playerOne, playerTwo) {
    resetGame();
    playersForm.classList.add("game-running");
    players = { ...players, playerOne, playerTwo };
  }

  function resetGame() {
    players.turnCount = 0;
    gridState = gridState.fill("");
    render();
    abortController.abort();
	abortController = new AbortController();
  }

  function render() {
    for (let i = 0; i < gridState.length; ++i) {
      gameBoardElem.children[i].className = gridState[i];
    }
  }
})();
