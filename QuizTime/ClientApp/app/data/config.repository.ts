export class ResultFilter {
    search?: string;
    related: boolean = true;
    participantId?: number;
    specific: boolean = true;

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