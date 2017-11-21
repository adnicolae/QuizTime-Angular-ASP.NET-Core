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
    result = '';

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
        this.result = this.getCookie("correctness");

        let id = Number.parseInt(this.activeRoute.snapshot.params["id"]);

        if (id) {
            this.repo.getHostedSession(id);
        } else {
            this.router.navigateByUrl("/");
        }

        this._hubConnection = new HubConnection('/boardhub');

        this._hubConnection.on('update', (status: any) => {
            console.log("Session status became: " + status);
            this.hostedSession.status = status;
        });

        this._hubConnection.start()
            .then(() => {
                console.log("Hub connection started")
            })
            .catch(err => {
                console.log("error while establishing hub connection")
            });
    }

    logClick(correctness: boolean) {
        console.log(correctness);
        if (correctness == true) {
            this.result = "won";
        }
        else {
            this.result = "lost";
        }
        this.putCookie("correctness", this.result);
    }

    getCookie(key: string) {
        return this.cookieService.get(key);
    }

    putCookie(key: string, value: string) {
        return this.cookieService.put(key, value);
    }

    deleteCookie(key: string) {
        return this.cookieService.remove(key);
    }
    
    //checkCookie(key: string) {
    //    return this.cookieService.check
    //}

    get hostedSession() {
        return this.repo.hostedSession;
    }
}
