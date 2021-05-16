export class TestSheet {
    constructor(tests, results) {
        this.tests = tests;
        this.results = results;

        this.reset();
    }

    reset() {
        console.assert(this.tests.length > 0);

        this._currentTestIndex = 0;
    }

    getTestCount() {
        return this.tests.length;
    }

    getCurrentTestIndex() {
        return this._currentTestIndex;
    }

    getCurrentTest() {
        return this.tests[this._currentTestIndex];
    }

    chooseAnswer(index) {
        this.tests[this._currentTestIndex].answer = index;
    }

    nextTest() {
        this._currentTestIndex++;
    }

    analyze() {
        const zeroScore = this.results.map(() => 0);

        const cumulativeScore = this.tests.reduce((acc, test) => {
            const choiceScore = test.getSelectedChoiceScore();
            
            return acc.map((s, i) => { s + choiceScore[i] });
        }, zeroScore);

        const sortedScore = cumulativeScore
            .map((score, index) => [score, index])
            .sort((a, b) => b[0] - a[0]);

        const rankingIndices = sortedScore.map((value) => value[1]);
        const rankingScores = sortedScore.map((value) => value[0]);

        return {
            index: rankingIndices,
            score: rankingScores
        };
    }
}