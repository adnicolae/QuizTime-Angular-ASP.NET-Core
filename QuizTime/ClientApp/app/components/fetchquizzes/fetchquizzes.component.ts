import { Component, Inject } from "@angular/core";
import { Quiz } from "../../models/quiz.model";
import { Http } from '@angular/http';
import { Repository } from "../../data/repository";

@Component(
    {
        selector: 'fetchquizzes',
        templateUrl: './fetchquizzes.component.html'
    }
)

export class FetchQuizzesComponent {

    constructor(private repo: Repository) { }

    get quiz(): Quiz {
        return this.repo.quiz;
    }

    get quizzes(): Quiz[] {
        return this.repo.quizzes;
    }

    createQuiz() {
        this.repo.createQuiz(new Quiz(0, "New CS130 Quiz", 15, new Date(), this.repo.quizzes[1].creator));
    }

    // handle session insertion
    logSession(quiz: Quiz) {
        console.log(quiz.quizId);
    }
}