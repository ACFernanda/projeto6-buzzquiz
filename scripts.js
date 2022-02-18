//* Renderizar todos os quizzes - TELA 1 *//

let renderQuizz = [];

const promise = axios.get(
  "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
);
promise.then(renderQuizzOnScreen);
promise.catch(errorScreen);

function renderQuizzOnScreen(response) {
  renderQuizz = response.data;
  console.log(renderQuizz);
  const render = document.querySelector(".all-quizzes");
  console.log(render);

  for (let i = 0; i < renderQuizz.length; i++) {
    render.innerHTML += `
        <article class="all-quizzes">
        <img onclick = "openQuizz(this)" src="${renderQuizz[i].image}" class="img-quizzes" id="${renderQuizz[i].id}"> 
        <h1 class="name-quizzes">${renderQuizz[i].title}</h1>
        </article>`;
  }
}

function errorScreen(error) {
  console.log(error.data);
}

//* Tela 1 -> Tela 3 *//

function createQuizz() {
  document.querySelector(".quizz-basic-information").classList.remove("hide");
  document.querySelector(".list-quizzes").classList.add("hide");
}

//* Tela 2*//

function openQuizz(thisQuizz) {
  let quizzID = thisQuizz.id;

  const homePage = document.querySelector(".list-quizzes");
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

function renderOneQuizz(selectedQuizz) {
  const infoQuizz = selectedQuizz.data;

  const quizzTitle = infoQuizz.title; // RETORNA STRING
  const quizzImg = infoQuizz.image; // RETORNA URL DA IMAGEM
  const quizzQuestions = infoQuizz.questions; // RETORNA ARRAY
  const scoreLevels = infoQuizz.levels; // RETORNA ARRAY

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
  console.log(quizzQuestion);
  const allQuestionsContainer = document.querySelector(
    ".all-questions-container"
  );
  let answers = quizzQuestion.answers;
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

    answerContainerInnerHTML += `<div class="answer ${isCorrectAnswer}">
    <img src="${optionImg}" />
    <p>${option}</p>
    </div>`;
  }
  console.log(answerContainerInnerHTML);

  allQuestionsContainer.innerHTML += `
  <div class="question-container">
    <div class="question-title-container">
      ${questionContainerInnerHTML}
    </div>
    <div class="answers-container">
      ${answerContainerInnerHTML}
    </div>
  </div>`;
}

function restartQuizz() {}

function returnToHomePage() {
  const homePage = document.querySelector(".list-quizzes.hide");
  const playQuizzPage = document.querySelector(".playquizz-page");

  if (homePage !== null) {
    playQuizzPage.classList.add("hide");
    homePage.classList.remove("hide");
  }

  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
