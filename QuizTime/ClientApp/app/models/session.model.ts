import { Quiz } from "./quiz.model";
import { Result } from "./result.model";

export class Session {
    constructor(
        public sessionId?: number,
        public timeLimit?: number,
        public dateCreated?: Date,
        public results?: Result[],
        public quiz?: Quiz
    ) { }
}