import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../registration/auth.service';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styles: [`
        .error {
            background-color: #fff0f0
        }
    `
    ]
})

export class LoginComponent {
    constructor(private auth: AuthService) { }

    loginData = {
        username: '',
        password: ''
    }

    login() {
        this.auth.login(this.loginData);
    }
}