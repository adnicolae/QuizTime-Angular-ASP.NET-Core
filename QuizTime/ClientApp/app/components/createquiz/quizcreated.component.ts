import { Component } from '@angular/core';
import { Repository } from "../../data/repository";
import { Router } from "@angular/router";
import { Session } from "../../models/session.model";

@Component({
    selector: 'quiz-created',
    templateUrl: './quizcreated.component.html'
})
export class QuizCreatedComponent {

    constructor(private repo: Repository, private router: Router){}

    detailQuiz() {
        this.router.navigateByUrl("/fetch-quizzes/detail/" + this.repo.quizzes[this.repo.quizzes.length - 1].quizId);
    }

    createSession() {
        var generatedId: number = parseInt(this.generatePin());

        this.repo.createSession(new Session(0, 120, new Date(), generatedId, 1, this.repo.quizzes[this.repo.quizzes.length - 1]));

        this.router.navigateByUrl("/session-board/host/" + generatedId);
    }

    generatePin() {
        var min = 0;
        var max = 9999;
        return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(-4);
    }
}