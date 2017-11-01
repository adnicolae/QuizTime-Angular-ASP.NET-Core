import { Quiz } from "../models/quiz.model";
import { Result } from "../models/result.model";
import { Session } from "../models/session.model";
import { Choice } from "../models/choice.model";
import { Injectable, Inject } from "@angular/core";
import { Http, RequestMethod, Request, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { QuizFilter, ResultFilter } from "./config.repository";

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
    sessions: Session[];
    latestQuiz: Quiz;
    urlBase: string;

    constructor(private http: Http, @Inject('BASE_URL') baseUrl: string) {
        this.quizFilter.related = true;
        this.urlBase = baseUrl;
        this.getQuizzes(baseUrl);
        this.getResults(baseUrl);
        this.getSessions();
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

    getResults(baseUrl: string) {
        let url = baseUrl + resultsUrl + "?specific=" + this.resultFilter.specific + "&related=" + this.resultFilter.related;

        if (this.quizFilter.search) {
            url += "&search=" + this.resultFilter.search;
        }

        if (this.resultFilter.participantId) {
            url += "&participantId=" + this.resultFilter.participantId;
        }

        this.sendRequest(RequestMethod.Get, url)
            .subscribe(response => this.results = response);
    }

    getSessions() {
        let url = this.urlBase + sessionsUrl;

        this.sendRequest(RequestMethod.Get, url)
            .subscribe(response => this.sessions = response);
    }

    createQuiz(newQuiz: Quiz) {
        let data = {
            title: newQuiz.title,
            assignedPoints: newQuiz.assignedPoints,
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
            .subscribe(response => {
                newChoice.choiceId = response;
            });
    }

    createSession(newSession: Session) {
        let data = {
            timeLimit: newSession.timeLimit,
            dateCreated: newSession.dateCreated,
            generatedHostId: newSession.generatedHostId,
            status: newSession.status,
            quiz: newSession.quiz ? newSession.quiz.quizId : 0
        };

        let url = this.urlBase + sessionsUrl;

        this.sendRequest(RequestMethod.Post, url, data)
            .subscribe(response => {
                newSession.sessionId = response;
                this.sessions.push(newSession);
            });
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