//* Renderizar todos os quizzes - TELA 1 *//

let renderQuizz = [];

const promise = axios.get(
  "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
);
promise.then(renderQuizzOnScreen);
promise.catch(errorScreen);

function renderQuizzOnScreen(response) {
  renderQuizz = response.data;
  const render = document.querySelector(".all-quizzes");

  for (let i = 0; i < renderQuizz.length; i++) {
    render.innerHTML += `
      <div onclick="openQuizz(this)" class="one-quizz">
        <img src="${renderQuizz[i].image}" class="img-quizzes" id="${renderQuizz[i].id}" /> 
        <h1 class="name-quizzes">${renderQuizz[i].title}</h1>
      </div>`;
  }
}

function errorScreen(error) {
  console.log(error.data);
}

//* Tela 1 -> Tela 3 *//

function createQuizz() {
  document.querySelector(".quizz-basic-information").classList.remove("hide");
  document.querySelector(".list-quizzes").classList.add("hide");
  document.querySelector(".all-quizzes").classList.add("hide");
}

//* Tela 2*//

function openQuizz(quizzDiv) {
  const quizzImage = quizzDiv.querySelector("img");
  const quizzID = quizzImage.id;

  const homePage = document.querySelector(".home-screen");
  const playQuizzPage = document.querySelector(".playquizz-page.hide");

  if (homePage !== null) {
    playQuizzPage.classList.remove("hide");
    homePage.classList.add("hide");
  }

  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0;

  const promise = axios.get(
    `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzID}`
  );
  promise.then(renderOneQuizz);
  promise.catch(errorScreen);
}

let numberOfQuestions = 0;
let scoreLevelsArray = [];
function renderOneQuizz(selectedQuizz) {
  const infoQuizz = selectedQuizz.data;
  const quizzQuestions = infoQuizz.questions;
  numberOfQuestions = quizzQuestions.length;
  const quizzTitle = infoQuizz.title; // RETORNA STRING
  const quizzImg = infoQuizz.image; // RETORNA URL DA IMAGEM
  const scoreLevels = infoQuizz.levels; // RETORNA ARRAY
  scoreLevelsArray = scoreLevels;

  renderQuizzBanner(quizzTitle, quizzImg);
  quizzQuestions.forEach(renderOneQuestionContainer);
}

function renderQuizzBanner(quizzTitle, quizzImg) {
  const quizzTitleText = document.querySelector(".quizz-title-container span");
  const quizzTitleImg = document.querySelector(".quizz-title-container img");

  if (quizzTitleText !== null || quizzTitleImg !== null) {
    quizzTitleText.innerHTML = quizzTitle;
    quizzTitleImg.src = quizzImg;
  }
}

function renderOneQuestionContainer(quizzQuestion) {
  const allQuestionsContainer = document.querySelector(
    ".all-questions-container"
  );
  let answers = quizzQuestion.answers;
  answers.sort(sortArray);
  let backgroungColor = quizzQuestion.color;
  let questionContainerInnerHTML;
  let answerContainerInnerHTML = "";

  questionContainerInnerHTML = `<div class="question-title" style="background-color: ${backgroungColor}">
  <p>${quizzQuestion.title}</p>
</div>`;

  for (let i = 0; i < answers.length; i++) {
    let option = answers[i].text;
    let optionImg = answers[i].image;
    let isCorrectAnswer = answers[i].isCorrectAnswer;

    answerContainerInnerHTML += `<div onclick="selectMyAnswer(this)" class="answer ${isCorrectAnswer}">
    <img src="${optionImg}" />
    <p>${option}</p>
    </div>`;
  }

  allQuestionsContainer.innerHTML += `
  <div class="question-container not-answered">
    <div class="question-title-container">
      ${questionContainerInnerHTML}
    </div>
    <div class="answers-container">
      ${answerContainerInnerHTML}
    </div>
  </div>`;
}

function sortArray() {
  return Math.random() - 0.5;
}

let rightAnswers = 0;
function selectMyAnswer(selectedOption) {
  const questionAnswersOption = selectedOption.parentNode;
  const options = questionAnswersOption.querySelectorAll(".answer");
  for (let i = 0; i < options.length; i++) {
    if (options[i] !== selectedOption) {
      options[i].classList.add("notSelected");
      options[i].classList.add("color");
    } else {
      options[i].classList.add("selected");
      options[i].classList.add("color");
    }
  }
  if (selectedOption.classList.contains("true")) {
    rightAnswers += 1;
  }

  questionAnswersOption.parentNode.classList.remove("not-answered");
  setTimeout(scrollToNextQuestion, 2000);

  const questionsUnanswered = document.querySelectorAll(
    ".question-container.not-answered"
  );

  if (questionsUnanswered.length === 0) {
    setTimeout(calcScore, 2000);
    setTimeout(scrollToEndQuizz, 2000);
  }
}

