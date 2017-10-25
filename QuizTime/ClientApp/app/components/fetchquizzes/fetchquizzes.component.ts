import { Component, Inject } from "@angular/core";
import { Quiz } from "../../models/quiz.model";
import { Session } from "../../models/session.model";
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

    get hostedSession(): Session {
        return this.repo.hostedSession;
    }

    createQuiz() {
        this.repo.createQuiz(new Quiz(0, "New CS130 Quiz", 15, new Date(), this.repo.quizzes[1].creator));
    }

    selectQuiz(quizz: Quiz) {
        // generate random session id 
        var generatedId: number = parseInt(this.generatePin());

        //TODO: add verification if a session for that quiz is already in status 1, then don't create a new one

        // create a new session
        this.repo.createSession(new Session(0, 120, new Date(), generatedId, 1, quizz));

        // go to "/session-board/host/{id}"
        this.router.navigateByUrl("/session-board/host/" + generatedId);
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