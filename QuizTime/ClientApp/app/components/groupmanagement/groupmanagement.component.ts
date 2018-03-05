import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Repository } from '../../data/repository';
import { AuthService } from '../registration/auth.service';
import { Group } from '../../models/group.model';

@Component({
    selector: 'group-management',
    templateUrl: 'groupmanagement.component.html',
    styles: [`
        .error {
            background-color: #fff0f0
        }
    `
    ]
})

export class GroupManagementComponent {
    groupShowed: boolean = false;
    creatingGroup: boolean = false;

    groupData = {
        title: '',
        owner: '',
        dateCreated: new Date()
    };

    constructor(private repo: Repository, private auth: AuthService) {
        this.groupData.owner = this.auth.username as string;
        this.repo.getGroups();
    }

    // send post with 'title' and 'owner'

    showGroupForm() {
        this.groupShowed = true;
    }

    createGroup() {
        this.repo.groupCreated = true;
        this.repo.createGroup(this.groupData);
    }

    get groupCreated() {
        return this.repo.groupCreated;
    }

    get groups() {
        return this.repo.userGroups;
    }

    ngOnInit() {
        this.repo.alive = true;
    }

    ngOnDestroy() {
        this.repo.alive = false;
    }
}