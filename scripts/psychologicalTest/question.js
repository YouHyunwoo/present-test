export class Choice {
    constructor(text, score) {
        this.text = text;
        this.score = score;
    }
}

export class Question {
    constructor(title, ...choices) {
        this.title = title;
        this.choices = choices;
    }

    shuffleChoices() {
        const shuffled = this.choices
            .map(a => ([Math.random(), a]))
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);

        this.choices = shuffled;
    }
}