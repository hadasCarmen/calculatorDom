const pointsDisplay = document.getElementById("points");
const bestScoreDisplay = document.getElementById("bestScore");
const welcomeMessageDisplay = document.getElementById("welcomeMessage");
const guessInput = document.getElementById("guessInput");
const checkButton = document.getElementById("checkBtn");
const messageDisplay = document.getElementById("message");
const guessHistoryDisplay = document.getElementById("guessHistory");
const playAgainButton = document.getElementById("playAgainBtn");
const minRangeInput = document.getElementById("minRange");
const maxRangeInput = document.getElementById("maxRange");
const maxGuessesInput = document.getElementById("maxGuesses");
const applySettingsButton = document.getElementById("applySettings");
const rangeMinDisplay = document.getElementById("rangeMin");
const rangeMaxDisplay = document.getElementById("rangeMax");

let secretNumber;
let pointsRemaining;
let guessHistory = [];
let gameIsActive = true;
let currentMinRange = 1;
let currentMaxRange = 30;
let currentMaxGuesses = 10;

function getRandomNumberBetweenRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getBestScoreFromStorage() {
  const storedBestScore = localStorage.getItem("guessingGameBestScore");
  return storedBestScore ? parseInt(storedBestScore) : 0;
}

function saveBestScoreToStorage(score) {
  const currentBestScore = getBestScoreFromStorage();
  const newScoreIsBetter = score > currentBestScore;
  
  if (newScoreIsBetter) {
    localStorage.setItem("guessingGameBestScore", score.toString());
  }
}

function checkIfUserHasPlayedBefore() {
  const hasPlayedBefore = localStorage.getItem("guessingGameHasPlayed");
  return hasPlayedBefore === "true";
}

function markUserAsHavingPlayedBefore() {
  localStorage.setItem("guessingGameHasPlayed", "true");
}

function displayWelcomeMessageForReturningUser() {
  const userHasPlayedBefore = checkIfUserHasPlayedBefore();
  
  if (userHasPlayedBefore) {
    welcomeMessageDisplay.textContent = "🎉 ברוך שובך! שמחים לראות אותך שוב!";
  }
}

function getSavedSettingsFromStorage() {
  const savedMinRange = localStorage.getItem("guessingGameMinRange");
  const savedMaxRange = localStorage.getItem("guessingGameMaxRange");
  const savedMaxGuesses = localStorage.getItem("guessingGameMaxGuesses");
  
  return {
    minRange: savedMinRange ? parseInt(savedMinRange) : 1,
    maxRange: savedMaxRange ? parseInt(savedMaxRange) : 30,
    maxGuesses: savedMaxGuesses ? parseInt(savedMaxGuesses) : 10
  };
}

function saveSettingsToStorage() {
  localStorage.setItem("guessingGameMinRange", currentMinRange.toString());
  localStorage.setItem("guessingGameMaxRange", currentMaxRange.toString());
  localStorage.setItem("guessingGameMaxGuesses", currentMaxGuesses.toString());
}

function applyStoredSettingsToGame() {
  const savedSettings = getSavedSettingsFromStorage();
  
  currentMinRange = savedSettings.minRange;
  currentMaxRange = savedSettings.maxRange;
  currentMaxGuesses = savedSettings.maxGuesses;
  
  minRangeInput.value = currentMinRange;
  maxRangeInput.value = currentMaxRange;
  maxGuessesInput.value = currentMaxGuesses;
  
  updateRangeDisplay();
}

function updateRangeDisplay() {
  rangeMinDisplay.textContent = currentMinRange;
  rangeMaxDisplay.textContent = currentMaxRange;
  guessInput.min = currentMinRange;
  guessInput.max = currentMaxRange;
}

function initializeNewGame() {
  secretNumber = getRandomNumberBetweenRange(currentMinRange, currentMaxRange);
  pointsRemaining = currentMaxGuesses;
  guessHistory = [];
  gameIsActive = true;
  
  pointsDisplay.textContent = pointsRemaining;
  messageDisplay.textContent = "";
  messageDisplay.className = "message";
  guessHistoryDisplay.innerHTML = "";
  guessInput.value = "";
  guessInput.disabled = false;
  checkButton.disabled = false;
  
  console.log(`🔍 משחק חדש התחיל! המספר הסודי הוא: ${secretNumber}`);
}

function addGuessToHistory(guess) {
  guessHistory.push(guess);
  
  const guessItemElement = document.createElement("div");
  guessItemElement.className = "guess-item";
  guessItemElement.textContent = guess;
  
  guessHistoryDisplay.appendChild(guessItemElement);
}

