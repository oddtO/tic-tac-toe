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




