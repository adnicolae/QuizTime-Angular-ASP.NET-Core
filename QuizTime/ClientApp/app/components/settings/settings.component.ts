import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Repository } from '../../data/repository';

@Component({
    selector: 'settings',
    templateUrl: 'settings.component.html',
    styles: [`
        .error {
            background-color: #fff0f0
        }
    `
    ]
})

export class SettingsComponent {
    constructor(private repo: Repository) { }

    settingsData = {
        //name:'',
        defaultQuizTitle: ''
    }

    ngOnInit() {
        this.repo.getUser().subscribe(response => {
            this.settingsData.defaultQuizTitle = response.defaultQuizTitle;
        });
    }

    saveChanges(settingsData) {
        this.repo.saveUser(settingsData).subscribe();
    }

}