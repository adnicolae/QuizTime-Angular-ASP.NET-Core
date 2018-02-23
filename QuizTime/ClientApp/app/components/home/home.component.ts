import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Repository } from '../../data/repository';
import { Result } from '../../models/result.model';
import { Session } from '../../models/session.model';
import { HubConnection } from "@aspnet/signalr-client";
import { Observable } from "rxjs/Observable";
import { AuthService } from '../registration/auth.service';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


declare var $;

@Component({
    selector: 'home',
    inputs: ['joinShowed', 'loginShowed', 'registerShowed'],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    private _hubConnection: HubConnection;
    public async: any;
    message = '';
    messages: string[] = [];
    isBrowser: boolean;
    joinSessionForm: FormGroup;
    loginForm: FormGroup;
    registerForm: FormGroup;
    joinShowed: boolean = false;
    loginShowed: boolean = false;
    registerShowed: boolean = false;

    constructor( @Inject(PLATFORM_ID) private platformId: Object, private repo: Repository, public auth: AuthService, private fb: FormBuilder) {
        //this.repo.getHostedSession(3456);
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser && this.auth.isAuthenticated) {
            this.repo.getParticipantResults(5);
        }
        this.createSessionForm();
        this.createRegisterForm();
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

    createSessionForm() {
        this.joinSessionForm = this.fb.group({
            quizSessionId: ['', Validators.required],
            username: ['', Validators.required]
        });
    }

    onSubmitJoinForm() {
        const formModel = this.joinSessionForm.value;
        this.repo.joinSession(formModel.quizSessionId, formModel.username);
    }

    onSubmitLoginForm() {
        this.auth.login(this.loginData);
    }

    onSubmitRegisterForm() {
        this.auth.register(this.registerForm.value);
    }

    showJoinForm() {
        this.joinShowed = true;
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

    showModal() {
        $('.ui.modal')
            .modal('setting', 'closable', true)
            .modal('show')
            ;
    }

    ngOnInit() {
        this.repo.alive = true;
        if (this.isBrowser) {
            this.repo.getUser().subscribe();
        }
    }

    get participantResults(): Result[] {
        if (this.isBrowser && this.auth.isAuthenticated) {
            return this.repo.participantRecentResults;
        }
        else return [];
    }
}
