import { Component, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { Choice } from '../../models/choice.model';
import { Group } from '../../models/group.model';
import { Injectable, Inject } from "@angular/core";
import { Http, RequestMethod, Request, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";
import { Router } from "@angular/router";
import { AuthService } from '../registration/auth.service';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

declare var $;

@Component({
    selector: 'create-quiz',
    templateUrl: './createquiz.component.html'
})
export class CreateQuizComponent implements OnDestroy{
    quizForm: FormGroup;
    latestQuiz: Quiz;
    quizTimeLimit: number = 30;
    quizAssignedPoints: number = 0;
    quizDeducedPoints: number = 0;
    private thisBaseUrl: string;
    errorMessage = "";
    private alive: boolean = true;
    isBrowser: boolean;
    defaultTitle: string;
    selectedGroup;

    constructor( @Inject(PLATFORM_ID) private platformId: Object, private router: Router, private formBuilder: FormBuilder, private repo: Repository, private http: Http, @Inject('BASE_URL') baseUrl: string, public auth: AuthService) {
        this.thisBaseUrl = baseUrl;
        this.createForm();
        this.isBrowser = isPlatformBrowser(platformId);
        //this.groups = this.groups.slice(this.groups.length - 5, this.groups.length)
    }

    ngOnInit() {
        $('.ui.checkbox')
            .checkbox()
            ;
        $('#select')
            .dropdown()
            ;

        this.repo.getUser().subscribe(response => {
            this.defaultTitle = response.defaultQuizTitle;
        });

        this.selectedGroup = this.groups[0];
    }

    get groups() {
        return this.repo.userGroups.slice(0, 4);
    }

    onChangeSelect(newGroup) {
        this.selectedGroup = newGroup;
    }

    setChoices(choices: Choice[]) {
        const choiceFGs = choices.map(choice => this.formBuilder.group(choice));
        const choiceFromArray = this.formBuilder.array(choiceFGs);
        this.quizForm.setControl('choices', choiceFromArray);
    }

    get choices(): FormArray {
        return this.quizForm.get('choices') as FormArray;
    }

    setTrue(choice) {
        choice.value.correctness = true;
    }

    setFalse(choice) {
        choice.value.correctness = false;
    }

    ngOnDestroy() {
        this.alive = false;
        this.repo.alive = false;
    }

    onSubmit() {
        const formModel = this.quizForm.value;
        const groupQuizId = this.selectedGroup.quizzes.length + 1;
        console.log(groupQuizId);
        console.log("Quiz " + groupQuizId);
        const newQuiz: Quiz = {
            quizId: 0,
            group: this.selectedGroup,
            title: ("Quiz #" + groupQuizId) as string,
            timeLimit: this.quizTimeLimit,
            dateCreated: new Date(),
            assignedPoints: this.quizAssignedPoints,
            deducedPoints: this.quizDeducedPoints
        };

        let data = {
            group: this.selectedGroup.groupId,
            title: newQuiz.title,
            timeLimit: newQuiz.timeLimit,
            assignedPoints: newQuiz.assignedPoints,
            deducedPoints: newQuiz.deducedPoints,
            dateCreated: newQuiz.dateCreated,
            creator: this.auth.username
        };
        console.log(data);

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
                if (formModel.startSessionBool) {
                    var generatedId: number = parseInt(this.generatePin());

                    let sessionData = {
                        dateCreated: new Date(),
                        generatedHostId: generatedId,
                        status: 1,
                        quiz: newQuiz.quizId
                    };

                    this.http
                        .post(`${this.repo.urlBase}/api/sessions`, sessionData)
                        .takeWhile(() => this.alive)
                        .subscribe(response => {
                            // go to "/session-board/host/{id}"
                            this.router.navigateByUrl("/session-board/host/" + generatedId);
                        });
                }
                else {
                    this.router.navigateByUrl("/new/quiz/created");
                }
            }, response => {
                this.errorMessage = "Unable to insert quiz.";
                console.log(this.errorMessage);
                console.log(response);
            });
    }

    createForm() {
        this.quizForm = this.formBuilder.group({
            timeLimit: '30',
            assignedPoints: '0',
            deducedPoints: '0',
            choices: this.formBuilder.array([]),
            startSessionBool: true,
        });
        this.choices.push(this.formBuilder.group(new Choice()));
        this.choices.push(this.formBuilder.group(new Choice()));
    }


    addChoice() {
        this.choices.push(this.formBuilder.group(new Choice()));
    }

    removeChoice(index: number) {
        this.choices.removeAt(index);
    }

    increaseAssignedPoints() {
        this.quizAssignedPoints += 5;
    }

    increaseDeducedPoints() {
        this.quizDeducedPoints += 5;
    }

    decreaseAssignedPoints() {
        if (this.quizAssignedPoints >= 5) {
            this.quizAssignedPoints -= 5;
        }
    }

    decreaseDeducedPoints() {
        if (this.quizDeducedPoints >= 5) {
            this.quizDeducedPoints -= 5;
        }
    }

    increaseTimeLimit() {
        this.quizTimeLimit += 30;
    }

    decreaseTimeLimit() {
        if (this.quizTimeLimit >= 30) {
            this.quizTimeLimit -= 30;
        }
    }

    generatePin() {
        var min = 1000;
        var max = 99999;
        return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(-4);
    }
}