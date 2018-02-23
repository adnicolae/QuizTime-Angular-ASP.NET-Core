import { Component, OnDestroy } from '@angular/core';
import { Repository } from "../../data/repository";
import { Quiz } from "../../models/quiz.model";
import { Router, ActivatedRoute } from "@angular/router";
import { Result } from '../../models/result.model';
import { Http } from '@angular/http';

@Component({
    selector: "quiz-detail",
    templateUrl: "quizdetail.component.html"
})

export class QuizDetailComponent implements OnDestroy {
    quizResults: Result[];
    private alive: boolean = true;

    constructor(
        private repo: Repository,
        private router: Router,
        activeRoute: ActivatedRoute,
        private http: Http) {

        let id = Number.parseInt(activeRoute.snapshot.params["id"]);

        if (id) {
            this.repo.getQuiz(id);
            this.repo.getResults(id).subscribe(response => this.quizResults = response);
        } else {
            router.navigateByUrl("/");
        }
    }

    selectQuiz(quizz: Quiz) {
        // generate random session id 
        var generatedId: number = parseInt(this.generatePin());
        let data = {
            dateCreated: new Date(),
            generatedHostId: generatedId,
            status: 1,
            quiz: quizz ? quizz.quizId : 0
        };

        let url = this.repo.urlBase + "/api/sessions";

        this.http
            .post(url, data)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                // go to "/session-board/host/{id}"
                this.router.navigateByUrl("/session-board/host/" + generatedId);
            });
    }

    ngOnInit() {
        this.repo.alive = true;
    }

    ngOnDestroy() {
        this.alive = false;
        this.repo.alive = false;
    }

    generatePin() {
        var min = 1000;
        var max = 99999;
        return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(-4);
    }

    get quiz(): Quiz {
        return this.repo.quiz;
    }
}