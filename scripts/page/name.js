import { moveToPage } from './base.js';
import { resetQuestionPage } from './question.js';



const nameText = document.querySelector('#name > .input > input');
const nextPageButtons = Array.from(document.querySelectorAll('#name .button a'));


nextPageButtons.forEach((button) => {
    if ('ontouchstart' in document.documentElement) {
        button.addEventListener('touchstart', nextPage);
    }
    else {
        button.addEventListener('click', nextPage);
    }
});

function nextPage() {
    if (nameText.value !== '') {
        resetQuestionPage();
        moveToPage('question');
    }
}


export function resetNamePage() {
    nameText.value = '';
}

export function getName() {
    return nameText.value;
}