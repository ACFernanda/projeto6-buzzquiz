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
  document.querySelector(".all-quizzes").classList.add("hide");
}

//* Tela 2*//

function renderQuizzOnScreen(response) {
    renderQuizz = response.data;
    console.log(renderQuizz);
    const render = document.querySelector(".all-quizzes");
    console.log(render);
    
    for (let i = 0; i < renderQuizz.length; i++) {
        render.innerHTML += `
        <article class="all-quizzes">
        <img src="${renderQuizz[i].image}" class="img-quizzes"> 
        <h1 class="name-quizzes">${renderQuizz[i].title}<h1>
        </article> `
    }   
 } 
 
function openQuizz(thisQuizz) {
  let quizzID = thisQuizz.id;
  console.log(quizzID);

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

  renderQuizzHeader(quizzTitle, quizzImg);
  //renderQuizzQuestions(quizzID);
}

function renderQuizzHeader(quizzTitle, quizzImg) {
  const quizzTitleText = document.querySelector(".quizz-title-container span");
  const quizzTitleImg = document.querySelector(".quizz-title-container img");

  if (quizzTitleText !== null || quizzTitleImg !== null) {
    quizzTitleText.innerHTML = quizzTitle;
    quizzTitleImg.src = quizzImg;
  }
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

/* Tela 3 */

function createQuestions() {
  levelsNumberIsValid()
}

function titleIsValid() {
  let titleValue = document.querySelector(".quizz-title").value;
  if ((titleValue.length < 20) || (titleValue.length > 65)) {
    alert("O título precisa ter entre 20 e 65 caracteres!")
    document.querySelector(".quizz-basic-information .quizz-img-url").disabled = true;
    document.querySelector(".quizz-basic-information .questions-number").disabled = true;
    document.querySelector(".quizz-basic-information .levels-number").disabled = true;
  }
  document.querySelector(".quizz-basic-information .quizz-img-url").disabled = false;
  document.querySelector(".quizz-basic-information .questions-number").disabled = false;
  document.querySelector(".quizz-basic-information .levels-number").disabled = false;
}

function urlIsValid() {
  let url = document.querySelector(".quizz-basic-information .quizz-img-url").value;
  if ((url.startsWith('http')) && ((url.endsWith('.jpg')) || (url.endsWith('.jpeg')) || (url.endsWith('.png')))) {
  } else {
    alert("Preencha a URL corretamente!")
    document.querySelector(".quizz-basic-information .questions-number").disabled = true;
    document.querySelector(".quizz-basic-information .levels-number").disabled = true;
  }
  document.querySelector(".quizz-basic-information .questions-number").disabled = false;
  document.querySelector(".quizz-basic-information .levels-number").disabled = false;
}

function questionsNumberIsValid() {
  let questionsNumber = document.querySelector(".quizz-basic-information .questions-number").value;
  questionsNumber = parseInt(questionsNumber);
  console.log(isNaN(questionsNumber) === true)
  if ((questionsNumber < 3) || (isNaN(questionsNumber) === true)) {
    alert("Use números a partir de 3");
    document.querySelector(".quizz-basic-information .levels-number").disabled = true;
  }
  document.querySelector(".quizz-basic-information .levels-number").disabled = false;
}

function levelsNumberIsValid() {
  let levelsNumber = document.querySelector(".quizz-basic-information .levels-number").value;
  levelsNumber = parseInt(levelsNumber);
  if ((levelsNumber < 2) || (isNaN(levelsNumber) === true)) {
    alert("Você precisa de, no mínimo, 2 níveis!")
  } else if (levelsNumber >= 2) {
    goToPageCreateQuestions()
  }
}

function goToPageCreateQuestions(){
  document.querySelector(".quizz-basic-information").classList.add("hide");
  document.querySelector(".quizz-questions").classList.remove("hide");
}

function textIsValid() {
  let textValue = document.querySelector(".question-text").value;
  if (textValue.length < 20) {
    alert("O título precisa ter, no mínimo 20 caracteres!")
    document.querySelector(".quizz-questions .question-color").disabled = true;
  }
  document.querySelector(".quizz-questions .question-color").disabled = false;
}

function colorIsValid() { /*falta validar as letras de A a F*/
  let colorValue = document.querySelector(".question-color").value;
  if ((colorValue.length !== 7) || (!(colorValue.startsWith('#')))) {
    alert("A cor precisa ser colocada em modelo hexadecimal!")
    document.querySelector(".quizz-questions .right-answer").disabled = true;
  }
  document.querySelector(".quizz-questions .right-answer").disabled = false;
}

function rightAnswerIsValid() {
  let rightAnswerValue = document.querySelector(".right-answer").value;
  if (rightAnswerValue === "") {
    alert("A caixa de resposta correta não pode estar vazia!")
    document.querySelector(".quizz-questions .right-img-url").disabled = true;
  }
  document.querySelector(".quizz-questions .right-img-url").disabled = false;
}

function rightAnswerUrlIsValid() {
  let rightAnswerUrlValue = document.querySelector(".right-img-url").value;
  if ((rightAnswerUrlValue.startsWith('http')) && ((url.endsWith('.jpg')) || (url.endsWith('.jpeg')) || (url.endsWith('.png')))) {
  } else {
    alert("Preencha corretamente a URL da resposta certa!")
    document.querySelector(".quizz-questions .wrong-answer1").disabled = true;
  }
  document.querySelector(".quizz-questions .wrong-answer1").disabled = false;
}

function wrongAnswerIsValid() {
  let wrongAnswerValue = document.querySelector(".wrong-answer1").value;
  if (wrongAnswerValue === "") {
    alert("Precisa existir pelo menos uma resposta errada!")
    document.querySelector(".quizz-questions .wrong-img-url1").disabled = true;
  }
  document.querySelector(".quizz-questions .wrong-img-url1").disabled = false;
}

function wrongAnswerUrlIsValid() {
  let wrongAnswerUrlValue = document.querySelector(".wrong-img-url1").value;
  if ((wrongAnswerUrlValue.startsWith('http')) && ((url.endsWith('.jpg')) || (url.endsWith('.jpeg')) || (url.endsWith('.png')))) {
    goToPageCreateLevels();
  } else {
    alert("Preencha corretamente a URL da primeira resposta incorreta!")
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

/*falta validar a tela dos níveis*/

function endCreation() {
  document.querySelector(".quizz-levels").classList.add("hide");
  document.querySelector(".conclude-screen").classList.remove("hide");
}
