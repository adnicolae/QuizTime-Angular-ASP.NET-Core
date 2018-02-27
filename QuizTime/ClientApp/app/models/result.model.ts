import { User } from "./user.model";
import { Session } from "./session.model";
import { Choice } from "./choice.model";

export class Result {
    constructor(
        public resultId?: number,
        public score?: number,
        public participatedSelection?: boolean,
        public selectedToExplain?: boolean,
        public positiveVote?: boolean,
        public sessionParticipant?: User,
        public session?: Session,
        public choice?: Choice
    ){}
}