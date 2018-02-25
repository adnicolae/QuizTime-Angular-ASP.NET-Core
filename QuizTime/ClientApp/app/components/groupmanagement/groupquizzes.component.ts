import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Repository } from '../../data/repository';
import { AuthService } from '../registration/auth.service';
import { Group } from '../../models/group.model';
import { Quiz } from '../../models/quiz.model';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: 'quizzes',
    templateUrl: 'groupquizzes.component.html',
    styles: [`
        .error {
            background-color: #fff0f0
        }
    `
    ]
})

export class GroupQuizzesComponent {
    constructor(private repo: Repository, private auth: AuthService, private router: Router,
        activeRoute: ActivatedRoute, ) {  
        let id = Number.parseInt(activeRoute.snapshot.params["id"]);
        if (id) {
            this.repo.getQuizzes(true, id);
        }
    }

    ngOnInit() {
        this.repo.alive = true;
    }

    //get group() {
    //    return this.repo.group;
    //}

    get quizzes() {
        return this.repo.quizzes;
    }

    ngOnDestroy() {
        this.repo.alive = false;
    }
}