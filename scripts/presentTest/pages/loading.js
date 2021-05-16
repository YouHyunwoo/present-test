import page from '../../page/page.js';



export class LoadingPage extends page.Page {
    constructor(pageId) {
        super(pageId);
    }

    onEnterPage(message) {
        const messageText = this.element.querySelector('h1');

        messageText.innerText = message;
    }

    onExitPage() {
    }
}

page.add(new LoadingPage('loading'));