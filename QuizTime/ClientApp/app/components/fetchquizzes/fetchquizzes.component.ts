import { Component, Inject } from "@angular/core";
import { Quiz } from "../../models/quiz.model";
import { Http } from '@angular/http';

@Component(
    {
        selector: 'fetchquizzes',
        templateUrl: './fetchquizzes.component.html'
    }
)

export class FetchQuizzesComponent {
    public quizzes: Quiz[];

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        http.get(baseUrl + 'api/quizzes?related=true').subscribe(result => {
            this.quizzes = result.json() as Quiz[];
        }, error => console.error(error));
    }
}