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

export function createNode(data) {
  return { data, children: [] };
}

export function generateAllPossibleCombinationsFromState(node) {
  let nextPlayer = node.data.lastPlayer == "x" ? "o" : "x";
  for (let i = 0; i < node.data.state.length; ++i) {
    if (node.data.state[i]) continue;

    let newState = node.data.state.slice();
    newState[i] = nextPlayer;
    node.children.push(
      createNode({ state: newState, lastPlayer: nextPlayer, lastMove: i })
    );

    generateAllPossibleCombinationsFromState(node.children.at(-1));
  }

  return node;
}

export function checkForWinner(gridState, symbol) {
  return WINNING_PATTERNS.find((pattern) => {
    return (
      gridState[pattern[0]] == symbol &&
      gridState[pattern[1]] == symbol &&
      gridState[pattern[2]] == symbol
    );
  });
}

export function checkForTie(gridState) {
  return WINNING_PATTERNS.every((pattern) => {
    let stateOfPatternInGrid = pattern.map((index) => {
      return gridState[index];
    });

    return (
      stateOfPatternInGrid.includes("x") && stateOfPatternInGrid.includes("o")
    );
  });
}
