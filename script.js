const inputForFirstNumber = document.getElementById("num1");
const inputForSecondNumber = document.getElementById("num2");
const resultDisplayArea = document.getElementById("result");
const historyDisplayArea = document.getElementById("history");
const calculationButtons = document.querySelectorAll(".calc");
const resetButton = document.getElementById("reset");
const customCursorElement = document.getElementById("customCursor");

function getCalculationHistoryFromStorage() {
  const historyJson = localStorage.getItem("calculationHistory");
  return historyJson ? JSON.parse(historyJson) : [];
}

function saveCalculationToHistory(calculation) {
  const currentHistory = getCalculationHistoryFromStorage();
  currentHistory.push(calculation);
  
  const maxHistoryItems = 5;
  const recentHistory = currentHistory.slice(-maxHistoryItems);
  
  localStorage.setItem("calculationHistory", JSON.stringify(recentHistory));
}

function displayCalculationHistory() {
  const history = getCalculationHistoryFromStorage();
  const historyIsEmpty = history.length === 0;
  
  if (historyIsEmpty) {
    historyDisplayArea.textContent = "📜 אין היסטוריית חישובים";
    return;
  }
  
  const historyText = history.map(item => 
    `${item.num1} ${item.operation} ${item.num2} = ${item.result}`
  ).join(" | ");
  
  historyDisplayArea.textContent = "📜 היסטוריה: " + historyText;
}

function restoreInputValuesFromStorage() {
  const savedFirstNumber = localStorage.getItem("savedNum1");
  const savedSecondNumber = localStorage.getItem("savedNum2");
  
  const firstNumberWasSaved = savedFirstNumber !== null;
  const secondNumberWasSaved = savedSecondNumber !== null;
  
  if (firstNumberWasSaved) {
    inputForFirstNumber.value = savedFirstNumber;
  }
  
  if (secondNumberWasSaved) {
    inputForSecondNumber.value = savedSecondNumber;
  }
}

function saveInputValuesToStorage() {
  const firstNumberValue = inputForFirstNumber.value;
  const secondNumberValue = inputForSecondNumber.value;
  
  localStorage.setItem("savedNum1", firstNumberValue);
  localStorage.setItem("savedNum2", secondNumberValue);
}

function restoreLastResultFromStorage() {
  const lastResultFromStorage = localStorage.getItem("lastResult");
  const userHasPreviousResult = lastResultFromStorage !== null;
  
  if (userHasPreviousResult) {
    resultDisplayArea.textContent = "🔄 התוצאה הקודמת: " + lastResultFromStorage;
  }
}

function restoreLastOperationCursor() {
  const lastOperation = localStorage.getItem("lastOperation");
  const operationWasSaved = lastOperation !== null;
  
  if (operationWasSaved) {
    setCursorEmoji(lastOperation);
  }
}

restoreInputValuesFromStorage();
restoreLastResultFromStorage();
restoreLastOperationCursor();
displayCalculationHistory();

function calculateTwoNumbers(firstNumber, secondNumber, operation) {
  switch(operation) {
    case "+": return firstNumber + secondNumber;
    case "-": return firstNumber - secondNumber;
    case "*": return firstNumber * secondNumber;
    case "/": return secondNumber !== 0 ? firstNumber / secondNumber : "לא ניתן לחלק באפס";
    default: return 0;
  }
}

function updateCursorPosition(mouseEvent) {
  customCursorElement.style.left = mouseEvent.pageX + "px";
  customCursorElement.style.top = mouseEvent.pageY + "px";
}

function animateCursorScaleUp() {
  customCursorElement.style.transform = "translate(-50%, -50%) scale(1.3)";
}

function animateCursorScaleDown() {
  customCursorElement.style.transform = "translate(-50%, -50%) scale(1)";
}

function setCursorEmoji(emoji) {
  customCursorElement.textContent = emoji;
}

function clearCursorEmoji() {
  customCursorElement.textContent = "";
}

document.addEventListener("mousemove", updateCursorPosition);

inputForFirstNumber.addEventListener("input", saveInputValuesToStorage);
inputForSecondNumber.addEventListener("input", saveInputValuesToStorage);

calculationButtons.forEach(button => {
  button.addEventListener("click", () => {
    const firstNumberValue = Number(inputForFirstNumber.value);
    const secondNumberValue = Number(inputForSecondNumber.value);

    const bothNumbersAreValid = !isNaN(firstNumberValue) && !isNaN(secondNumberValue);
    
    if (!bothNumbersAreValid) {
      resultDisplayArea.textContent = "⚠️ נא להזין שני מספרים חוקיים";
      return;
    }

    const selectedOperation = button.dataset.op;
    const calculationResult = calculateTwoNumbers(firstNumberValue, secondNumberValue, selectedOperation);
    
    const resultIsError = typeof calculationResult === "string";
    
    if (resultIsError) {
      resultDisplayArea.textContent = "❌ " + calculationResult;
      return;
    }
    
    resultDisplayArea.textContent = `✅ התוצאה: ${calculationResult}`;
    localStorage.setItem("lastResult", calculationResult);
    
    const calculationRecord = {
      num1: firstNumberValue,
      num2: secondNumberValue,
      operation: selectedOperation,
      result: calculationResult
    };
    
    saveCalculationToHistory(calculationRecord);
    displayCalculationHistory();

    const cursorEmojiForOperation = button.dataset.cursor;
    setCursorEmoji(cursorEmojiForOperation);
    localStorage.setItem("lastOperation", cursorEmojiForOperation);

    animateCursorScaleUp();
    setTimeout(animateCursorScaleDown, 150);
  });
});

resetButton.addEventListener("click", () => {
  inputForFirstNumber.value = "";
  inputForSecondNumber.value = "";
  resultDisplayArea.textContent = "";
  historyDisplayArea.textContent = "";
  
  localStorage.removeItem("lastResult");
  localStorage.removeItem("savedNum1");
  localStorage.removeItem("savedNum2");
  localStorage.removeItem("lastOperation");
  localStorage.removeItem("calculationHistory");
  
  clearCursorEmoji();
});
