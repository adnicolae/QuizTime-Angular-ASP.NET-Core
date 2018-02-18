import { Component, Inject, OnDestroy } from "@angular/core";
import { Quiz } from "../../models/quiz.model";
import { Session } from "../../models/session.model";
import { Http } from '@angular/http';
import { Repository } from "../../data/repository";
import { Router } from "@angular/router";

const sessionsUrl = "api/sessions";

@Component(
    {
        selector: 'fetchquizzes',
        templateUrl: './fetchquizzes.component.html'
    }
)



export class FetchQuizzesComponent {
    baseUrl: string;
    private alive: boolean = true;

    constructor(private repo: Repository, private router: Router, private http: Http, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    get quiz(): Quiz {
        return this.repo.quiz;
    }

    get quizzes(): Quiz[] {
        if (this.repo.quizzes != null) {
            return this.repo.quizzes.reverse();
        }
        else {
            return this.repo.quizzes;
        }
    }

    get hostedSession(): Session {
        return this.repo.hostedSession;
    }

    get sessions(): Session[] {
        return this.repo.sessions;
    }

    selectQuiz(quizz: Quiz) {
        // generate random session id 
        var generatedId: number = parseInt(this.generatePin());
        //console.log(this.sessions.map(s => JSON.stringify(s.quiz)));
        //console.log(JSON.stringify(quizz));
        //TODO: add verification if a session for that quiz is already in status 1, then don't create a new one
        if (JSON.stringify(this.quiz) === JSON.stringify(quizz)) {
            console.log("already a session with quiz");
        } else {
            // create a new session
            //this.repo.createSession(new Session(0, new Date(), generatedId, 1, quizz));

            let data = {
                dateCreated: new Date(),
                generatedHostId: generatedId,
                status: 1,
                quiz: quizz ? quizz.quizId : 0
            };

            let url = this.baseUrl + sessionsUrl;

            this.http
                .post(url, data)
                .takeWhile(() => this.alive)
                .subscribe(response => {
                    // go to "/session-board/host/{id}"
                    this.router.navigateByUrl("/session-board/host/" + generatedId);
                });
        }
    }

    // handle session insertion
    logSession(quiz: Quiz) {
        console.log(quiz.quizId);
        console.log(this.generatePin());
    }

    generatePin() {
        var min = 1000;
        var max = 99999;
        return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(-4);
    }

    ngOnDestroy() {
        this.alive = false;
        //this.repo.alive = false;
    }
}