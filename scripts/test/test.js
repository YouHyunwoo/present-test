export class Test {
    constructor(question, choices) {
        this.question = question;
        this.choices = choices;
        
        this.answer = 0;
    }

    getSelectedChoiceScore() {
        return this.choices[this.answer].score;
    }
}