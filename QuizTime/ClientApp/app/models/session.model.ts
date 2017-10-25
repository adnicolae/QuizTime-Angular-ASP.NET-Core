import { Quiz } from "./quiz.model";
import { Result } from "./result.model";

export class Session {
    constructor(
        public sessionId?: number,
        public timeLimit?: number,
        public dateCreated?: Date,
        public generatedHostId?: number,
        public status?: number,
        public results?: Result[],
        public quiz?: Quiz
    ) { }
}