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
let title = document.querySelector(".quizz-title");
let url = document.querySelector(".quizz-img-url");

/* tela informações básicas */

function titleIsValid() {
  if ((title.value.length < 20) || (title.value.length > 65)) {
    alert("O título precisa ter entre 20 e 65 caracteres!");
    document.querySelector(".quizz-img-url").disabled = true;
  }
  document.querySelector(".quizz-img-url").disabled = false;
}

function urlIsValid() {
  if (url.value.startsWith("http") && ((url.value.endsWith(".jpg")) || (url.value.endsWith(".jpeg")) || (url.value.endsWith(".png")))) {
  } else {
    alert("Preencha a URL corretamente!");
    document.querySelector(".questions-number").disabled = true;
  }
  document.querySelector(".questions-number").disabled = false;
}

function questionsNumberIsValid() {
  questionsNumber = document.querySelector(".questions-number").value;
  questionsNumber = parseInt(questionsNumber);
  if ((questionsNumber < 3) || (isNaN(questionsNumber) === true)) {
    alert("Use números a partir de 3");
    document.querySelector(".levels-number").disabled = true;
  }
  document.querySelector(".levels-number").disabled = false;
  if (questionsNumber > 3) {
    for (let i = 0; i < questionsNumber - 3; i++) {
      let main = document.querySelector(".quizz-questions main");
      main.innerHTML += `
      <div>
        <div onclick="appearQuestionsInputs(this)" class="questions">
          <h3>Pergunta ${i + 4}</h3>
          <ion-icon name="create-outline"></ion-icon>
        </div>

        <div class="questions-input hide">
          <ul>
            <li>
              <input class="question-text" type="text" placeholder="Texto da pergunta"/>
            </li>
            <li>
              <input onclick="textIsValid(this)" class="question-color" type="text" placeholder="Cor de fundo da pergunta"/>
            </li>
          </ul>
    
          <h3>Resposta correta</h3>
    
          <ul>
            <li>
              <input onclick="colorIsValid()" class="right-answer" type="text" placeholder="Resposta correta"/>
            </li>
            <li>
              <input onclick="rightAnswerIsValid()" class="right-img-url" type="text" placeholder="URL da imagem"/>
            </li>
          </ul>
    
          <h3>Respostas incorretas</h3>
    
          <ul>
            <li>
              <input
                onclick="rightAnswerUrlIsValid()"
                class="wrong-answer1"
                type="text"
                placeholder="Resposta incorreta 1"
              />
            </li>
            <li>
              <input
                onclick="wrongAnswerIsValid()"
                class="wrong-img-url1"
                type="text"
                placeholder="URL da imagem 1"
              />
            </li>
          </ul>
    
          <ul>
            <li>
              <input
                class="wrong-answer2"
                type="text"
                placeholder="Resposta incorreta 2"
              />
            </li>
            <li>
              <input
                class="wrong-img-url2"
                type="text"
                placeholder="URL da imagem 2"
              />
            </li>
          </ul>
    
          <ul>
            <li>
              <input
                class="wrong-answer3"
                type="text"
                placeholder="Resposta incorreta 3"
              />
            </li>
            <li>
              <input
                class="wrong-img-url3"
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
  } else if ((levelsNumber >= 2)) {
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

function textIsValid(textReceived) {
  let inputParent = textReceived.parentNode.parentNode.parentNode;
  let title = inputParent.querySelector(".question-text").value;
  if (title.length < 20) {
    alert("O texto precisa ter, no mínimo 20 caracteres!");
    inputParent.querySelector(".question-color").disabled = true;
  }
  inputParent.querySelector(".question-color").disabled = false;
}

function colorIsValid(colorReceived) {
  colorCharactersIsValid();
  let inputParent = colorReceived.parentNode.parentNode.parentNode;
  colorValue = inputParent.querySelector(".question-color").value;
  if (colorValue.length !== 7 || !colorValue.startsWith("#") || test !== 6) {
    alert("A cor precisa ser colocada em modelo hexadecimal!");
    test = 0;
    inputParent.querySelector(".right-answer").disabled = true;
  }
  inputParent.querySelector(".right-answer").disabled = false;
}

function colorCharactersIsValid() {
  let validLetters = ["a","b","c","d","e","f","0","1","2","3","4","5","6","7","8","9"];
  for (let i = 1; i < colorValue.length; i++) {
    for (let j = 0; j < validLetters.length; j++) {
      if (colorValue[i].toUpperCase() === validLetters[j].toUpperCase()) {
        test = test + 1;
      }
    }
  }
  return test;
}

function rightAnswerIsValid(rightAnswerReceived) {
  let inputParent = rightAnswerReceived.parentNode.parentNode.parentNode;
  let rightAnswerValue = inputParent.querySelector(".right-answer").value;
  if (rightAnswerValue === "") {
    alert("A caixa de resposta correta não pode estar vazia!");
    inputParent.querySelector(".right-img-url").disabled = true;
  }
  inputParent.querySelector(".right-img-url").disabled = false;
}

function rightAnswerUrlIsValid(rightAnswerUrlReceived) {
  let inputParent = rightAnswerUrlReceived.parentNode.parentNode.parentNode;
  let rightAnswerUrlValue = inputParent.querySelector(".right-img-url").value;
  if (rightAnswerUrlValue.startsWith("http") && ((rightAnswerUrlValue.endsWith(".jpg")) || (rightAnswerUrlValue.endsWith(".jpeg")) || (rightAnswerUrlValue.endsWith(".png")))) {
  } else {
    alert("Preencha corretamente a URL da resposta certa!");
    inputParent.querySelector(".wrong-answer1").disabled = true;
  }
  inputParent.querySelector(".wrong-answer1").disabled = false;
}

function wrongAnswerIsValid(wrongAnswerReceived) {
  let inputParent = wrongAnswerReceived.parentNode.parentNode.parentNode;
  let wrongAnswerValue = inputParent.querySelector(".wrong-answer1").value;
  if (wrongAnswerValue === "") {
    alert("Precisa existir pelo menos uma resposta errada!");
    inputParent.querySelector(".wrong-img-url1").disabled = true;
  }
  inputParent.querySelector(".wrong-img-url1").disabled = false;
}

function wrongAnswerUrlIsValid(wrongAnswerUrlReceived) {
  let inputParent = wrongAnswerUrlReceived.parentNode.parentNode.parentNode;
  let wrongAnswerUrlValue = inputParent.querySelector(".wrong-img-url1").value;
    if (wrongAnswerUrlValue.startsWith("http") && ((wrongAnswerUrlValue.endsWith(".jpg")) || (wrongAnswerUrlValue.endsWith(".jpeg")) || (wrongAnswerUrlValue.endsWith(".png")))) {
      goToPageCreateLevels();
    } else {
      alert("Preencha corretamente as URLs das respostas incorretas!");
    }  
} 
/* NÃO ESTOU CONSEGUINDO PENSAR EM COMO FAZER ESSA VALIDAÇÃO 
PQ ERA CLICANDO NO BOTÃO, MAS TEM MAIS DE UMA PRA AVALIAR */

function createLevels() {
  wrongAnswerUrlIsValid(); /* ASSIM NÃO VAI DAR CERTO */
}

function goToPageCreateLevels() {
  for (let i = 0; i < levelsNumber - 2; i++) {
    let main = document.querySelector(".quizz-levels main");
    main.innerHTML += `
    <div>
          <div onclick="appearLevelsInputs(this)" class="questions">
            <h3>Nível ${i+3}</h3>
            <ion-icon name="create-outline"></ion-icon>
          </div>

          <div class="hide">
            <ul>
              <li>
                <input
                  class="level-title"
                  type="text"
                  placeholder="Título do nível"
                />
              </li>
              <li>
                <input
                  onclick="levelTitleIsValid()"
                  class="hit-percentage"
                  type="text"
                  placeholder="% de acerto mínima"
                />
              </li>
              <li>
                <input
                  onclick="hitPercentageIsValid()"
                  class="level-img-url"
                  type="text"
                  placeholder="URL da imagem do nível"
                />
              </li>
              <li>
                <textarea
                  onclick="levelUrlIsValid()"
                  class="level-description"
                  placeholder="Descrição do nível"
                ></textarea>
              </li>
            </ul>
          </div>
        </div>
    `
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

function levelDescriptionIsValid(levelDescriptionReceived) {
  let inputParent = levelDescriptionReceived.parentNode.parentNode;
  let levelDescription = inputParent.querySelector(".level-description").value;
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
  renderNewQuizz();
}

function renderNewQuizz() {
  let newQuizzHTML = document.querySelector(".conclude-screen .new-quizz");
  newQuizzHTML.innerHTML = `
  <div class="one-quizz" data-identifier="quizz-card">
    <img src="${url}" class="img-quizzes"  /> 
    <h1 class="name-quizzes">${titleValue}</h1>
  </div>`; /* PRECISA TER O ID DO QUIZZ QUE SERÁ CRIANDO QUANDO DER O POST: id="NÚMERO" */
}

/* POST */



//retorna pra home - tela 2 listando os quizzes do usuário
function returnHomeReloaded() {
  const reload = window.location.reload();
  reload.then(showUserQuizzes);
}

function showUserQuizzes() {
  const newQuizzBox = document.querySelector(".list-quizzes");
  const userQuizzesLayout = document.querySelector(".userquizzes.hide");
  if (newQuizzBox !== null || userQuizzesLayout !== null) {
    newQuizzBox.classList.add("hide");
    userQuizzesLayout.classList.remove("hide");
  }
}