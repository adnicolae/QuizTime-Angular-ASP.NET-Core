import { Choice } from "./choice.model";
import { User } from "./user.model";

export class Quiz {
    constructor(
        public quizId?: number,
        public title?: string,
        public assignedPoints?: number,
        public dateCreated?: Date,
        public creator?: User,
        public choices?: Choice[]

    ) { }
}