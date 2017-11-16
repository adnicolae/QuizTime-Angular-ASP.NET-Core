import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { Session } from '../../models/session.model';
import { HubConnection } from "@aspnet/signalr-client";
import { Observable } from "rxjs/Observable";
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'participant-board',
    templateUrl: './participantboard.component.html'
})
export class ParticipantBoardComponent implements OnInit{
    private _hubConnection: HubConnection;
    participant = '';
    participants: string[] = [];

    constructor(
        private repo: Repository,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private cookieService: CookieService) {

        //let id = Number.parseInt(activeRoute.snapshot.params["id"]);

        //if (id) {
        //    this.repo.getHostedSession(id);
        //    console.log(this.hostedSession);
        //} else {
        //    router.navigateByUrl("/");
        //}
    }

    ngOnInit() {
        this.participant = this.getCookie("participantName");

        let id = Number.parseInt(this.activeRoute.snapshot.params["id"]);

        if (id) {
            this.repo.getHostedSession(id);
        } else {
            this.router.navigateByUrl("/");
        }
    }

    getCookie(key: string) {
        return this.cookieService.get(key);
    }

    get hostedSession() {
        return this.repo.hostedSession;
    }
}
