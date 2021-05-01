import { test } from '../data/test.js';



const targetNames = document.querySelectorAll('span.name');
const targetType = document.querySelector('header > h1 > .type');
const picture = document.querySelector('header > figure > img');
const recommendations = Array.from(document.querySelectorAll('.presents li'));

const shareButtons = Array.from(document.querySelectorAll('.share ul li'));
const linkCopyButton = document.querySelector('.share a#link-copy');
const ResultCopyButton = document.querySelector('.share a#result-copy');


const currentUrl = window.location.href;
const snsUrls = {
    twitter: 'https://twitter.com/intent/tweet?text=선물추천테스트:&url=',
    facebook: 'http://www.facebook.com/sharer/sharer.php?u=',
    kakaostory: 'https://story.kakao.com/share?url='
}

Kakao.init('93d73903be56c4b0c36e18df62621610');

shareButtons.forEach((button) => {
    if (button.id === 'kakaotalk') {
        button.addEventListener('click', shareKakaotalk);
    }
    else {
        button.addEventListener('click', shareSNS);
    }
});

function shareKakaotalk(e) {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const url = protocol + '//' + host;
    
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '선물 추천 테스트',
            description: '선물을 추천해드립니다!',
            imageUrl: url + '/images/thumbnail.png',
            link: {
                webUrl: currentUrl,
                mobileWebUrl: currentUrl,
            }
        }
    });
}

function shareSNS(e) {
    window.open(snsUrls[e.target.id] + currentUrl, '', 'width=600,height=300,top=100,left=100,scrollbars=yes');
}


linkCopyButton.addEventListener('click', (e) => {
    copyToClipboard(window.location.href);

    alert('링크 복사 완료!');
});

ResultCopyButton.addEventListener('click', (e) => {
    const content = document.querySelector('.content');

    html2canvas(content, { scrollY: -window.scrollY }).then(canvas => {
        canvas.toBlob(function(blob) {
            const item = new ClipboardItem({ "image/png": blob });

            navigator.clipboard.write([item]);
        });
    });

    alert('이미지 복사 완료!');
});

function copyToClipboard(text) {
    const ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.value = text;
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
}

function showResult() {
    const parameters = parseURLParamerter(currentUrl);

    if (!isValidURLParameter(parameters)) {
        backToPreviousPage();
    }

    const targetName = parameters['name'];

    const result = test.getResultByIndex(0);

    showTargetName(targetName);
    showTargetType(result);
    showTargetPicture(result);
    showRecommendation(result);
}

function showTargetName(name) {
    targetNames.forEach(targetName => {
        targetName.innerText = name;
    });
}

function showTargetType(result) {
    targetType.innerText = result.title;
}

function showTargetPicture(result) {
    picture.src = result.image;
}

function showRecommendation(result) {
    result.description.forEach((info, index) => {
        const recommendation = recommendations[index];

        const image = recommendation.querySelector('img');
        const link = recommendation.querySelector('a');

        image.src = info.image;
        link.href = info.link;
    });
}

function parseURLParamerter(url) {
    const result = {};

    const questionMarkPosition = url.indexOf('?');

    if (questionMarkPosition >= 0) {
        const parameterPart = url.slice(questionMarkPosition + 1);
        const eachParameter = parameterPart.split('&');
    
        eachParameter.forEach(parameter => {
            const [key, value] = parameter.split('=');
    
            result[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    }

    return result;
}

function isValidURLParameter(parameters) {
    return containsParameter(parameters) && containsResults(parameters);
}

function containsParameter(parameters) {
    return Object.keys(parameters).length >= 0;
}

function containsResults(parameters) {
    const containsTargetName = parameters.hasOwnProperty('name') && parameters['name'];
    const containsFirstResult = parameters.hasOwnProperty('result') && parameters['result'];

    return containsTargetName && containsFirstResult;
}

function backToPreviousPage() {
    history.back();
}

showResult();