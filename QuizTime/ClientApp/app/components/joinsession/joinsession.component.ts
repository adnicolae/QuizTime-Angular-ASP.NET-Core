import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Repository } from "../../data/repository";
import { Result } from '../../models/result.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'join-session',
    templateUrl: './joinsession.component.html'
})
export class JoinSessionComponent {
    joinForm: FormGroup;

    constructor(private fb: FormBuilder, private repo: Repository, private router: Router, private cookieService: CookieService) {
        this.createForm();
    }

    createForm() {
        this.joinForm = this.fb.group({
            hostedSessionId: ['', Validators.required],
            username: ['', Validators.required]
        });
    }

    onSubmit() {
        const formModel = this.joinForm.value;
        console.log(formModel.hostedSessionId);
        console.log(formModel.username);
        this.repo.getHostedSession(formModel.hostedSessionId);
    }

    onSave() {
        const formModel = this.joinForm.value;
        console.log(this.repo.hostedSession.sessionId);
        

        this.repo.createResult(0, formModel.username as string, this.repo.hostedSession.sessionId as number);

        this.putCookie("participantName", formModel.username as string);

        this.router.navigateByUrl("/session-board/participant/" + parseInt(formModel.hostedSessionId));
    }

    putCookie(key: string, value: string) {
        return this.cookieService.put(key, value);
    }
}