import { Component, Inject, OnDestroy } from "@angular/core";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { Quiz } from "../../models/quiz.model";
import { Group } from "../../models/group.model";
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
        this.repo.getGroup(7);

    }

    get quiz(): Quiz {
        return this.repo.quiz;
    }

    //get quizzes(): Quiz[] {
    //    if (this.repo.quizzes != null) {
    //        return this.repo.quizzes.reverse();
    //    }
    //    else {
    //        return this.repo.quizzes;
    //    }
    //}

    ngOnInit() {
        this.repo.alive = true;
    }

    get groups() {
        return this.repo.group;
    }

    ngOnDestroy() {
        //this.alive = false;
        console.log("Repo set to alive");
        this.repo.alive = false;
    }

}