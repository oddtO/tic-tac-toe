let gameBoardElem = document.querySelector("#game-board");

createPlayer.anonymousPlayersCount = 0;
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

  if (!name) {
    name = "anonymous" + ++createPlayer.anonymousPlayersCount;
  }
  let obj = Object.assign(Object.create(protoHuman), { name, symbol });
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

export { waitForPlayersInfo, createPlayer };
