export class ResultFilter {
    search?: string;
    related: boolean = true;
    participantUsername?: string;
    specific: boolean = true;
    last: number;

    reset() {
        this.related = true;
        this.specific = true;
    }
}

export class QuizFilter {
    search?: string;
    related: boolean = true;

    reset() {
        this.related = true;
    }
}