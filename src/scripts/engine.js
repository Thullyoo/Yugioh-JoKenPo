const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
  playerSides: {
    player1: "player-cards",
    playerBOX: document.querySelector("#player-cards"),
    computerBOX: document.querySelector("#computer-cards"),
    computer: "computer-cards",
  },
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];


async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}


async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png ");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(IdCard);
    });
  }

  return cardImage;
}


async function setCardsField(id) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();
  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardData[id].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResult = await checkDuelResult(id, computerCardId);

  await updateScore();
  await drawButton(duelResult);
}


async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  state.cardSprites.name.innerText = "Escolha";
  state.cardSprites.type.innerText = 'Sua carta';
  init();
}


async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
  if (state.score.playerScore === 10){
    window.alert("Você Ganhou, Parabéns!!!");
    state.score.playerScore = 0;
    state.score.computerScore = 0;
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
  } else if(state.score.computerScore === 10){
    window.alert("Você Perdeu, Boa sorte na próxima!!!");
    state.score.playerScore = 0;
    state.score.computerScore = 0;
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
  }
}


async function drawButton(duelResult) {
  state.actions.button.innerText = duelResult.toUpperCase();
  state.actions.button.style.display = "block";
}


async function checkDuelResult(idplayer, computerid) {
  let duelResult = "draw";
  let playerCard = cardData[idplayer];

  if (playerCard.winOf.includes(computerid)) {
    duelResult = "win";
    state.score.playerScore++;
  }
  if (playerCard.loseOf.includes(computerid)) {
    duelResult = "lose";
    state.score.computerScore++;
  }
  await playAudio(duelResult);
  return duelResult;
}


async function removeAllCardsImages() {
  let cards = state.playerSides.computerBOX;
  let imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  cards = state.playerSides.playerBOX;
  imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}


async function drawSelectCard(id) {
  state.cardSprites.avatar.src = cardData[id].img;
  state.cardSprites.name.innerText = cardData[id].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[id].type;
}


async function drawCardS(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}


async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.volume = 0.3;
  audio.play();
}


function init() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  drawCardS(5, state.playerSides.player1);
  drawCardS(5, state.playerSides.computer);

  const bgm = document.getElementById("bgm");
  bgm.volume = 0.4
  bgm.play();
}


init();
