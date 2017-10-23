import { Quiz } from "../models/quiz.model";
import { Result } from "../models/result.model";
import { Injectable, Inject } from "@angular/core";
import { Http, RequestMethod, Request, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { QuizFilter, ResultFilter } from "./config.repository";

const quizzesUrl = "api/quizzes";
const resultsUrl = "api/results";

@Injectable()
export class Repository {
    private quizFilterObject = new QuizFilter();
    private resultFilterObject = new ResultFilter();
    quiz: Quiz;
    result: Result;
    quizzes: Quiz[];
    results: Result[];

    constructor(private http: Http, @Inject('BASE_URL') baseUrl: string) {
        this.quizFilter.related = true;
        this.getQuizzes(baseUrl);
        this.getResults(baseUrl);
    }

    getQuiz(id: number) {
        this.sendRequest(RequestMethod.Get, quizzesUrl + "/" + id)
            .subscribe(response => { this.quiz = response.json(); });
    }

    getResult(id: number) {
        this.sendRequest(RequestMethod.Get, resultsUrl + "/" + id)
            .subscribe(response => { this.result = response.json(); });
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