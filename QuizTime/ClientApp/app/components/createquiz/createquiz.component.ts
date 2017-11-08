import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { Choice } from '../../models/choice.model';
import { Injectable, Inject } from "@angular/core";
import { Http, RequestMethod, Request, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Router } from "@angular/router";

@Component({
    selector: 'create-quiz',
    templateUrl: './createquiz.component.html'
})
export class CreateQuizComponent {
    quizForm: FormGroup;
    latestQuiz: Quiz;
    private thisBaseUrl: string;

    constructor(private router: Router, private formBuilder: FormBuilder, private repo: Repository, private http: Http, @Inject('BASE_URL') baseUrl: string) {
        this.thisBaseUrl = baseUrl;
        this.createForm();
    }

    setChoices(choices: Choice[]) {
        const choiceFGs = choices.map(choice => this.formBuilder.group(choice));
        const choiceFromArray = this.formBuilder.array(choiceFGs);
        this.quizForm.setControl('choices', choiceFromArray);
    }

    get choices(): FormArray {
        return this.quizForm.get('choices') as FormArray;
    }

    get quizzes(): Quiz[] {
        return this.repo.quizzes;
    }

    addChoice() {
        this.choices.push(this.formBuilder.group(new Choice()));
    }

    removeChoice(index: number) {
        this.choices.removeAt(index);
    }

    onSubmit() {
        const formModel = this.quizForm.value;

        const saveQuiz: Quiz = {
            quizId: 0,
            title: formModel.title as string,
            dateCreated: new Date(),
            assignedPoints: formModel.assignedPoints as number,
            creator: this.repo.quizzes[1].creator
        };

        this.repo.createQuiz(saveQuiz); // add quiz to db and repository

        console.log(this.quizzes); // shows newly added quiz
        //this.wait(5000);
        console.log();
        var l = this.quizzes.length;
        console.log(l);
        console.log(this.repo.quizzes[this.repo.quizzes.length - 1]);
        console.log(this.getLastElement()); // gets the length-2 instead of -1 (penultimate)
        console.log(this.quizzes.slice(-1));
    }

    getLastElement() {
        return this.quizzes[this.quizzes.length - 1];
    }

    wait(ms: number) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    addChoices() {
        const formModel = this.quizForm.value;
        console.log(this.repo.quizzes[this.repo.quizzes.length - 1]);

        const ch: any = formModel.choices.map((choice: Choice) => choice.choiceId = 0);

        const ch2: any = formModel.choices.map((choice: Choice) => choice.quiz = this.repo.quizzes[this.repo.quizzes.length - 1]);

        const choicesCopy: Choice[] = formModel.choices.map(
            (choice: Choice) => Object.assign(new Choice(), choice));
        
        for (var c in choicesCopy) {
            //this.repo.createChoice(choicesCopy[c]);
            var idx = parseInt(c) + 1;
            choicesCopy.map((choice: Choice) => choice.title = "Choice " + idx.toString());
            console.log(choicesCopy[c]);
            this.repo.createChoice(choicesCopy[c]);
        }

        this.router.navigateByUrl("/new/quiz/created" );
    }

    showLastQuiz() {
        console.log(this.repo.quizzes[this.repo.quizzes.length - 1]);
    }

    createForm() {
        this.quizForm = this.formBuilder.group({
            title: ['', Validators.required],
            assignedPoints: '0',
            choices: this.formBuilder.array([]),
        });
    }

    getLastQuiz() {
        this.sendRequest(RequestMethod.Get, this.repo.urlBase + "api/quizzes/last")
            .subscribe(response => { this.latestQuiz = response });
    }

    private sendRequest(verb: RequestMethod, url: string, data?: any): Observable<any> {
        return this.http.request(new Request({
            method: verb,
            url: url,
            body: data
        })).map(response => response.json());
    }
}