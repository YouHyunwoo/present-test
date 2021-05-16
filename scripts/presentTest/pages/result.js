import page from '../../page/page.js';
import share from '../../util/share.js';
import clipboard from '../../util/clipboard.js';
import url from '../../util/url.js';
import { PresentTestResult } from '../test/result.js';



export class ResultPage extends page.Page {
    constructor(pageId) {
        super(pageId);

        this.results = null;
        this.sharer = new share.Sharer('선물 추천 테스트', window.location.href);

        this.bindElements();
        this.loadResults();
    }

    bindElements() {
        this.personNameTexts = this.element.querySelectorAll('span.person-name');
        this.resultTypeText = this.element.querySelector('header h1');
        this.resultTypeImage = this.element.querySelector('header img');
        this.resultTypeDescription = this.element.querySelector('header p');
        this.recommendationItems = Array.from(this.element.querySelectorAll('.recommendation li'));


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

        const onLinkCopyButtonClick = this.onLinkCopyButtonClick.bind(this);
        const linkCopyButton = this.element.querySelector('.share a#link-copy');

        linkCopyButton.addEventListener('click', onLinkCopyButtonClick);

        const onResultCopyButtonClick = this.onResultCopyButtonClick.bind(this);
        const resultCopyButton = this.element.querySelector('.share a#result-copy');

        resultCopyButton.addEventListener('click', onResultCopyButtonClick);
    }

    loadResults() {
        (async () => {
            this.results = await (async () => {
                const response = await fetch('/data/result/present-test.json');
                const json = await response.json();

                return json.map((resultData) =>
                    new PresentTestResult(
                        resultData.type, resultData.image, resultData.description, resultData.recommendations
                    )
                );
            })();

            this.showResult();
        })();
    }

    onEnterPage() {
        if (this.results == null) {
            this.transit('loading', [], ['테스트 결과 불러오는 중...']);

            new Promise((resolve) => {
                const handle = setInterval(() => {
                    if (this.results !== null) {
                        clearInterval(handle);
                        resolve();
                    }
                }, 300);
            })
            .then(() => {
                this.transit('result', [], [this.personName]);
            });
        }
    }

    showResult() {
        const parameters = url.parseUrlParamerter(window.location.href);
    
        if (!url.isValidUrlParameter(parameters)) {
            this.backToPreviousPage();
        }
    
        const personName = parameters['name'];
        const resultIndex = parameters['result'];
    
        const result = this.results[parseInt(resultIndex)];
    
        this.showPersonName(personName);
        this.showResultTypeText(result.type);
        this.showResultTypeImage(result.image);
        this.showResultTypeDescription(result.description);
        this.showRecommendations(result.recommendations);
    }

    backToPreviousPage() {
        history.back();
    }

    showPersonName(personNameText) {
        this.personNameTexts.forEach(element => {
            element.innerText = personNameText;
        });
    }
    
    showResultTypeText(resultTypeText) {
        this.resultTypeText.innerText = resultTypeText;
    }
    
    showResultTypeImage(resultTypeImage) {
        this.resultTypeImage.src = resultTypeImage;
    }
    
    showResultTypeDescription(resultTypeDescription) {
        this.resultTypeDescription.innerHTML = resultTypeDescription;
    }

    showRecommendations(recommendations) {
        recommendations.forEach((recommendation, index) => {
            const recommendationItem = this.recommendationItems[index];
    
            const image = recommendationItem.querySelector('img');
            const link = recommendationItem.querySelector('a');
    
            image.src = recommendation.image;
            link.href = recommendation.link;
        });
    }

    onShareButtonClick(e) {
        this.sharer.share(e.target.className);
    }

    onLinkCopyButtonClick() {
        clipboard.copyText(window.location.href);
        
        alert('링크 복사 완료!');
    }

    onResultCopyButtonClick() {
        clipboard.copyHTMLContent(document.body);
    
        alert('결과 복사 완료!');
    }
}

page.add(new ResultPage('result'));
page.transit('result');