function scrollToNextQuestion() {
  const nextQuestion = document.querySelector(
    ".question-container.not-answered"
  );
  if (nextQuestion !== null) {
    nextQuestion.scrollIntoView();
  }
}

function scrollToEndQuizz() {
  const endQuizz = document.querySelector(".end-quizz-container");
  if (endQuizz !== null) {
    endQuizz.scrollIntoView();
  }
}

let score = 0;
let scoreLevelTitle;
let scoreLevelImage;
let scoreLevelText;

function calcScore() {
  score = Math.round((rightAnswers / numberOfQuestions) * 100);
  for (let i = 0; i < scoreLevelsArray.length; i++) {
    let scoreLevel;

    if (score >= scoreLevelsArray[i].minValue) {
      scoreLevel = scoreLevelsArray[i];
      scoreLevelTitle = scoreLevel.title;
      scoreLevelImage = scoreLevel.image;
      scoreLevelText = scoreLevel.text;
    }
  }
  renderEndQuizzContainer();
}

function renderEndQuizzContainer() {
  const endQuizzContainer = document.querySelector(".end-quizz-container");
  if (endQuizzContainer !== null) {
    endQuizzContainer.innerHTML = `
    <div class="end-quizz-title">
      <span>${score}% de acerto: ${scoreLevelTitle}</span>
      </div>
      <img src="${scoreLevelImage}" />
      <p>${scoreLevelText}</p>`;

    endQuizzContainer.classList.remove("hide");
  }
}

function restartQuizz() {}

function returnToHomePage() {
  window.location.reload();
}

/* Tela 3 */

let test = 0;
let questionsNumber = 0;
let levelsNumber = 0;

/* tela informações básicas */

function titleIsValid() {
  let titleValue = document.querySelector(".quizz-title").value;
  if (titleValue.length < 20 || titleValue.length > 65) {
    alert("O título precisa ter entre 20 e 65 caracteres!");
    document.querySelector(".quizz-img-url").disabled = true;
  }
  document.querySelector(".quizz-img-url").disabled = false;
}

