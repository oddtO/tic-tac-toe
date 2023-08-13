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
        return this.playerOne;
      } else {
        return this.playerTwo;
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
  };

  let gameBoardElem = document.querySelector("#game-board");
  gameBoardElem.addEventListener("click", handleEvent);

  return { startGame, render };

  function handleEvent(event) {
    let elem = event.target;
    if (elem.tagName != "LI") return;
    let index = elem.dataset.gridIndex;

    if (gridState[index]) return;
    let currentPlayer = players.next();
    gridState[index] = currentPlayer.symbol;
    elem.className = gridState[index];

    if (players.checkForWinner(currentPlayer)) {
      alert(currentPlayer.name);
      resetGame();
    } else if (players.checkForTie()) {
      alert("tie");
      resetGame();
    }
  }

  function startGame(playerOne, playerTwo) {
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
