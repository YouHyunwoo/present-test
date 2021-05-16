import { TestResult } from '../../test/result.js';



export class PresentTestResult extends TestResult {
    constructor(type, image, description, recommendations) {
        super(type, image, description);

        this.recommendations = recommendations;
    }
}