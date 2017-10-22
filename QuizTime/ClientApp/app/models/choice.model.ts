import { Quiz } from "./quiz.model";

export class Choice {
    constructor(
        public choiceId?: number,
        public title?: string,
        public correctness?: boolean,
        public quiz?: Quiz
    ){}
}