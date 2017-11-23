import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { Choice } from '../../models/choice.model';
import { Injectable, Inject } from "@angular/core";
import { Http, RequestMethod, Request, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";
import { Router } from "@angular/router";

@Component({
    selector: 'create-quiz',
    templateUrl: './createquiz.component.html'
})
export class CreateQuizComponent implements OnDestroy{
    quizForm: FormGroup;
    latestQuiz: Quiz;
    quizTimeLimit: number = 30;
    private thisBaseUrl: string;
    errorMessage = "";
    private alive: boolean = true;

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

    ngOnDestroy() {
        this.alive = false;
        this.repo.alive = false;
    }

    onSubmit() {
        const formModel = this.quizForm.value;

        const newQuiz: Quiz = {
            quizId: 0,
            title: formModel.title as string,
            timeLimit: this.quizTimeLimit,
            dateCreated: new Date(),
            assignedPoints: formModel.assignedPoints as number,
            deducedPoints: formModel.deducedPoints as number,
            creator: this.repo.quizzes[1].creator
        };

        let data = {
            title: newQuiz.title,
            timeLimit: newQuiz.timeLimit,
            assignedPoints: newQuiz.assignedPoints,
            deducedPoints: newQuiz.deducedPoints,
            dateCreated: newQuiz.dateCreated,
            creator: newQuiz.creator ? newQuiz.creator.userId : 0
        };

        this.http
            .post(`${this.repo.urlBase}/api/quizzes`, data)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                console.log("New quiz with id: " + response.json());
                newQuiz.quizId = response.json();
                console.log(newQuiz);
                this.repo.quizzes.push(newQuiz);
                const ch: any = formModel.choices
                    .map((choice: Choice) => choice.choiceId = 0);
                const ch2: any = formModel.choices
                    .map((choice: Choice) => choice.quiz = newQuiz);
                const choicesCopy: Choice[] = formModel.choices.map(
                    (choice: Choice) => Object.assign(new Choice(), choice));
                for (var c in choicesCopy) {
                    var idx = parseInt(c) + 1;
                    choicesCopy.map((choice: Choice) => choice.title = "Choice " + idx.toString());
                    this.repo.createChoice(choicesCopy[c]);
                    console.log(choicesCopy[c]);
                }
                this.router.navigateByUrl("/new/quiz/created");
            }, response => {
                this.errorMessage = "Unable to insert quiz.";
                console.log(this.errorMessage);
            });
    }

    createForm() {
        this.quizForm = this.formBuilder.group({
            title: ['', Validators.required],
            timeLimit: '30',
            assignedPoints: '0',
            deducedPoints: '0',
            choices: this.formBuilder.array([]),
        });
    }


    addChoice() {
        this.choices.push(this.formBuilder.group(new Choice()));
    }

    removeChoice(index: number) {
        this.choices.removeAt(index);
    }

    increaseTimeLimit() {
        this.quizTimeLimit += 30;
    }

    decreaseTimeLimit() {
        this.quizTimeLimit -= 30;
    }
}