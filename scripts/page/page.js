const pages = {};
let current = null;

function add(page) {
    pages[page.id] = page;

    if (current === null) {
        current = page;
    }
}

function transit(pageId, exitArgs=[], enterArgs=[]) {
    current?.exit(...exitArgs);
    current = pages[pageId];
    current?.enter(...enterArgs);
    
    if (!pageId in pages) {
        console.log(`${pageId} page가 등록되어있지 않습니다.`);
    }
}

class Page {
    constructor(pageId) {
        this.id = pageId;

        this.element = document.querySelector(`#pages #${pageId}`);
    }

    transit(pageId, exitArgs, enterArgs) {
        transit(pageId, exitArgs, enterArgs);
    }

    enter(...args) {
        this.element.classList.remove('page-hide');
        this.onEnterPage(...args);
    }

    exit(...args) {
        this.element.classList.add('page-hide');
        this.onExitPage(...args);
    }

    onEnterPage() {}
    onExitPage() {}
}

export default {
    Page,
    add,
    transit,
};