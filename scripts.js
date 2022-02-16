let renderQuizz = [];

//* Tela 1 -> Tela 3 *//

function createQuizz() {
    document.querySelector(".quizz-basic-information").classList.remove("hide");
    document.querySelector(".list-quizzes").classList.add("hide");
}

const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
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
        <img src="${renderQuizz[i].image}" class="img-quizzes"> 
        <h1 class="name-quizzes">${renderQuizz[i].title}<h1>
        </article>    `
    }   
 } 
 

function errorScreen(error) {
    console.log(error.data);

}