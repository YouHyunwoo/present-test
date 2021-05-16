import page from '../../page/page.js';
import share from '../../util/share.js';



export class MainPage extends page.Page {
    constructor(pageId) {
        super(pageId);

        this.sharer = new share.Sharer('선물 추천 테스트', window.location.href);

        this.bindElements();
    }

    bindElements() {
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

        const onShareButtonClick = this.onShareButtonClick.bind(this);
        const shareButtons = Array.from(this.element.querySelectorAll('.share ul li'));

        shareButtons.forEach((button) => {
            if ('ontouchstart' in document.documentElement) {
                button.addEventListener('touchstart', onShareButtonClick);
            }
            else {
                button.addEventListener('click', onShareButtonClick);
            }
        });
    }

    onStartButtonClick(e) {
        this.transit('name');
    }
    
    onShareButtonClick(e) {
        this.sharer.share(e.target.className);
    }
}

page.add(new MainPage('main'));
page.transit('main');