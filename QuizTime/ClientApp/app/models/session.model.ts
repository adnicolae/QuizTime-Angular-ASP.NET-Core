import { Quiz } from "./quiz.model";
import { Result } from "./result.model";
import { User } from './user.model';

export class Session {
    constructor(
        public sessionId?: number,
        public dateCreated?: Date,
        public selectedToExplain?: User,
        public generatedHostId?: number,
        public status?: number,
        public quiz?: Quiz,
        public results?: Result[]
    ) { }
}