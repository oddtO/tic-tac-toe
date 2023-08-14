let gameBoardElem = document.querySelector("#game-board");

function createPlayer(name, symbol, isAIcontrolled) {
  let protoHuman = {
    getMove() {
      return new Promise((resolve) => {
        gameBoardElem.addEventListener("click", handleEvent);
        function handleEvent(event) {
          let elem = event.target;
          if (elem.tagName != "LI") return;
          let index = elem.dataset.gridIndex;
          gameBoardElem.removeEventListener("click", handleEvent);
          resolve(+index);
        }
      });
    },
  };

  let obj = Object.assign(Object.create(protoHuman), { name, symbol });
  return obj;
}

export default createPlayer;
