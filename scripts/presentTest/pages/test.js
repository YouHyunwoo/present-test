import page from '../../page/page.js';
import url from '../../util/url.js';
import delay from '../../util/delay.js';
import { Tester } from '../../test/tester.js';
import { Test } from '../../test/test.js';
import { Choice } from '../../test/choice.js';
import { Question } from '../../test/question.js';
import { PresentTestResult } from '../test/result.js';
import { PresentTestSheet } from '../test/sheet.js';




export class TestPage extends page.Page {
    constructor(pageId) {
        super(pageId);

        this.personName = null;
        this.isAnimating = false;

        this.bindElements();
        this.initializeTester();
    }

    bindElements() {
        const progressImage = this.element.querySelector('header .progress .image img');
        const progressText = this.element.querySelector('header .progress .bar span');

        const questionText = this.element.querySelector('.question > h1');
        const questionImage = this.element.querySelector('.question > .image > img');
        
        this.choices = this.element.querySelector('.choices');


        Object.defineProperty(this, 'progressRatio', {
            set(v) {
                progressImage.style.marginLeft = `${v * 100}%`;
            }
        });

        Object.defineProperty(this, 'progressIndex', {
            set(v) {
                progressText.innerText = `${v + 1}`;
            }
        });

        Object.defineProperty(this, 'questionText', {
            set(v) {
                questionText.innerText = v;
            }
        });

        Object.defineProperty(this, 'questionImage', {
            set(v) {
                questionImage.src = v;
            }
        });
    }

    initializeTester() {
        (async () => {
            const tests = await (async () => {
                const response = await fetch('/data/test/present-test.json');
                const json = await response.json();

                return json.map((testData) => {
                    const question = new Question(testData.question.text, testData.question.image);

                    const choices = testData.choices.map((choiceData) =>
                        new Choice(choiceData.text, choiceData.image, choiceData.score)
                    );

                    return new Test(question, choices);
                });
            })();

            const results = await (async () => {
                const response = await fetch('/data/result/present-test.json');
                const json = await response.json();

                return json.map((resultData) =>
                    new PresentTestResult(resultData.type, resultData.image, resultData.description)
                );
            })();

            const testSheet = new PresentTestSheet(tests, results);

            this.tester = new Tester(testSheet);
        })();
    }

    showTest() {
        if (this.isAnimating === null) {
            this.showCurrentTest();
        }
        else {
            this.showCurrentTestWithAnimation();
        }
    }

    showCurrentTestWithAnimation() {
        this.startAnimation();
    
        new Promise((resolve) => {
            this.fadeOutAllNodes();
            resolve();
        })
        .then(delay(200))
        .then(() => {
            this.showCurrentTest();
    
            this.fadeInAllNodes();
        })
        .then(delay(200))
        .then(() => {
            this.stopAnimation();
        });
    }
    
    startAnimation() {
        this.isAnimating = true;
    }

    fadeOutAllNodes() {
        this.element.animate(
            [ { opacity: '0' } ],
            {
                duration: 200,
                direction: 'alternate',
                fill: 'forwards',
            }
        );
    }

    fadeInAllNodes() {
        this.element.animate(
            [ { opacity: '1' } ],
            {
                duration: 200,
                direction: 'alternate',
                fill: 'forwards',
            }
        );
    }

    stopAnimation() {
        this.isAnimating = false;
    }

    showCurrentTest() {
        const currentRatio = this.tester.getCurrentTestIndex() / this.tester.getTestCount();

        this.progressRatio = currentRatio;
        this.progressIndex = this.tester.getCurrentTestIndex();


        const currentTest = this.tester.getCurrentTest();
        
        const question = currentTest.question;

        this.questionText = question.text.replace('${name}', this.personName);
        this.questionImage = question.image;

        const choices = currentTest.choices;

        this.changeChoices(choices);
    }
    
    changeChoices(choices) {
        this.removePreviousChoices();
        this.appendCurrentChoices(choices);
    }
    
    removePreviousChoices() {
        const children = Array.from(this.choices.children);
    
        children.forEach((node) => {
            if (node.tagName === 'DIV') {
                node.remove();
            }
        });
    }
    
    appendCurrentChoices(choices) {
        choices.forEach((choice, index) => {
            const wrapDivision = document.createElement('div');
    
            wrapDivision.classList.add('choice');
            wrapDivision.classList.add('button');
    
                const choiceButton = document.createElement('a');
    
                choiceButton.innerHTML = choice.text;
    
            wrapDivision.appendChild(choiceButton);
            wrapDivision.addEventListener('click', (e) => {
                if (!this.isAnimating && !this.tester.isFinished()) {
                    this.chooseAnswer(index);
                    this.showNextTest();
                }
            });
    
            this.choices.appendChild(wrapDivision);
        });
    }

    chooseAnswer(index) {
        this.tester.chooseAnswer(index);
    }

    showNextTest() {
        this.tester.nextTest();
        
        if (this.tester.isFinished()) {
            this.transitResultPage();
        }
        else {
            this.showTest();
        }
    }
    
    transitResultPage() {
        this.transit('loading', [], ['테스트 결과 분석 중...']);

        new Promise((resolve) => {
            setTimeout(() => {
                const analyzedResult = this.tester.analyze();

                resolve(analyzedResult);
            }, 1000);
        })
        .then((analyzedResult) => {
            const parameters = {
                result: analyzedResult.index[0],
                name: this.personName,
            };

            const urlParameter = url.generateUrlParameter(parameters);

            window.location.href = 'result.html' + urlParameter;
        });
    }

    onEnterPage(personName) {
        this.personName = personName;

        if (this.isAnimating !== null) {
            this.element.style.opacity = '0';
        }

        if (this.tester === null) {
            this.transit('loading', [], ['테스트 데이터 불러오는 중...']);

            new Promise((resolve) => {
                const handle = setInterval(() => {
                    if (this.tester !== null) {
                        clearInterval(handle);
                        resolve();
                    }
                }, 500);
            })
            .then(() => {
                this.transit('test', [], [this.personName]);
            });
        }
        else {
            this.showTest();
        }
    }
}

page.add(new TestPage('test'));