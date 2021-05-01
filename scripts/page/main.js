import { moveToPage } from './base.js';
import { resetNamePage } from './name.js';
import { resetQuestionPage } from './question.js';



const nextPageButtons = Array.from(document.querySelectorAll('#pages > #main .button a'));


nextPageButtons.forEach((button) => {
    if ('ontouchstart' in document.documentElement) {
        button.addEventListener('touchstart', startTest);
    }
    else {
        button.addEventListener('click', startTest);
    }
});

function startTest() {
    resetNamePage();
    moveToPage('name');

    document.querySelector('#name > .input > input').focus();
}