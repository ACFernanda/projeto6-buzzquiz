//* Renderizar todos os quizzes - TELA 1 *//

let renderQuizz = [];
let userQuizz = [];

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
      <div onclick="openQuizz(this)" class="one-quizz" data-identifier="quizz-card">
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
  document.querySelector(".home-screen").classList.add("hide");
}

//* Tela 2*//

function openQuizz(quizzDiv) {
  const quizzImage = quizzDiv.querySelector("img");
  const quizzID = quizzImage.id;

  const homePage = document.querySelector(".home-screen");
  const playQuizzPage = document.querySelector(".playquizz-page.hide");
  const concludeScreen = document.querySelector(".conclude-screen");

  if (homePage !== null || playQuizzPage !== null || concludeScreen !== null) {
    playQuizzPage.classList.remove("hide");
    homePage.classList.add("hide");
    concludeScreen.classList.add("hide");
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
  <div class="question-container not-answered" data-identifier="question">
    <div class="question-title-container">
      ${questionContainerInnerHTML}
    </div>
    <div class="answers-container" data-identifier="answer">
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
let scoreLevelTitle = "";
let scoreLevelImage = "";
let scoreLevelText = "";

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

const endQuizzContainer = document.querySelector(".end-quizz-container");
function renderEndQuizzContainer() {
  if (endQuizzContainer !== null) {
    endQuizzContainer.innerHTML = `
    <div class="end-quizz-title" data-identifier="quizz-result">
      <span>${score}% de acerto: ${scoreLevelTitle}</span>
      </div>
      <div class ="image-and-text-container">
        <img src="${scoreLevelImage}" />
        <p>${scoreLevelText}</p>
      </div>`;

    endQuizzContainer.classList.remove("hide");
  }
}

function restartQuizz() {
  rightAnswers = 0;
  score = 0;
  scoreLevelTitle = "";
  scoreLevelImage = "";
  scoreLevelText = "";

  const options = document.querySelectorAll(".answer");
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("notSelected");
    options[i].classList.remove("color");
    options[i].classList.remove("selected");
  }

  const allQuestionContainers = document.querySelectorAll(
    ".question-container"
  );
  for (let i = 0; i < allQuestionContainers.length; i++) {
    allQuestionContainers[i].classList.add("not-answered");
  }

  const endQuizzContainer = document.querySelector(".end-quizz-container");
  endQuizzContainer.classList.add("hide");

  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0;
}

function returnToHomePage() {
  window.location.reload();
}

/* Tela 3 */

let test = 0;
let questionsNumber = 0;
let levelsNumber = 0;
let colorValue = "";
let title = "";
let url = "";
let sentObject = "";
let questionsArray = [];
let levelsArray = [];
let textQuestionArray = [];
let colorQuestionArray = [];
let rightAnswerQuestionArray = [];
let rightAnswerUrlQuestionArray = [];
let wrongAnswerQuestionArray = [];
let wrongAnswerUrlQuestionArray = [];
let optionalWrongAnswerQuestionArray = [];
let optionalWrongAnswerUrlQuestionArray = [];

/* tela informações básicas */

function titleIsValid() {
  title = document.querySelector(".quizz-title").value;
  if (title.length < 20 || title.length > 65) {
    alert("O título precisa ter entre 20 e 65 caracteres!");
    document.querySelector(".quizz-img-url").disabled = true;
  }
  document.querySelector(".quizz-img-url").disabled = false;
}

function urlIsValid() {
  url = document.querySelector(".quizz-img-url").value;
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
      <div>
        <div data-identifier="expand" onclick="appearQuestionsInputs(this)" class="questions">
          <h3>Pergunta ${i + 4}</h3>
          <ion-icon name="create-outline"></ion-icon>
        </div>

        <div class="questions-input hide">
          <ul>
            <li data-identifier="question">
              <input class="question-text" type="text" placeholder="Texto da pergunta"/>
            </li>
            <li data-identifier="question">
              <input onclick="textIsValid(this)" class="question-color" type="text" placeholder="Cor de fundo da pergunta"/>
            </li>
          </ul>
    
          <h3>Resposta correta</h3>
    
          <ul>
            <li data-identifier="question">
              <input onclick="colorIsValid()" class="right-answer" type="text" placeholder="Resposta correta"/>
            </li>
            <li data-identifier="question">
              <input onclick="rightAnswerIsValid()" class="right-img-url" type="text" placeholder="URL da imagem"/>
            </li>
          </ul>
    
          <h3>Respostas incorretas</h3>
    
          <ul>
            <li data-identifier="question">
              <input
                onclick="rightAnswerUrlIsValid()"
                class="wrong-answer1"
                type="text"
                placeholder="Resposta incorreta 1"
              />
            </li>
            <li data-identifier="question">
              <input
                onclick="wrongAnswerIsValid()"
                class="wrong-img-url1"
                type="text"
                placeholder="URL da imagem 1"
              />
            </li>
          </ul>
    
          <ul>
            <li data-identifier="question">
              <input
                class="wrong-answer"
                type="text"
                placeholder="Resposta incorreta 2"
              />
            </li>
            <li data-identifier="question">
              <input onclick="optionalWrongAnswerIsValid(this)"
                class="wrong-img-url"
                type="text"
                placeholder="URL da imagem 2"
              />
            </li>
          </ul>
    
          <ul>
            <li data-identifier="question">
              <input
                class="wrong-answer"
                type="text"
                placeholder="Resposta incorreta 3"
              />
            </li>
            <li data-identifier="question">
              <input onclick="optionalWrongAnswerIsValid(this)"
                class="wrong-img-url"
                type="text"
                placeholder="URL da imagem 3"
              />
            </li>
          </ul>
        </div>
      </div>
      `;
    }
  }
}

function appearQuestionsInputs(div) {
  let questionsInput = div.parentNode.children[1];
  questionsInput.classList.remove("hide");
}

function levelsNumberIsValid() {
  levelsNumber = document.querySelector(".levels-number").value;
  levelsNumber = parseInt(levelsNumber);
  if (levelsNumber < 2 || isNaN(levelsNumber) === true) {
    alert("Você precisa de, no mínimo, 2 níveis!");
  } else if (levelsNumber >= 2) {
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

function createSentObject() {
  for (let i = 0; i < questionsNumber; i++) {
    sentObject.title = title;
    sentObject.image = url;
    sentObject.questions[i].title = textQuestionArray[i];
    sentObject.questions[i].color = colorQuestionArray[i];
    sentObject.questions[i].answers[i].text = rightAnswerQuestionArray[i];
    sentObject.questions[i].answers[i].image = rightAnswerUrlQuestionArray[i];
    sentObject.questions[i].answers[i].isCorrectAnswer = true;
  }
  console.log(sentObject);
}

function textIsValid(textReceived) {
  let inputParent = textReceived.parentNode.parentNode.parentNode;
  let title = inputParent.querySelector(".question-text").value;
  if (title.length < 20) {
    alert("O texto precisa ter, no mínimo 20 caracteres!");
    inputParent.querySelector(".question-color").disabled = true;
  } else {
    textQuestionArray.push(title);
    console.log(textQuestionArray);
  }
  inputParent.querySelector(".question-color").disabled = false;
}

function colorIsValid(colorReceived) {
  //colorCharactersIsValid();
  let inputParent = colorReceived.parentNode.parentNode.parentNode;
  colorValue = inputParent.querySelector(".question-color").value;
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorValue)) {
    alert("A cor precisa ser colocada em modelo hexadecimal!");
    inputParent.querySelector(".right-answer").disabled = true;
  } else {
    colorQuestionArray.push(colorValue);
    console.log(colorQuestionArray);
  }
  inputParent.querySelector(".right-answer").disabled = false;
  /*if ((colorValue.length !== 7) || (!colorValue.startsWith("#")) || (test !== 6)) {
    alert("A cor precisa ser colocada em modelo hexadecimal!");
    inputParent.querySelector(".right-answer").disabled = true;
    console.log(test);
  } else {
    inputParent.querySelector(".right-answer").disabled = false;
    colorQuestionArray.push(colorValue);
    console.log(colorQuestionArray);
  }*/
}

/*function colorCharactersIsValid() {
  let validLetters = ["a","b","c","d","e","f","0","1","2","3","4","5","6","7","8","9"];
  for (let i = 1; i < colorValue.length; i++) {
    for (let j = 0; j < validLetters.length; j++) {
      if (colorValue[i].toUpperCase() === validLetters[j].toUpperCase()) {
        test = test + 1;
      }
    }
  }
  return test;
}*/

function rightAnswerIsValid(rightAnswerReceived) {
  let inputParent = rightAnswerReceived.parentNode.parentNode.parentNode;
  let rightAnswerValue = inputParent.querySelector(".right-answer").value;
  if (rightAnswerValue === "") {
    alert("A caixa de resposta correta não pode estar vazia!");
    inputParent.querySelector(".right-img-url").disabled = true;
  } else {
    rightAnswerQuestionArray.push(rightAnswerValue);
    console.log(rightAnswerQuestionArray);
  }
  inputParent.querySelector(".right-img-url").disabled = false;
}

function rightAnswerUrlIsValid(rightAnswerUrlReceived) {
  let inputParent = rightAnswerUrlReceived.parentNode.parentNode.parentNode;
  let rightAnswerUrlValue = inputParent.querySelector(".right-img-url").value;
  if (
    rightAnswerUrlValue.startsWith("http") &&
    (rightAnswerUrlValue.endsWith(".jpg") ||
      rightAnswerUrlValue.endsWith(".jpeg") ||
      rightAnswerUrlValue.endsWith(".png"))
  ) {
  } else {
    alert("Preencha corretamente a URL da resposta certa!");
    inputParent.querySelector(".wrong-answer1").disabled = true;
  }
  inputParent.querySelector(".wrong-answer1").disabled = false;
  rightAnswerUrlQuestionArray.push(rightAnswerUrlValue);
  console.log(rightAnswerUrlQuestionArray);
}

function wrongAnswerIsValid(wrongAnswerReceived) {
  let inputParent = wrongAnswerReceived.parentNode.parentNode.parentNode;
  let wrongAnswerValue = inputParent.querySelector(".wrong-answer1").value;
  if (wrongAnswerValue === "") {
    alert("Precisa existir pelo menos uma resposta errada!");
    inputParent.querySelector(".wrong-img-url1").disabled = true;
  }
  inputParent.querySelector(".wrong-img-url1").disabled = false;
  wrongAnswerQuestionArray.push(wrongAnswerValue);
  console.log(wrongAnswerQuestionArray);
}

function optionalWrongAnswerIsValid(optionalWrongAnswerReceived) {
  let inputParent =
    optionalWrongAnswerReceived.parentNode.parentNode.parentNode;
  let optionalWrongAnswer = inputParent.querySelectorAll(".wrong-answer");
  optionalWrongAnswer = Array.from(optionalWrongAnswer);
  for (let i = 0; i < optionalWrongAnswer.length; i++) {
    console.log(optionalWrongAnswer[i]);
    if (optionalWrongAnswer[i].value !== "") {
      optionalWrongAnswerQuestionArray.push(optionalWrongAnswer[i].value);
    }
  }
  console.log(optionalWrongAnswerQuestionArray);
}

function wrongAnswerUrlIsValid() {
  let wrongAnswerUrlValue = document.querySelectorAll(".wrong-img-url1");
  wrongAnswerUrlValue = Array.from(wrongAnswerUrlValue);
  let verification = 0;
  for (let i = 0; i < questionsNumber; i++) {
    if (
      wrongAnswerUrlValue[i].value.startsWith("http") &&
      (wrongAnswerUrlValue[i].value.endsWith(".jpg") ||
        wrongAnswerUrlValue[i].value.endsWith(".jpeg") ||
        wrongAnswerUrlValue[i].value.endsWith(".png"))
    ) {
      verification++;
    }
  }

  if (verification === questionsNumber) {
    wrongAnswerUrlQuestionArray.push(wrongAnswerUrlValue);
    goToPageCreateLevels();
  } else {
    alert("Preencha corretamente as URLs das respostas incorretas!");
  }
  console.log(wrongAnswerUrlQuestionArray);
}

function optionalWrongAnswerUrlIsValid() {
  let optionalWrongAnswerUrl = document.querySelectorAll(".wrong-img-url");
  optionalWrongAnswerUrl = Array.from(optionalWrongAnswerUrl);
  if (
    optionalWrongAnswerUrl[i].value.startsWith("http") &&
    (optionalWrongAnswerUrl[i].value.endsWith(".jpg") ||
      optionalWrongAnswerUrl[i].value.endsWith(".jpeg") ||
      optionalWrongAnswerUrl[i].value.endsWith(".png"))
  ) {
    for (let i = 0; i < questionsNumber * 2; i++) {
      optionalWrongAnswerQuestionArray.push(optionalWrongAnswer[i].value);
    }
  }
  console.log(optionalWrongAnswerQuestionArray);
}

function createLevels() {
  wrongAnswerUrlIsValid();
  optionalWrongAnswerUrlIsValid();
  createSentObject();
}

function goToPageCreateLevels() {
  for (let i = 0; i < levelsNumber - 2; i++) {
    let main = document.querySelector(".quizz-levels main");
    main.innerHTML += `
    <div>
          <div data-identifier="expand" onclick="appearLevelsInputs(this)" class="questions">
            <h3>Nível ${i + 3}</h3>
            <ion-icon name="create-outline"></ion-icon>
          </div>

          <div class="hide">
            <ul>
              <li data-identifier="level">
                <input
                  class="level-title"
                  type="text"
                  placeholder="Título do nível"
                />
              </li>
              <li data-identifier="level">
                <input
                  onclick="levelTitleIsValid()"
                  class="hit-percentage"
                  type="text"
                  placeholder="% de acerto mínima"
                />
              </li>
              <li data-identifier="level">
                <input
                  onclick="hitPercentageIsValid()"
                  class="level-img-url"
                  type="text"
                  placeholder="URL da imagem do nível"
                />
              </li>
              <li data-identifier="level">
                <textarea
                  onclick="levelUrlIsValid()"
                  class="level-description"
                  placeholder="Descrição do nível"
                ></textarea>
              </li>
            </ul>
          </div>
        </div>
    `;
  }
  document.querySelector(".quizz-questions").classList.add("hide");
  document.querySelector(".quizz-levels").classList.remove("hide");
}

function appearLevelsInputs(div) {
  let levelsInput = div.parentNode.children[1];
  levelsInput.classList.remove("hide");
}

/* tela de níveis */

function levelTitleIsValid(titleReceived) {
  let inputParent = titleReceived.parentNode.parentNode;
  let levelTitle = inputParent.querySelector(".level-title").value;
  if (levelTitle.length < 10) {
    alert("O título precisa ter, no mínimo 10 caracteres!");
    inputParent.querySelector(".hit-percentage").disabled = true;
  }
  inputParent.querySelector(".hit-percentage").disabled = false;
}

function hitPercentageIsValid(hitPercentageReceived) {
  let inputParent = hitPercentageReceived.parentNode.parentNode;
  let hit = inputParent.querySelector(".hit-percentage").value;
  hit = parseInt(hit);
  if (hit < 0 || hit > 100 || isNaN(hit) === true) {
    alert("Escolha um número entre 0 e 100!");
    inputParent.querySelector(".level-img-url").disabled = true;
  }
  inputParent.querySelector(".level-img-url").disabled = false;
}

function levelUrlIsValid(levelUrlReceived) {
  let inputParent = levelUrlReceived.parentNode.parentNode;
  let levelUrl = inputParent.querySelector(".level-img-url").value;
  if (
    levelUrl.startsWith("http") &&
    (levelUrl.endsWith(".jpg") ||
      levelUrl.endsWith(".jpeg") ||
      levelUrl.endsWith(".png"))
  ) {
  } else {
    alert("Preencha a URL do primeiro nível corretamente!");
    inputParent.querySelector(".level-description").disabled = true;
  }
  inputParent.querySelector(".level-description").disabled = false;
}

function levelDescriptionIsValid() {
  let levelDescription = document.querySelectorAll(".level-description");
  let verification = 0;
  for (let i = 0; i < levelsNumber; i++) {
    if (!(levelDescription[i].value.length < 30)) {
      verification++;
    }
  }

  if (verification === levelsNumber) {
    goToPageConcludeCreation();
  } else {
    alert("A descrição precisa ter, no mínimo 30 caracteres!");
  }
}

function concludeCreation() {
  levelDescriptionIsValid();
}

function goToPageConcludeCreation() {
  document.querySelector(".quizz-levels").classList.add("hide");
  document.querySelector(".conclude-screen").classList.remove("hide");
  renderNewQuizz();
}

function renderNewQuizz() {
  let newQuizzHTML = document.querySelector(".conclude-screen .new-quizz");
  newQuizzHTML.innerHTML = `
  <div class="one-quizz" data-identifier="quizz-card" data-identifier="user-quizzes">
    <img src="${url}" class="img-quizzes"  /> 
    <h1 class="name-quizzes">${title}</h1>
  </div>`; /* PRECISA TER O ID DO QUIZZ QUE SERÁ CRIANDO QUANDO DER O POST: id="NÚMERO" */
}

/* POST */

const sendQuizz = axios.post(
  "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes",
  sentObject
);
sendQuizz.then();
sendQuizz.catch();

//retorna pra home - tela 2 listando os quizzes do usuário
function returnHomeReloaded() {
  window.location.reload();
  showUserQuizzes();
}

// a testar se funciona após o user criar um quizz
function showUserQuizzes() {
  const createQuizz = document.querySelector(".list-quizzes");
  const createQuizzSmall = document.querySelector(".userquizzes");
  if (userQuizz === null) {
    createQuizzSmall.classList.add("hide");
    createQuizz.classList.remove("hide");
  } else {
    createQuizz.classList.add("hide");
    createQuizzSmall.classList.remove("hide");
  }
}

/// a testar após enviar o quizz pro servidor
function saveUserQuizz(quiz) {
  const quizString = JSON.stringify(quiz);
  localStorage.setItem(quiz.data.id.toString(), quizString);
  loadUserQuizz();
}

function loadUserQuizz() {
  for (let i = 0; i < localStorage.length; i++) {
    userQuizz.push(localStorage.getItem(localStorage.key(i)));
  }
  console.log(userQuizz);
}
