//import { Quiz } from "../models/quiz.model";
//import { Result } from "../models/result.model";
//import { Injectable } from "@angular/core";
//import { Http, RequestMethod, Request, Response } from "@angular/http";
//import { Observable } from "rxjs/Observable";
//import "rxjs/add/operator/map";
//import { Filter } from "./configClasses.repository";

//const quizzesUrl = "/api/quizzes";

//@Injectable()
//export class Repository {
//    private filterObject = new Filter();
//    quiz: Quiz;
//    result: Result;
//    quizzes: Quiz[];
//    results: Result[];

//    constructor(private http: Http) {
//        this.filter.related = true;
//        this.getQuizzes();
//    }

//    getQuiz(id: number) {
//        this.sendRequest(RequestMethod.Get, quizzesUrl + "/" + id)
//            .subscribe(response => { this.quiz = response.json(); });
//    }

//    getQuizzes(related = false) {
//        let url = quizzesUrl + "?related=" + this.filter.related;

//        if (this.filter.search) {
//            url += "&search=" + this.filter.search;
//        }

//        this.sendRequest(RequestMethod.Get, url)
//            .subscribe(response => this.quizzes = response);
//    }

//    get filter(): Filter {
//        return this.filterObject;
//    }

//    // http.request is an Observable<Response> which will produce a Response when the request is complete
//    // the map method allows the observable to be transformed by parsing JSON from the HTTP reponse
//    private sendRequest(verb: RequestMethod, url: string, data?: any): Observable<any> {
//        return this.http.request(new Request({
//            method: verb,
//            url: url,
//            body: data
//        })).map(response => response.json());
//    }
//}