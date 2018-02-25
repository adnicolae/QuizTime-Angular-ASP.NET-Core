import { User } from './user.model';
import { Quiz } from './quiz.model';

export class Group {
    constructor(
        public groupId?: number,
        public title?: string,
        public owner?: User,
        public dateCreated?: Date,
        public members?: User[],
        public quizzes?: Quiz[]
    ) {}

}