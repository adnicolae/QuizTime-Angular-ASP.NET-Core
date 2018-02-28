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
            username: ['', Validators.required],
            name: ['', Validators.required],
            password: ['', Validators.required],
            passwordConfirmation: ['', Validators.required]
        })
    }

    onSubmitLoginForm() {
        this.auth.login(this.loginData);
    }

    onSubmitRegisterForm() {
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
}
