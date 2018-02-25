import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Repository } from '../../data/repository';
import { AuthService } from '../registration/auth.service';
import { Group } from '../../models/group.model';
import { Router, ActivatedRoute } from "@angular/router";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
    selector: 'results',
    templateUrl: 'groupresults.component.html',
    styles: [`
        .error {
            background-color: #fff0f0
        }
    `
    ]
})

export class GroupResultsComponent {
    constructor(private repo: Repository, private auth: AuthService, private router: Router,
        private activeRoute: ActivatedRoute, ) {        
    }

    ngOnInit() {
        let id = Number.parseInt(this.activeRoute.snapshot.params["id"]);
        if (id > 0) {
            this.repo.getGroupResults(id);
        }
    }

    get groupResults() {
        return this.repo.groupResults;
    }

    downloadExcel() {
        new Angular2Csv(this.groupResults, 'Results');
    }
}