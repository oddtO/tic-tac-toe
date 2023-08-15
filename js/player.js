import { arrayMin, arrayMax } from "./minimax.js";
let gameBoardElem = document.querySelector("#game-board");

createPlayer.anonymousPlayersCount = 0;
function createPlayer(name, symbol, isHumanOrAI) {
  let protoHuman = {
    getMove(signal) {
      return new Promise((resolve, reject) => {
        gameBoardElem.addEventListener("click", handleEvent);
        signal.addEventListener("abort", (event) => {
          gameBoardElem.removeEventListener("click", handleEvent);
          reject(event);
        });
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

  let protoAI = {
    getBestOutcome: symbol == "x" ? arrayMax : arrayMin,
    getMove(signal, stateNode) {
      let nextMovesValues = stateNode.children.map((child) => child.data.value);

      let bestValue = this.getBestOutcome(nextMovesValues);
      let bestNode = getNextStateNodeByValue(bestValue);

      return Promise.resolve(bestNode.data.lastMove);

      function getNextStateNodeByValue(value) {
        return stateNode.children.find((child) => {
          return child.data.value == value;
        });
      }
    },
  };
  if (!name) {
    name = "anonymous" + ++createPlayer.anonymousPlayersCount;
  }
  let obj = Object.assign(
    Object.create(isHumanOrAI == "Human" ? protoHuman : protoAI),
    { name, symbol }
  );
  return obj;
}

let playersForm = document.querySelector("body > form");

function waitForPlayersInfo() {
  return new Promise((resolve, reject) => {
    playersForm.addEventListener("submit", extractPlayersInfo);

    function extractPlayersInfo(event) {
      event.preventDefault();

      let playersInfo = [];
      for (let playerInfoHTMLed of playersForm.querySelectorAll(
        "section.input > div:not(#event-shower)"
      )) {
        let nameInputElem =
          playerInfoHTMLed.querySelector('input[type="text"]');
        let isHumanOrAIelem = playerInfoHTMLed.querySelector(
          'fieldset input[type="radio"]:checked'
        );

        let name = nameInputElem.value;
        let isHumanOrAI = isHumanOrAIelem.value;
        playersInfo.push({ name, isHumanOrAI });
      }
      resolve(playersInfo);
    }
  });
}

function writeWhetherHumanOrAI(playersData) {
  let names = document.querySelectorAll("input[id^=player]");
  for (let i = 0; i < playersData.length; ++i) {
    names[i].value =
      playersData[i].name + " (" + playersData[i].isHumanOrAI + ")";
  }
}

function hideWhetherHumanOrAI(playersData) {
  let names = document.querySelectorAll("input[id^=player]");
  for (let i = 0; i < playersData.length; ++i) {
    names[i].value = playersData[i].name;
  }
}

export {
  waitForPlayersInfo,
  writeWhetherHumanOrAI,
  hideWhetherHumanOrAI,
  createPlayer,
};
