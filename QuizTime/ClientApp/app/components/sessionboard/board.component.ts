import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { Session } from '../../models/session.model';
import { HubConnection } from "@aspnet/signalr-client";
import { Observable } from "rxjs/Observable";
import { SimpleTimer } from 'ng2-simple-timer';
import { Http } from '@angular/http';
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/operator/takeWhile";

@Component({
    selector: 'board',
    templateUrl: './board.component.html'
})
export class BoardComponent implements OnInit, OnDestroy {
    constructor(private route: ActivatedRoute, private http: Http, private repo: Repository, private timer: SimpleTimer) { }

    private hubConnection: HubConnection;
    session: Session = new Session();
    errorMessage = "";
    timerCounter = 10;
    timerId: string;
    private subscription: Subscription;
    private alive: boolean = true;

    ngOnInit() {
        var id = this.route.snapshot.params["id"];
        if (id < 1)
            return;

        this.loadHostedSession(id);

        this.hubConnection = new HubConnection('/boardhub');

        this.hubConnection.on('send', (username: any) => {
            this.loadHostedSession(id);
        });

        this.hubConnection.on('update', (status: any) => {
            this.loadHostedSession(id);
        });

        this.hubConnection.start()
            .then(() => {
                console.log("Hub connection started")
            })
            .catch(err => {
                console.log("error while establishing hub connection")
            });

        this.timer.newTimer('sessionTimer', 1);
    }

    subscribeTimer1() {
        if (this.timerId) {
            // Unsubscribe if timer Id is defined
            this.timer.unsubscribe(this.timerId);
            this.timerId = '';
        } else {
            // Subscribe if timer Id is undefined
            this.timerId = this.timer.subscribe('sessionTimer', () => this.timerCallback());
            console.log('Timer 1 Subscribed.');
        }
        console.log(this.timer.getSubscription());
    }

    ngOnDestroy() {
        console.log("destroyed component for: " + this.session.generatedHostId);
        this.alive = false;
    }

    timerCallback(): void {
        this.timerCounter--;

        if (this.timerCounter == 0) {
            this.timer.unsubscribe(this.timerId);
            this.updateSession();
        }
    }

    loadHostedSession(id) {
        this.errorMessage = "";
        this.http
            .get(`${this.repo.urlBase}/api/sessions/host/${id}`)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                this.session = response.json();
                console.log(this.session);
            }, response => {
                this.errorMessage = "Unable to load session.";
            });
    }

    updateSession() {
        let changes = new Map<string, any>();
        changes.set("status", this.session.status! + 1);
        this.repo.updateSession(this.session.sessionId as number, changes);
        this.subscribeTimer1();
    }
}