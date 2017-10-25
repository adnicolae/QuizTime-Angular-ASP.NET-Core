import { Component, Inject } from "@angular/core";
import { Quiz } from "../../models/quiz.model";
import { Http } from '@angular/http';
import { Repository } from "../../data/repository";
import { Router } from "@angular/router";

@Component(
    {
        selector: 'fetchquizzes',
        templateUrl: './fetchquizzes.component.html'
    }
)

export class FetchQuizzesComponent {

    constructor(private repo: Repository, private router: Router) { }

    get quiz(): Quiz {
        return this.repo.quiz;
    }

    get quizzes(): Quiz[] {
        return this.repo.quizzes;
    }

    createQuiz() {
        this.repo.createQuiz(new Quiz(0, "New CS130 Quiz", 15, new Date(), this.repo.quizzes[1].creator));
    }

    selectQuiz(id: number) {
        this.repo.getQuiz(id);
        this.router.navigateByUrl("/session-board");
    }

    // handle session insertion
    logSession(quiz: Quiz) {
        console.log(quiz.quizId);
        console.log(this.generatePin());
    }

    generatePin() {
        var min = 0;
        var max = 9999;
        return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(-4);
    }
}