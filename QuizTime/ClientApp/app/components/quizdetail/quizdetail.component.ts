import { Component } from '@angular/core';
import { Repository } from "../../data/repository";
import { Quiz } from "../../models/quiz.model";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "quiz-detail",
    templateUrl: "quizdetail.component.html"
})

export class QuizDetailComponent {

    constructor(
        private repo: Repository,
        router: Router,
        activeRoute: ActivatedRoute) {

        let id = Number.parseInt(activeRoute.snapshot.params["id"]);

        if (id) {
            this.repo.getQuiz(id);
        } else {
            router.navigateByUrl("/");
        }
    }
    get quiz(): Quiz {
        return this.repo.quiz;
    }
}