function decreasePointsByOne() {
  pointsRemaining--;
  pointsDisplay.textContent = pointsRemaining;
}

function disableGameInputs() {
  guessInput.disabled = true;
  checkButton.disabled = true;
  gameIsActive = false;
}

function displayWrongGuessMessage() {
  messageDisplay.textContent = "❌ ניחוש לא נכון! נסה שוב";
  messageDisplay.className = "message wrong";
}

function displayCorrectGuessMessage() {
  messageDisplay.textContent = `🎉 ניחוש נכון! המספר היה ${secretNumber}`;
  messageDisplay.className = "message correct";
}

function displayGameOverMessage() {
  messageDisplay.textContent = `😢 המשחק נגמר! המספר היה ${secretNumber}`;
  messageDisplay.className = "message game-over";
}

function handleCorrectGuess() {
  displayCorrectGuessMessage();
  disableGameInputs();
  saveBestScoreToStorage(pointsRemaining);
  updateBestScoreDisplay();
  markUserAsHavingPlayedBefore();
}

function handleWrongGuess() {
  displayWrongGuessMessage();
  decreasePointsByOne();
  
  const playerRanOutOfPoints = pointsRemaining === 0;
  
  if (playerRanOutOfPoints) {
    displayGameOverMessage();
    disableGameInputs();
    markUserAsHavingPlayedBefore();
  }
}

function checkPlayerGuess() {
  const playerGuessValue = parseInt(guessInput.value);
  
  const guessIsNotAValidNumber = isNaN(playerGuessValue);
  const guessIsOutsideAllowedRange = playerGuessValue < currentMinRange || playerGuessValue > currentMaxRange;
  
  if (guessIsNotAValidNumber || guessIsOutsideAllowedRange) {
    messageDisplay.textContent = `⚠️ נא להזין מספר תקין בין ${currentMinRange} ל-${currentMaxRange}`;
    messageDisplay.className = "message wrong";
    return;
  }
  
  addGuessToHistory(playerGuessValue);
  guessInput.value = "";
  
  const guessIsCorrect = playerGuessValue === secretNumber;
  
  if (guessIsCorrect) {
    handleCorrectGuess();
  } else {
    handleWrongGuess();
  }
}

function updateBestScoreDisplay() {
  const bestScore = getBestScoreFromStorage();
  bestScoreDisplay.textContent = bestScore;
}

function applyNewSettingsToGame() {
  const newMinRange = parseInt(minRangeInput.value);
  const newMaxRange = parseInt(maxRangeInput.value);
  const newMaxGuesses = parseInt(maxGuessesInput.value);
  
  const minRangeIsInvalid = isNaN(newMinRange) || newMinRange < 1;
  const maxRangeIsInvalid = isNaN(newMaxRange) || newMaxRange < 2;
  const maxGuessesIsInvalid = isNaN(newMaxGuesses) || newMaxGuesses < 1;
  const rangeIsInvalid = newMaxRange <= newMinRange;
  
  if (minRangeIsInvalid || maxRangeIsInvalid || maxGuessesIsInvalid || rangeIsInvalid) {
    alert("⚠️ נא להזין הגדרות תקינות! המקסימום חייב להיות גדול מהמינימום");
    return;
  }
  
  currentMinRange = newMinRange;
  currentMaxRange = newMaxRange;
  currentMaxGuesses = newMaxGuesses;
  
  updateRangeDisplay();
  saveSettingsToStorage();
  initializeNewGame();
  
  messageDisplay.textContent = "✅ הגדרות עודכנו! משחק חדש התחיל";
  messageDisplay.className = "message correct";
  
  setTimeout(() => {
    messageDisplay.textContent = "";
    messageDisplay.className = "message";
  }, 2000);
}

checkButton.addEventListener("click", () => {
  const gameIsNotActive = !gameIsActive;
  
  if (gameIsNotActive) {
    return;
  }
  
  checkPlayerGuess();
});

guessInput.addEventListener("keypress", (event) => {
  const enterKeyWasPressed = event.key === "Enter";
  
  if (enterKeyWasPressed && gameIsActive) {
    checkPlayerGuess();
  }
});

playAgainButton.addEventListener("click", () => {
  initializeNewGame();
});

applySettingsButton.addEventListener("click", () => {
  applyNewSettingsToGame();
});

applyStoredSettingsToGame();
displayWelcomeMessageForReturningUser();
updateBestScoreDisplay();
initializeNewGame();
