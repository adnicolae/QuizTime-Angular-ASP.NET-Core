import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { Session } from '../../models/session.model';
import { HubConnection } from "@aspnet/signalr-client";
import { Observable } from "rxjs/Observable";
import { CookieService } from 'ngx-cookie';
import { Http } from '@angular/http';
import "rxjs/add/operator/takeWhile";

@Component({
    selector: 'participant-board',
    templateUrl: './participantboard.component.html'
})
export class ParticipantBoardComponent implements OnInit, OnDestroy{
    private _hubConnection: HubConnection;
    participant = '';
    participants: string[] = [];
    result = '';
    score = 0;
    choiceId: number;
    currentSelection: number;
    errorMessage = "";
    session: Session = new Session();
    private alive: boolean = true;

    constructor(
        private repo: Repository,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private cookieService: CookieService,
        private http: Http) {

        let id = Number.parseInt(this.activeRoute.snapshot.params["id"]);

        if (id < 1)
            return;
        this.loadHostedSession(id);
    }

    ngOnInit() {
        this.participant = this.getCookie("participantName");
        this.result = this.getCookie("correctness");

        let id = Number.parseInt(this.activeRoute.snapshot.params["id"]);

        this._hubConnection = new HubConnection('/boardhub');

        this._hubConnection.on('update', (status: any) => {
            console.log("PARTICIPANT: Session status became: " + status);
            this.loadHostedSession(id);
            //this.repo.getHostedSession(id);
            //this.hostedSession.status = status;
            //if (this.hostedSession != null) {
            //    this.hostedSession.status = status;
            //}

            if (status == 4) {
                this.updateResult();
            }

            if (status == 5) {
                this.clearCookies();
            }
        });

        this._hubConnection.start()
            .then(() => {
                console.log("Hub connection started")
            })
            .catch(err => {
                console.log("error while establishing hub connection")
            });
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

    ngOnDestroy() {
        console.log("destroyed" + this.session.generatedHostId)
        this.alive = false;
        this.repo.alive = false;
        this._hubConnection.stop();
        this.clearCookies();
    }

    selectAnswer(choiceId: number, correctness: boolean, assignedPoints: number, deducedPoints: number) {
        console.log(correctness);
        this.currentSelection = choiceId;
        if (correctness == true) {
            this.result = "won";
            this.score = assignedPoints;
            this.choiceId = choiceId;
        }
        else {
            this.result = "lost";
            this.score = -deducedPoints;
            this.choiceId = choiceId;
        }
        this.putCookie("correctness", this.result);
        console.log(this.currentSelection);
        console.log(choiceId);
        console.log(this.score);
    }

    updateResult() {
        let changes = new Map<string, any>();
        console.log("Score:" + this.score);
        changes.set("score", this.score);
        changes.set("choice", this.choiceId);
        console.log("Changes:" + changes);
        console.log("ResultID: " + parseInt(this.getCookie("resultId")));

        let patch: any[] = [];
        changes.forEach((value, key) =>
            patch.push({ op: "replace", path: key, value: value }));

        let url = this.repo.urlBase + "api/results";

        this.http.patch(url + "/" + parseInt(this.getCookie("resultId")), patch)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                console.log("Updated result;");
            }, response => {
                console.log("Unable to update result");
            });

        //this.repo.updateResult(parseInt(this.getCookie("resultId")), changes);
    }

    getCookie(key: string) {
        return this.cookieService.get(key);
    }

    putCookie(key: string, value: string) {
        return this.cookieService.put(key, value);
    }

    clearCookies() {
        this.cookieService.remove("correctness");
        this.cookieService.remove("resultId");
        this.cookieService.remove("participantName");
    }

    //get hostedSession() {
    //    return this.repo.hostedSession;
    //}
}
