import { Component, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Repository } from "../../data/repository";
import { Result } from '../../models/result.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Http, Response } from '@angular/http';
import { Session } from '../../models/session.model';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../registration/auth.service';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import "rxjs/add/operator/takeWhile";

@Component({
    selector: 'join-session',
    templateUrl: './joinsession.component.html'
})
export class JoinSessionComponent implements OnDestroy {
    joinForm: FormGroup;
    session: Session = new Session();
    errorMessage = "";
    private alive: boolean = true;
    isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private repo: Repository, private router: Router, private cookieService: CookieService, private http: Http, public auth: AuthService) {
        this.createForm();
        this.isBrowser = isPlatformBrowser(platformId);
    }

    createForm() {
        this.joinForm = this.fb.group({
            hostedSessionId: ['', Validators.required],
            username: ['', Validators.required]
        });
    }

    ngOnDestroy() {
        this.alive = false;
        this.repo.alive = false;
    }

    onSubmit() {
        const formModel = this.joinForm.value;
        this.errorMessage = "";
        this.http
            .get(`${this.repo.urlBase}/api/sessions/host/${formModel.hostedSessionId}`)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                this.session = response.json();
                console.log(this.session);
                let data = {
                    score: 0,
                    sessionParticipant: (this.auth.isAuthenticated) ? this.auth.username : formModel.username,
                    session: this.session.sessionId
                };
                console.log(data);
                this.http.post(`${this.repo.urlBase}/api/results`, data)
                    .takeWhile(() => this.alive)
                    .subscribe(response => {
                        console.log(response);
                        this.putCookie("resultId", response.json());
                        this.putCookie("participantName", formModel.username);
                        this.router.navigateByUrl(`/session-board/participant/${parseInt(formModel.hostedSessionId)}`);
                    });
            }, response => {
                this.errorMessage = "Unable to load session.";
                console.log(this.errorMessage);
            });
    }

    putCookie(key: string, value: string) {
        return this.cookieService.put(key, value);
    }
}