function urlIsValid() {
  let url = document.querySelector(".quizz-img-url").value;
  if (
    url.startsWith("http") &&
    (url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png"))
  ) {
  } else {
    alert("Preencha a URL corretamente!");
    document.querySelector(".questions-number").disabled = true;
  }
  document.querySelector(".questions-number").disabled = false;
}

function questionsNumberIsValid() {
  questionsNumber = document.querySelector(".questions-number").value;
  questionsNumber = parseInt(questionsNumber);
  if (questionsNumber < 3 || isNaN(questionsNumber) === true) {
    alert("Use números a partir de 3");
    document.querySelector(".levels-number").disabled = true;
  }
  document.querySelector(".levels-number").disabled = false;
  if (questionsNumber > 3) {
    for (let i = 0; i < questionsNumber - 3; i++) {
      let main = document.querySelector(".quizz-questions main");
      main.innerHTML += `
      <div class="questions">
        <h3>Pergunta ${i + 4}</h3>
        <ion-icon name="create-outline"></ion-icon>
      </div>
      `;
    }
  }
}

function levelsNumberIsValid() {
  levelsNumber = document.querySelector(".levels-number").value;
  levelsNumber = parseInt(levelsNumber);
  if (levelsNumber < 2 || isNaN(levelsNumber) === true) {
    alert("Você precisa de, no mínimo, 2 níveis!");
  } else if ((levelsNumber = 2)) {
    goToPageCreateQuestions();
  } else if (levelsNumber > 2) {
    for (let i = 0; i < levelsNumber - 2; i++) {
      let main = document.querySelector(".quizz-levels main");
      main.innerHTML += `
      <div class="questions">
        <h3>Nível ${i + 3}</h3>
        <ion-icon name="create-outline"></ion-icon>
      </div>
      `;
    }
    goToPageCreateQuestions();
  }
}

function createQuestions() {
  levelsNumberIsValid();
}

function goToPageCreateQuestions() {
  document.querySelector(".quizz-basic-information").classList.add("hide");
  document.querySelector(".quizz-questions").classList.remove("hide");
}

/* tela de perguntas */

function textIsValid() {
  let textValue = document.querySelector(".question-text").value;
  if (textValue.length < 20) {
    alert("O título precisa ter, no mínimo 20 caracteres!");
    document.querySelector(".question-color").disabled = true;
  }
  document.querySelector(".question-color").disabled = false;
}

function colorIsValid() {
  colorCharactersIsValid();
  let colorValue = document.querySelector(".question-color").value;
  if (colorValue.length !== 7 || !colorValue.startsWith("#") || test !== 6) {
    alert("A cor precisa ser colocada em modelo hexadecimal!");
    test = 0;
    document.querySelector(".right-answer").disabled = true;
  }
  document.querySelector(".right-answer").disabled = false;
}

function colorCharactersIsValid() {
  let colorValue = document.querySelector(".question-color").value;
  let validLetters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  for (let i = 1; i < colorValue.length; i++) {
    for (let j = 0; j < validLetters.length; j++) {
      if (colorValue[i].toUpperCase() === validLetters[j].toUpperCase()) {
        test = test + 1;
      }
    }
  }
  return test;
}

function rightAnswerIsValid() {
  let rightAnswerValue = document.querySelector(".right-answer").value;
  if (rightAnswerValue === "") {
    alert("A caixa de resposta correta não pode estar vazia!");
    document.querySelector(".right-img-url").disabled = true;
  }
  document.querySelector(".right-img-url").disabled = false;
}

function rightAnswerUrlIsValid() {
  let rightAnswerUrlValue = document.querySelector(".right-img-url").value;
  if (
    rightAnswerUrlValue.startsWith("http") &&
    (rightAnswerUrlValue.endsWith(".jpg") ||
      rightAnswerUrlValue.endsWith(".jpeg") ||
      rightAnswerUrlValue.endsWith(".png"))
  ) {
  } else {
    alert("Preencha corretamente a URL da resposta certa!");
    document.querySelector(".wrong-answer1").disabled = true;
  }
  document.querySelector(".wrong-answer1").disabled = false;
}

function wrongAnswerIsValid() {
  let wrongAnswerValue = document.querySelector(".wrong-answer1").value;
  if (wrongAnswerValue === "") {
    alert("Precisa existir pelo menos uma resposta errada!");
    document.querySelector(".wrong-img-url1").disabled = true;
  }
  document.querySelector(".wrong-img-url1").disabled = false;
}

function wrongAnswerUrlIsValid() {
  let wrongAnswerUrlValue = document.querySelector(".wrong-img-url1").value;
  if (
    wrongAnswerUrlValue.startsWith("http") &&
    (wrongAnswerUrlValue.endsWith(".jpg") ||
      wrongAnswerUrlValue.endsWith(".jpeg") ||
      wrongAnswerUrlValue.endsWith(".png"))
  ) {
    goToPageCreateLevels();
  } else {
    alert("Preencha corretamente a URL da primeira resposta incorreta!");
  }
}

function createLevels() {
  wrongAnswerUrlIsValid();
}

function goToPageCreateLevels() {
  document.querySelector(".quizz-questions").classList.add("hide");
  document.querySelector(".quizz-levels").classList.remove("hide");
}

/*falta validar as respostas incorretas não obrigatórias*/

/* tela de níveis */

function levelTitleIsValid() {
  let levelTitle = document.querySelector(".level-title").value;
  if (levelTitle.length < 10) {
    alert("O título precisa ter, no mínimo 10 caracteres!");
    document.querySelector(".hit-percentage").disabled = true;
  }
  document.querySelector(".hit-percentage").disabled = false;
}

function hitPercentageIsValid() {
  let hit = document.querySelector(".hit-percentage").value;
  hit = parseInt(hit);
  if (hit < 0 || hit > 100 || isNaN(hit) === true) {
    alert("Escolha um número entre 0 e 100!");
    document.querySelector(".level-img-url").disabled = true;
  }
  document.querySelector(".level-img-url").disabled = false;
}

function LevelUrlIsValid() {
  let levelUrl = document.querySelector(".level-img-url").value;
  if (
    levelUrl.startsWith("http") &&
    (levelUrl.endsWith(".jpg") ||
      levelUrl.endsWith(".jpeg") ||
      levelUrl.endsWith(".png"))
  ) {
  } else {
    alert("Preencha a URL do primeiro nível corretamente!");
    document.querySelector(".level-description").disabled = true;
  }
  document.querySelector(".level-description").disabled = false;
}

function levelDescriptionIsValid() {
  let levelDescription = document.querySelector(".level-description").value;
  if (levelDescription.length < 30) {
    alert("A descrição precisa ter, no mínimo 30 caracteres!");
  } else {
    goToPageConcludeCreation();
  }
}

function concludeCreation() {
  levelDescriptionIsValid();
}

function goToPageConcludeCreation() {
  document.querySelector(".quizz-levels").classList.add("hide");
  document.querySelector(".conclude-screen").classList.remove("hide");
}

function returnHome() {
  document.querySelector(".conclude-screen").classList.add("hide");
  document.querySelector(".home-screen").classList.remove("hide");
  document.querySelector(".create-quizz").classList.add("hide");
  document.querySelector(".user-quizzes").classList.remove("hide");
}
