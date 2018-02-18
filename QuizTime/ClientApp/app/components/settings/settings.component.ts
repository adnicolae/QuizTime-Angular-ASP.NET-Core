import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../registration/auth.service';

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
    constructor(private auth: AuthService) { }

    settingsData = {
        defaultQuizTitle: ''
    }

}