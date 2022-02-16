//* Tela 1 -> Tela 3 *//

function createQuizz() {
  document.querySelector(".quizz-basic-information").classList.remove("hide");
  document.querySelector(".list-quizzes").classList.add("hide");
}

//* Tela 2*//

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
  document.querySelector("playquizz-page").classList.add("hide");
  document.querySelector(".list-quizzes").classList.remove("hide");
}
