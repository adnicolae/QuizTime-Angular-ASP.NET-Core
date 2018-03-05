import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
    selector: 'register',
    templateUrl: 'register.component.html',
    styles: [`
        .error {
            background-color: #fff0f0
        }
    `
    ]
})

export class RegisterComponent {
    registrationForm;
    sendingForm: boolean = false;

    constructor(private fb: FormBuilder, private auth: AuthService) {
        this.registrationForm = fb.group({
            username: ['', [Validators.required, usernameValid()]],
            password: ['', Validators.required],
            passwordConfirmation: ['', Validators.required]
        }, { validator: matchingFields('password', 'passwordConfirmation') })
    }

    onSubmit() {
        console.log(this.registrationForm.errors)
        this.auth.register(this.registrationForm.value);
    }

    isValid(control) {
        return this.registrationForm.controls[control].invalid && this.registrationForm.controls[control].touched;
    }
}

function matchingFields(field1, field2) {
    return registrationForm => {
        if (registrationForm.controls[field1].value !== registrationForm.controls[field2].value)
            return { mismatchedFields: true}
    }
}

function usernameValid() {
    return control => {
        return control.value.length >= 8 ? null : { invalidUsername: true}
    }
}