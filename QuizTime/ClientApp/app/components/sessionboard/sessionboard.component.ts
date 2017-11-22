import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { Session } from '../../models/session.model';
import { HubConnection } from "@aspnet/signalr-client";
import { Observable } from "rxjs/Observable";
import { SimpleTimer } from 'ng2-simple-timer';

@Component({
    selector: 'session-board',
    templateUrl: './sessionboard.component.html'
})
export class SessionBoardComponent {
    private _hubConnection: HubConnection;
    participant = '';
    participants: string[] = [];
    currentStatus: number = 1;

    timer1Id: string;
    timer2Id: string;
    counter1 = 10;
    counter2: number;


    constructor(
        private repo: Repository,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private timer: SimpleTimer) {
    }

    ngOnInit() {
        let id = Number.parseInt(this.activeRoute.snapshot.params["id"]);

        if (id) {
            this.repo.getHostedSession(id);
        } else {
            this.router.navigateByUrl("/");
        }

        this._hubConnection = new HubConnection('/boardhub');

        this._hubConnection.on('send', (username: any) => {
            console.log("Added " + username + " to array");
            this.repo.getHostedSession(id);
        });

        this._hubConnection.on('update', (status: any) => {
            console.log("Session status became: " + status);
            if (this.hostedSession != null) {
                this.hostedSession.status = status;
            }
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

        this.timer.newTimer('1sec', 1);
        this.timer.newTimer('1sec2', 1);
    }

    subscribeTimer1() {
        if (this.timer1Id) {
            // Unsubscribe if timer Id is defined
            this.timer.unsubscribe(this.timer1Id);
            this.timer1Id = '';
        } else {
            // Subscribe if timer Id is undefined
            this.timer1Id = this.timer.subscribe('1sec', () => this.timer1callback());
            console.log('timer 1 Subscribed.');
        }
        console.log(this.timer.getSubscription());
    }

    subscribeTimer2() {
        if (this.timer2Id) {
            // Unsubscribe if timer Id is defined
            this.timer.unsubscribe(this.timer2Id);
            this.timer2Id = '';
        } else {
            // Subscribe if timer Id is undefined
            this.timer2Id = this.timer.subscribe('1sec2', () => this.timer2callback());
            console.log('timer 2 Subscribed.');
        }
        console.log(this.timer.getSubscription());
    }

    timer1callback(): void {
        this.counter1--;

        if (this.counter1 == 0) {
            this.updateSession(0);
            this.subscribeTimer2();
        }
    }

    timer2callback(): void {
        this.counter2--;

        if (this.counter2 == 0) {
            this.updateSession(0);
        }
    }

    updateSession(timeLimit: number) {
        let changes = new Map<string, any>();
        changes.set("status", this.currentStatus+1);
        this.repo.updateSession(this.hostedSession.sessionId as number, changes);
        this.currentStatus++;
        if (timeLimit != 0) {
            this.counter2 = timeLimit;
        }
        this.subscribeTimer1();
    }

    updateSessionWithNoTimer() {
        let changes = new Map<string, any>();
        changes.set("status", this.currentStatus + 1);
        this.repo.updateSession(this.hostedSession.sessionId as number, changes);
        this.currentStatus++;
    }

    get hostedSession(): Session {
        return this.repo.hostedSession;
    }


    get quiz(): Quiz {
        return this.repo.quiz;
    }
}
