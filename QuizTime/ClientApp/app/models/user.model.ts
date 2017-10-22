import { Result } from "./result.model";
import { Quiz } from "./quiz.model";

export class User {
    constructor(
        public userId?: number,
        public username?: string,
        public password?: string,
        public quizzesCreated?: Quiz[],
        public results?: Result[]
    ) { }
}