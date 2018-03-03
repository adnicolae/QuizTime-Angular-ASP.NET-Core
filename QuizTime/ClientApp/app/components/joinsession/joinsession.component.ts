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
    sendingForm: boolean = false;
    showError: boolean = false;

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private repo: Repository, private router: Router, private cookieService: CookieService, private http: Http, public auth: AuthService) {
        this.createForm();
        this.isBrowser = isPlatformBrowser(platformId);
    }

    createForm() {
        this.joinForm = this.fb.group({
            hostedSessionId: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(1)]]
        });
    }

    ngOnInit() {
        this.repo.alive = true;
    }

    ngOnDestroy() {
        this.alive = false;
        this.repo.alive = false;
    }

    sendingFormFailed(failed: boolean) {
        console.log(failed);
        failed ? this.sendingForm = false : this.sendingForm = true;
        //failed ? this.showError = true : this.sendingForm = true;
    }
    ngOnChanges() {
        this.joinForm.reset();
    }

    onSubmit() {
        const formModel = this.joinForm.value;
        this.errorMessage = "";
        this.sendingForm = true;

        this.repo.getHostSession(formModel.hostedSessionId)
            .subscribe(response => {
                this.session = response;
                console.log(this.session);

                this.repo.createResult(0, this.auth.username as string, (this.session.sessionId != null) ? this.session.sessionId : 0)
                    .subscribe(response => {
                        this.putCookie("resultId", response);
                        this.putCookie("participantName", formModel.username);
                        this.router.navigateByUrl(`/session-board/participant/${parseInt(formModel.hostedSessionId)}`);
                    });
            });
    }

    isValid(control) {
        return this.joinForm.controls[control].invalid && this.joinForm.controls[control].touched;
    }

    putCookie(key: string, value: string) {
        return this.cookieService.put(key, value);
    }

    get hostedIdInput() { return this.joinForm.get('hostedSessionId'); }
}