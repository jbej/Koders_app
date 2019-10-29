const question = document.querySelector('#question');
const buttons = document.querySelectorAll('.answer-btn');
const goodAnswersSpan = document.querySelector('#good-answers');
const gameBoard = document.querySelector('#game-board');
const h2 = document.querySelector('h2');
const tipDiv = document.querySelector('#tip');

function fillQuestionElements(data){
    question.innerText = data.question;

    if(data.winner === true) {
        gameBoard.style.display = 'none';
        h2.innerText = 'YOU WON!!!';
        return;
    };

    if(data.loser === true) {
        gameBoard.style.display = 'none';
        h2.innerText = "It didn't go this time, please try again !!!";
        return
    };

    for (const i in data.answers) {
        const answerEl = document.querySelector(`#answer${Number(i) + 1}`);
        answerEl.innerHTML = data.answers[i]
    }
};

function showNextQuestion() {
    fetch('/question', {
        method: 'GET',
    })
    .then( response => response.json())
    .then(data => fillQuestionElements(data));
};

function handleAnswerFeedback(data) {
    goodAnswersSpan.innerText = data.goodAnswers;
    showNextQuestion();
}

function sendAnswer(answerIndex){
    fetch(`/answer/${answerIndex}`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
       handleAnswerFeedback(data);   
    });
};

for(const button of buttons) {
    button.addEventListener('click', (event) => {
       const answerIndex = event.target.dataset.answer; 
       sendAnswer(answerIndex);
    });
};

function handleFriendsAnswer(data) {
    tipDiv.innerText = data.text;
}


function callToAFriend(){
    fetch('/help/friend', {
        method: 'GET',
    })
    .then( response => response.json())
    .then(data => {
       handleFriendsAnswer(data);
    });
};

document.querySelector('#callToAFriend').addEventListener('click', callToAFriend);


function handleHalfOnHalfAnswer(data) {
    if(typeof data.text === 'string'){
        tipDiv.innerText = data.text;
    }else {
        for(const button of buttons){
            if(data.answerToRemove.indexOf(button.innerText) > -1) {
                button.innerText === '';
            }
        }
    }
}

function halfOnHalf(){
    fetch('/help/half', {
        method: 'GET',
    })
    .then( response => response.json())
    .then(data => {
       handleHalfOnHalfAnswer(data);
    });
}


document.querySelector('#halfOnHalf').addEventListener('click', halfOnHalf);

function handleCrowdAnswer(data) {
    if (typeof data.text === 'string') {
        tipDiv.innerText = data.text;
    } else {
        data.chart.forEach((percent, index) => {
            buttons[index].innerText = `${buttons[index].innerText} : ${percent}%`

        });
    }
}

function questionToTheCrowd() {
    fetch('/help/crowd', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            handleCrowdAnswer(data);
        });
}

document.querySelector('#questionToTheCrowd').addEventListener('click', questionToTheCrowd);

showNextQuestion();