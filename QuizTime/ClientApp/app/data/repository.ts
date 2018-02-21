import { Quiz } from "../models/quiz.model";
import { Result } from "../models/result.model";
import { Session } from "../models/session.model";
import { Choice } from "../models/choice.model";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Http, RequestMethod, Request, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/map";
import { QuizFilter, ResultFilter } from "./config.repository";
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../components/registration/auth.service';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

const quizzesUrl = "api/quizzes";
const resultsUrl = "api/results";
const sessionsUrl = "api/sessions";
const choicesUrl = "api/choices";

@Injectable()
export class Repository {
    private quizFilterObject = new QuizFilter();
    private resultFilterObject = new ResultFilter();
    quiz: Quiz;
    result: Result;
    session: Session;
    hostedSession: Session;
    quizzes: Quiz[];
    results: Result[];
    participantResults: Result[];
    sessions: Session[];
    latestQuiz: Quiz;
    alive: boolean = true;
    urlBase: string;
    isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: Http, @Inject('BASE_URL') baseUrl: string, private cookieService: CookieService, private auth: AuthService) {
        this.quizFilter.related = true;
        this.urlBase = baseUrl;
        this.getQuizzes(baseUrl);
        //this.getResults();
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.getParticipantResults(0);
        }
        //this.getSessions();
    }

    getQuiz(id: number) {
        this.sendRequest(RequestMethod.Get, this.urlBase + quizzesUrl + "/" + id)
            .subscribe(response => { this.quiz = response; });
    }

    getLastQuiz() {
        this.sendRequest(RequestMethod.Get, this.urlBase + quizzesUrl + "/last")
            .subscribe(response => { this.latestQuiz = response });
    }

    getResult(id: number) {
        this.sendRequest(RequestMethod.Get, this.urlBase + resultsUrl + "/" + id)
            .subscribe(response => { this.result = response; });
    }

    getSession(id: number) {
        this.sendRequest(RequestMethod.Get, this.urlBase + sessionsUrl + "/" + id)
            .subscribe(response => { this.session = response; });
    }

    getHostedSession(generatedHostId: number) {
        this.sendRequest(RequestMethod.Get, this.urlBase + sessionsUrl + "/host/" + generatedHostId)
            .takeWhile(() => this.alive)
            .subscribe(response => { this.hostedSession = response; });
    }

    getQuizzes(baseUrl: string, related = true) {
        let url = baseUrl + quizzesUrl + "?related=" + this.quizFilter.related;

        if (this.quizFilter.search) {
            url += "&search=" + this.quizFilter.search;
        }

        this.sendRequest(RequestMethod.Get, url)
            .subscribe(response => this.quizzes = response);
    }

    getParticipantResults(last: number) {
        let url = this.urlBase + resultsUrl + "?specific=" + this.resultFilter.specific + "&related=" + this.resultFilter.related;
        if (this.auth.isAuthenticated) {
            this.resultFilter.participantUsername = this.auth.name as string;
            this.resultFilter.last = last;
            url += "&participantUsername=" + this.resultFilter.participantUsername;
            url += "&last=" + this.resultFilter.last;
            this.sendRequest(RequestMethod.Get, url)
                .takeWhile(() => this.alive)
                .subscribe(response => this.participantResults = response);
        }
    }

    getSessions() {
        let url = this.urlBase + sessionsUrl;

        this.sendRequest(RequestMethod.Get, url)
            .subscribe(response => this.sessions = response);
    }

    createQuiz(newQuiz: Quiz) {
        let data = {
            title: newQuiz.title,
            timeLimit: newQuiz.timeLimit,
            assignedPoints: newQuiz.assignedPoints,
            deducedPoints: newQuiz.deducedPoints,
            dateCreated: newQuiz.dateCreated,
            creator: newQuiz.creator ? newQuiz.creator.userId : 0
        };

        let url = this.urlBase + quizzesUrl;

        this.sendRequest(RequestMethod.Post, url, data)
            .subscribe(response => {
                newQuiz.quizId = response;
                this.quizzes.push(newQuiz);
            });
    }

    createChoice(newChoice: Choice) {
        let data = {
            title: newChoice.title,
            correctness: newChoice.correctness,
            quiz: newChoice.quiz ? newChoice.quiz.quizId : 0
        };

        let url = this.urlBase + choicesUrl;

        this.sendRequest(RequestMethod.Post, url, data)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                newChoice.choiceId = response;
            });
    }

    createResult(score: number, participant: string, session: number) {
        let data = {
            score: score,
            sessionParticipant: participant,
            session: session
        };

        let url = this.urlBase + resultsUrl;

        this.sendRequest(RequestMethod.Post, url, data)
            .takeWhile(() => this.alive)
            .subscribe(response => { this.cookieService.put("resultId", response); });
    }

    createSession(newSession: Session) {
        let data = {
            dateCreated: newSession.dateCreated,
            generatedHostId: newSession.generatedHostId,
            status: newSession.status,
            quiz: newSession.quiz ? newSession.quiz.quizId : 0
        };

        let url = this.urlBase + sessionsUrl;

        this.sendRequest(RequestMethod.Post, url, data)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                newSession.sessionId = response;
                this.sessions.push(newSession);
            });
    }

    updateSession(id: number, changes: Map<string, any>) {
        let patch: any[] = [];
        changes.forEach((value, key) =>
            patch.push({ op: "replace", path: key, value: value }));

        let url = this.urlBase + sessionsUrl;

        this.http.patch(url + "/" + id, patch)
            .takeWhile(() => this.alive)
            .subscribe(response => this.getSessions());
        //this.sendRequest(RequestMethod.Patch, url + "/" + id, patch)
        //    .subscribe(response => this.getSessions());
    }

    updateResult(id: number, changes: Map<string, any>) {
        let patch: any[] = [];
        changes.forEach((value, key) =>
            patch.push({ op: "replace", path: key, value: value }));

        let url = this.urlBase + resultsUrl;

        this.http.patch(url + "/" + id, patch)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                //this.getResults();
                console.log("Updated result " + id + ";");
            }, response => {
                console.log("Unable to update result " + id);
            });
    }

    getUser() {
        console.log(this.auth.tokenHeader);
        return this.http.get(this.urlBase + 'api/users/me', this.auth.tokenHeader).map(response => response.json());
        //return this.sendRequest(RequestMethod.Get, this.urlBase + '/users/me', this.auth.tokenHeader);
    }

    saveUser(userData) {
        return this.http.post(this.urlBase + 'api/users/me', userData, this.auth.tokenHeader).map(response => response.json());
    }

    get resultFilter(): ResultFilter {
        return this.resultFilterObject;
    }

    get quizFilter(): QuizFilter {
        return this.quizFilterObject;
    }

    // http.request is an Observable<Response> which will produce a Response when the request is complete
    // the map method allows the observable to be transformed by parsing JSON from the HTTP reponse
    private sendRequest(verb: RequestMethod, url: string, data?: any): Observable<any> {
        return this.http.request(new Request({
            method: verb,
            url: url,
            body: data
        })).map(response => response.json());
    }


}