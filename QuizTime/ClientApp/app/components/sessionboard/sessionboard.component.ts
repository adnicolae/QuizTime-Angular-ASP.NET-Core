import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { Session } from '../../models/session.model';
import { HubConnection } from "@aspnet/signalr-client";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'session-board',
    templateUrl: './sessionboard.component.html'
})
export class SessionBoardComponent {
    private _hubConnection: HubConnection;
    participant = '';
    participants: string[] = [];

    constructor(
        private repo: Repository,
        router: Router,
        activeRoute: ActivatedRoute) {

        let id = Number.parseInt(activeRoute.snapshot.params["id"]);

        if (id) {
            this.repo.getHostedSession(id);
        } else {
            router.navigateByUrl("/");
        }
    }

    ngOnInit() {
        this._hubConnection = new HubConnection('/boardhub');

        this._hubConnection.on('send', (username: any) => {
            console.log("Added " + username + " to array");
            this.participants.push(username);
        });

        this._hubConnection.on('send', username => {
            console.log(username);
        });

        this._hubConnection.start()
            .then(() => {
                console.log("Hub connection started")
            })
            .catch(err => {
                console.log("error while establishing hub connection")
            });
    }

    get hostedSession(): Session {
        return this.repo.hostedSession;
    }

    get quiz(): Quiz {
        return this.repo.quiz;
    }
}
