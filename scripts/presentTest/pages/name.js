import page from '../../page/page.js';



export class NamePage extends page.Page {
    constructor(pageId) {
        super(pageId);

        this.bindElements();
    }

    bindElements() {
        const onNameTextBoxKeyDown = this.onNameTextBoxKeyDown.bind(this);
        const nameTextBox = this.element.querySelector('input[type=text]');

        nameTextBox.addEventListener('keydown', onNameTextBoxKeyDown);

        this.nameTextBox = nameTextBox;


        const onStartButtonClick = this.onStartButtonClick.bind(this);
        const nextPageButtons = Array.from(this.element.querySelectorAll('div.button'));

        nextPageButtons.forEach((button) => {
            if ('ontouchstart' in document.documentElement) {
                button.addEventListener('touchstart', onStartButtonClick);
            }
            else {
                button.addEventListener('click', onStartButtonClick);
            }
        });
    }

    onEnterPage() {
        this.nameTextBox.focus();
    }

    onExitPage() {
        this.nameTextBox.value = '';
    }

    onNameTextBoxKeyDown(e) {
        if (e.key === 'Enter') {
            this.onNextPage();
        }
    }

    onStartButtonClick() {
        this.onNextPage();
    }

    onNextPage() {
        if (this.nameTextBox.value.length > 0) {
            this.transit('test', [], [this.nameTextBox.value]);
        }
    }
}

page.add(new NamePage('name'));