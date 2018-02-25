import { Choice } from "./choice.model";
import { User } from "./user.model";
import { Group } from './group.model';

export class Quiz {
    constructor(
        public quizId?: number,
        public title?: string,
        public timeLimit?: number,
        public assignedPoints?: number,
        public deducedPoints?: number,
        public dateCreated?: Date,
        public group?: Group,
        public creator?: User,
        public choices?: Choice[]

    ) { }
}