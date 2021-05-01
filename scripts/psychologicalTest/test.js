export class Test {
    constructor(results, questions) {
        this.results = results;
        this.questions = questions;

        this.scores = null;
        this.rankingResultIndices = null;

        this.reset();
    }

    nextQuestion() {
        this.currentQuestionIndex = Math.min(this.currentQuestionIndex + 1, this.questions.length);
    }

    reset() {
        this.resetScore();
        this.resetRankingResult();
        this.resetQuestion();
    }

    resetScore() {
        this.setAllScoreToZero();
    }

    resetRankingResult() {
        this.rankingResultIndices = null;
    }

    setAllScoreToZero() {
        this.scores = this.results.map(() => 0);
    }

    resetQuestion() {
        // this.shuffleQuestions();
        // this.shuffleChoices();
        this.moveToFirstQuestion();
    }

    shuffleQuestions() {
        const shuffled = this.questions
            .map(a => ([Math.random(), a]))
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);

        this.questions = shuffled;
    }

    shuffleChoices() {
        this.questions.forEach((question) => {
            question.shuffleChoices();
        });
    }

    moveToFirstQuestion() {
        this.currentQuestionIndex = 0;
    }

    chooseAnswer(choiceIndex) {
        this.cumulateAnswerScore(choiceIndex);

        console.log(this.scores);
    }

    cumulateAnswerScore(choiceIndex) {
        const cumulatedScores = this.scores.map((score, scoreIndex) =>
            score + this.questions[this.currentQuestionIndex].choices[choiceIndex].score[scoreIndex]
        );

        this.scores = cumulatedScores;
    }

    isFinished() {
        return this.currentQuestionIndex >= this.questions.length;
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    getCurrentRatio() {
        return (this.currentQuestionIndex + 1) / this.questions.length;
    }

    sortScore() {
        const sorted = this.scores
            .map((score, index) => [score, index])
            .sort((a, b) => b[0] - a[0]);
            
        this.scores = sorted.map((value) => value[0]);
        this.rankingResultIndices = sorted.map((value) => value[1]);
    }

    getResultByIndex(index) {
        return this.results[index];
    }

    getResultIndexByRank(rank) {
        const length = this.rankingResultIndices.length;

        const index = (rank % length + length) % length;

        return this.rankingResultIndices[index];
    }
}