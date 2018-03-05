import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../registration/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'welcome',
    inputs: ['loginShowed', 'registerShowed'],
    templateUrl: './welcome.component.html'
})

export class WelcomeComponent {
    loginForm: FormGroup;
    registerForm: FormGroup;
    loginShowed: boolean = false;
    registerShowed: boolean = false;
    isBrowser: boolean;
    sendingForm: boolean = false;

    constructor(public auth: AuthService, private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {
        this.createRegisterForm();
        this.isBrowser = isPlatformBrowser(platformId);
    }

    loginData = {
        username: '',
        password: ''
    }

    createRegisterForm() {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(8)]],
            name: ['', [Validators.required, Validators.minLength(4)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]]
        }, { validator: matchingFields('password', 'passwordConfirmation') })
    }

    isValid(control) {
        return this.registerForm.controls[control].invalid && this.registerForm.controls[control].touched;
    }

    onSubmitLoginForm() {
        this.sendingForm = true;
        this.auth.login(this.loginData);
    }

    onSubmitRegisterForm() {
        this.sendingForm = true;
        this.auth.register(this.registerForm.value);
    }

    showLoginForm() {
        this.loginShowed = true;
    }

    showRegisterForm() {
        this.registerShowed = true;
    }

    hideLogin() {
        this.loginShowed = false;
        this.showRegisterForm();
    }

    hideRegister() {
        this.registerShowed = false;
        this.showLoginForm();
    }

    sendingFormFailed(failed: boolean) {
        console.log(failed);
        failed ? this.sendingForm = false : this.sendingForm = true;
    }

    get registerUsername() { return this.registerForm.get('username'); }
    get registerName() { return this.registerForm.get('name'); }
    get registerPass() { return this.registerForm.get('password'); }
    get registerConfirm() { return this.registerForm.get('passwordConfirmation'); }
}

function matchingFields(field1, field2) {
    return registrationForm => {
        if (registrationForm.controls[field1].value !== registrationForm.controls[field2].value)
            return { mismatchedFields: true }
    }
}
