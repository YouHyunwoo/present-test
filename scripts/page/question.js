import { test } from '../data/test.js';
import { getName } from '../page/name.js';



const questionText = document.querySelector('#question > section.question > h1');
const questionImage = document.querySelector('#question > section.question > .image > img');
const progressBar = document.querySelector('#question header .progress .bar');
const progressImage = document.querySelector('#question header .progress .image img');
const progressText = document.querySelector('#question header .progress .bar span');
const choices = document.querySelector('#question .choices');
// const nodes = document.querySelectorAll('#question header, #question .choices');
const nodes = [];


let isAnimating = false;


function showNextQuestion() {
    nextQuestion();

    if (isFinished()) {
        calculateResult();
        moveToResultPage();
    }
    else {
        showCurrentQuestion();
    }
}

function nextQuestion() {
    test.nextQuestion();
}

function isFinished() {
    return test.isFinished();
}

function calculateResult() {
    test.sortScore();
}

function moveToResultPage() {
    const parameters = generateParameterByResults();
    const parameterInURL = generateParameterInURL(parameters);

    window.location.href = 'result.html' + parameterInURL;
}

function generateParameterByResults() {
    const result = test.getResultIndexByRank(0);

    const parameters = {
        'result': result,
        'name': getName(),
    }

    return parameters;
}

function generateParameterInURL(parameters) {
    const pairs = [];

    for (const key in parameters) {
        const value = parameters[key];

        pairs.push(`${key}=${value}`);
    }

    const parameterInURL = '?' + pairs.join('&');
    
    return parameterInURL;
}

function showCurrentQuestion() {
    changeQuestion();
}

function showCurrentQuestionWithAnimation() {
    startAnimation();

    delay(0)()
    .then(() => {
        fadeOutAllNodes();
    })
    .then(delay(200))
    .then(() => {
        changeQuestion();

        fadeInAllNodes();
    })
    .then(delay(200))
    .then(() => {
        stopAnimation();
    })
}

function delay(ms) {
    return value => new Promise((resolve) => setTimeout(resolve, ms, value));
}

function startAnimation() {
    isAnimating = true;
}

function fadeOutAllNodes() {
    nodes.forEach((node) => {
        node.animate(
            [ { opacity: '0' } ],
            {
                duration: 200,
                direction: 'alternate',
                fill: 'forwards',
            }
        );
    });
}

function changeQuestion() {
    changeToCurrentQuestion();
}

function changeToCurrentQuestion() {
    const currentQuestion = test.getCurrentQuestion();

    changeQuestionText(currentQuestion);
    changeQuestionImage(currentQuestion);
    changeChoices(currentQuestion);

    const progressRatio = test.getCurrentRatio();

    changeProgressBar(progressRatio);
    changeProgressText(progressRatio);
}

function changeQuestionText(currentQuestion) {
    const text = preprocessQuestion(currentQuestion.title);
    questionText.innerText = text;
}

function preprocessQuestion(text) {
    const name = getName();
    return text.replace('${name}', name);
}

function changeQuestionImage(currentQuestion) {
    const imageNumber = test.currentQuestionIndex + 1;
    questionImage.src = `images/question/${imageNumber}.png`;
}

function changeChoices(currentQuestion) {
    removePreviousChoices();
    appendCurrentChoices(currentQuestion);
}

function removePreviousChoices() {
    const children = Array.from(choices.children);

    children.forEach((node) => {
        if (node.tagName === 'A') {
            node.remove();
        }
    });
}

function appendCurrentChoices(currentQuestion) {
    currentQuestion.choices.forEach((choice, choiceIndex) => {
        const choiceButton = document.createElement('a');

        choiceButton.classList.add('choice');
        choiceButton.innerText = choice.text;

        choiceButton.addEventListener('click', (e) => {
            if (hasAnyQuestionWhileAnimationStop()) {
                chooseAnswer(choiceIndex);
                showNextQuestion();
            }
        });

        choices.appendChild(choiceButton);
    });
}

function hasAnyQuestionWhileAnimationStop() {
    return !isAnimating && !test.isFinished();
}

function chooseAnswer(choiceIndex) {
    test.chooseAnswer(choiceIndex);
}

function changeProgressBar(progressRatio) {
    const ratio = test.currentQuestionIndex / test.questions.length;

    progressImage.style.marginLeft = `${ratio * 100}%`;
}

function changeProgressText(progressRatio) {
    progressText.innerText = `${test.currentQuestionIndex + 1}`
}

function fadeInAllNodes() {
    nodes.forEach((node) => {
        node.animate(
            [ { opacity: '1' } ],
            {
                duration: 200,
                direction: 'alternate',
                fill: 'forwards',
            }
        );
    });
}

function stopAnimation() {
    isAnimating = false;
}

export function resetQuestionPage() {
    resetTest();
    changeToCurrentQuestion();
}

function resetTest() {
    test.reset();
}