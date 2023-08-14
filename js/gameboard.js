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
    checkForGameEnd(player) {
      if (this.checkForWinner(player)) {
        alert(player.name);
        resetGame();
      } else if (this.checkForTie()) {
        alert("tie");
        resetGame();
      }
    },
  };

  let gameBoardElem = document.querySelector("#game-board");

  return { initGame, render, playGame };

  async function playGame() {
    for (let player of players) {
      let index = await getLegalMove(player);
      gridState[index] = player.symbol;
      render();
      players.checkForGameEnd(player);
    }

    async function getLegalMove(player) {
      let index = null;
      do {
        index = await player.getMove();
      } while (gridState[index]);
      return index;
    }
  }

  function initGame(playerOne, playerTwo) {
    players = { ...players, playerOne, playerTwo };
    resetGame();
  }

  function resetGame() {
    players.turnCount = 0;
    gridState = gridState.fill("");
    render();
  }

  function render() {
    for (let i = 0; i < gridState.length; ++i) {
      gameBoardElem.children[i].className = gridState[i];
    }
  }
})();
