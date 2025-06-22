document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const loginError = document.getElementById("login-error");
  const loginContainer = document.querySelector(".login-container");
  const gameWrapper = document.getElementById("game-wrapper");
  const controlsWrapper = document.getElementById("controls-wrapper");

  const validUsername = "user";
  const validPassword = "1234";

  loginBtn?.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === validUsername && password === validPassword) {
      localStorage.setItem("isLoggedIn", "true");
      loginContainer.classList.add("hide");
      gameWrapper.classList.remove("hide");
      controlsWrapper.classList.remove("hide");
      logoutBtn.classList.remove("hide");
    } else {
      loginError.textContent = "Invalid credentials.";
    }
  });

  logoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });

  if (localStorage.getItem("isLoggedIn") === "true") {
    loginContainer.classList.add("hide");
    gameWrapper.classList.remove("hide");
    controlsWrapper.classList.remove("hide");
    logoutBtn.classList.remove("hide");
  }

  const moves = document.getElementById("moves-count");
  const timeValue = document.getElementById("time");
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");
  const gameContainer = document.querySelector(".game-container");
  const result = document.getElementById("result");

  let cards;
  let interval;
  let firstCard = false;
  let secondCard = false;
  let firstCardValue = "";

  const items = [
    { name: "bee", image: "bee.png" },
    { name: "crocodile", image: "crocodile.png" },
    { name: "macaw", image: "macaw.png" },
    { name: "gorilla", image: "gorilla.png" },
    { name: "tiger", image: "tiger.png" },
    { name: "monkey", image: "monkey.png" },
    { name: "chameleon", image: "chameleon.png" },
    { name: "piranha", image: "piranha.png" },
    { name: "anaconda", image: "anaconda.png" },
    { name: "sloth", image: "sloth.png" },
    { name: "cockatoo", image: "cockatoo.png" },
    { name: "toucan", image: "toucan.png" },
  ];

  let seconds = 0,
    minutes = 0;
  let movesCount = 0,
    winCount = 0;

  const timeGenerator = () => {
    seconds += 1;
    if (seconds >= 60) {
      minutes += 1;
      seconds = 0;
    }
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
  };

  const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
  };

  const generateRandom = (size = 4) => {
    let tempArray = [...items];
    let cardValues = [];
    size = (size * size) / 2;
    for (let i = 0; i < size; i++) {
      const randomIndex = Math.floor(Math.random() * tempArray.length);
      cardValues.push(tempArray[randomIndex]);
      tempArray.splice(randomIndex, 1);
    }
    return cardValues;
  };

  const addReg = ()=>{}

  const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
      gameContainer.innerHTML += `
       <div class="card-container" data-card-value="${cardValues[i].name}">
          <div class="card-before">?</div>
          <div class="card-after">
          <img src="${cardValues[i].image}" class="image"/></div>
       </div>
       `;
    }
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;
    cards = document.querySelectorAll(".card-container");

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (!card.classList.contains("matched")) {
          card.classList.add("flipped");
          if (!firstCard) {
            firstCard = card;
            firstCardValue = card.getAttribute("data-card-value");
          } else {
            movesCounter();
            secondCard = card;
            let secondCardValue = card.getAttribute("data-card-value");
            if (firstCardValue == secondCardValue) {
              firstCard.classList.add("matched");
              secondCard.classList.add("matched");
              firstCard = false;
              winCount += 1;
              if (winCount == Math.floor(cardValues.length / 2)) {
                result.innerHTML = `<h2>You Won</h2>
              <h4>Moves: ${movesCount}</h4>`;
                stopGame();
              }
            } else {
              let [tempFirst, tempSecond] = [firstCard, secondCard];
              firstCard = false;
              secondCard = false;
              setTimeout(() => {
                tempFirst.classList.remove("flipped");
                tempSecond.classList.remove("flipped");
              }, 900);
            }
          }
        }
      });
    });
  };

  startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    controlsWrapper.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
  });

  stopButton.addEventListener(
    "click",
    (stopGame = () => {
      controlsWrapper.classList.remove("hide");
      stopButton.classList.add("hide");
      startButton.classList.remove("hide");
      clearInterval(interval);
    })
  );

  const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    matrixGenerator(cardValues);
  };
});
