export class Tester {
    constructor(testSheet) {
        this.testSheet = testSheet;
    }

    getTestCount() {
        return this.testSheet.getTestCount();
    }

    getCurrentTestIndex() {
        return this.testSheet.getCurrentTestIndex();
    }

    isFinished() {
        return this.getTestCount() <= this.getCurrentTestIndex();
    }

    nextTest() {
        this.testSheet.nextTest();
    }

    getCurrentTest() {
        return this.testSheet.getCurrentTest();
    }

    chooseAnswer(index) {
        this.testSheet.chooseAnswer(index);
    }

    analyze() {
        return this.testSheet.analyze();
    }
}