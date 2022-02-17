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
        <img onclick = "openQuizz()" src="${renderQuizz[i].image}" class="img-quizzes"> 
        <h1 class="name-quizzes">${renderQuizz[i].title}<h1>
        </article>    `;
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

function openQuizz() {
  const homePage = document.querySelector(".list-quizzes");
  const playQuizzPage = document.querySelector(".playquizz-page.hide");

  if (homePage !== null) {
    playQuizzPage.classList.remove("hide");
    homePage.classList.add("hide");
  }

  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0;
}

function renderOneQuizz() {
  renderQuizzTitle();
  renderQuizzQuestions();
}

function renderQuizzTitle() {
  const quizzTitleText = document.querySelector(
    "quizz-title-container span"
  ).innerHTML;
  const quizzTitleImg = document.querySelector("img").src;
}

function renderQuizzQuestions() {}

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
