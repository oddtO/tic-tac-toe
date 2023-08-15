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


function createNode(data) {
  return { data, children: [] };
}

function generateAllPossibleCombinationsFromState(node) {
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

function assignValuesToPossibleOutcomes(node) {
  const X_WINNING_VALUE = 10;
  const O_WINNING_VALUE = -10;
  const TIE_VALUE = 0;
  let currentState = node.data.state;
  if (checkForTie(currentState)) {
    node.data.value = TIE_VALUE;
    return node.data.value;
  } else if (checkForWinner(currentState, node.data.lastPlayer)) {
    node.data.value =
      node.data.lastPlayer == "x" ? X_WINNING_VALUE : O_WINNING_VALUE;
    return node.data.value;
  } else {
    let childrenValues = [];
    for (let child of node.children) {
      childrenValues.push(assignValuesToPossibleOutcomes(child));
    }
    let getBestOutcome = node.data.lastPlayer == "x" ? arrayMin : arrayMax;

    node.data.value = getBestOutcome(childrenValues);
    return node.data.value;
  }
}

export function minimax_init() {
  let nodeTree = generateAllPossibleCombinationsFromState(
    createNode({
      state: ["", "", "", "", "", "", "", "", ""],
      lastPlayer: "o",
      lastMove: null,
    })
  );

  assignValuesToPossibleOutcomes(nodeTree);
  return nodeTree;
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



export function arrayMin(arr) {
  var len = arr.length,
    min = Infinity;
  while (len--) {
    if (arr[len] < min) {
      min = arr[len];
    }
  }
  return min;
}

export function arrayMax(arr) {
  var len = arr.length,
    max = -Infinity;
  while (len--) {
    if (arr[len] > max) {
      max = arr[len];
    }
  }
  return max;
}
