import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { Choice } from '../../models/choice.model';
import { Session } from '../../models/session.model';
import { HubConnection } from "@aspnet/signalr-client";
import { Observable } from "rxjs/Observable";
import { CookieService } from 'ngx-cookie';
import { Http } from '@angular/http';
import "rxjs/add/operator/takeWhile";
import { AuthService } from "../registration/auth.service";
import { User } from '../../models/user.model';
import { SimpleTimer } from 'ng2-simple-timer';

@Component({
    selector: 'participant-board',
    templateUrl: './participantboard.component.html',
    styleUrls: ['./participantboard.component.css']
})
export class ParticipantBoardComponent implements OnInit, OnDestroy{
    private _hubConnection: HubConnection;
    participant = '';
    participants: string[] = [];
    result = '';
    score = 0;
    yesVotes: number = 0;
    noVotes: number = 0;
    choiceId: number;
    currentSelection: number;
    errorMessage = "";
    session: Session = new Session();
    private alive: boolean = true;
    promptAnswered: boolean = false;
    joiningSelection: boolean = false;
    selected: boolean = false;
    voted: boolean = false;
    vote: boolean = false;
    selectedParticipant: User;
    id;
    timer1Id: string;
    timer2Id: string;
    timer3Id: string;
    timer4Id: string;
    timer5Id: string;
    timerIds = [this.timer1Id, this.timer2Id, this.timer3Id, this.timer4Id, this.timer5Id];
    counter1 = 3; // FIRST TIMER 
    counter2: number; // SECOND TIMER = TIME LIMIT
    counter3 = 10; // THIRD TIMER = PICK YES/NO to explain
    counter4: number; // EXPLAIN
    counter5 = 10; // VOTING
    counters = [3, this.counter2, 10, this.counter4, 10];

    constructor(
        private repo: Repository,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private cookieService: CookieService,
        private http: Http,
        private auth: AuthService,
        private timer: SimpleTimer) {

        let id = Number.parseInt(this.activeRoute.snapshot.params["id"]);
        
        if (id < 1)
            return;
        this.loadHostedSession(id);
        console.log(this.counters);
    }

    ngOnInit() {
        //this.participant = this.getCookie("participantName");
        this.participant = (this.auth.name != null) ? this.auth.name : '';
        this.result = this.getCookie("correctness");

        let id = Number.parseInt(this.activeRoute.snapshot.params["id"]);
        this.id = id;
        this._hubConnection = new HubConnection('/boardhub');

        this._hubConnection.on('send', (username: any) => {
            this.loadHostedSession(id);
            console.log(username);
        });

        this._hubConnection.on('update', (status: any) => {
            console.log("PARTICIPANT: Session status became: " + status);
            this.loadHostedSession(id);
            //this.repo.getHostedSession(id);
            //this.hostedSession.status = status;
            //if (this.hostedSession != null) {
            //    this.hostedSession.status = status;
            //}

            if (status == 2) {
                this.subscribeTimer(0);
            }

            if (status == 3) {
                this.subscribeTimer(1);
            }

            if (status == 4) {
                if (this.counters[3] > 0) { this.subscribeTimer(2); }
                this.updateResult();
            }

            if (status == 5) {
                this.subscribeTimer(3);
            }

            if (status == 6) {
                this.subscribeTimer(4);
            }

            if (status == 7 && this.session.results != null && this.selected) {
                let votes = this.session.results.map(this.getVotes);
                let posVotes = votes.filter((vote) => vote == true);
                let negVotes = votes.filter((vote) => vote == false);
                console.log("Votes: " + votes + " posvotes: " + posVotes + "negVotes: " + negVotes);
                this.yesVotes = posVotes.length;
                this.noVotes = negVotes.length - 1;

                if (this.yesVotes >= this.noVotes) {
                    this.score += 10;
                }
                else {
                    this.score = 0;
                }
                this.updateResult();
            }
        });

        this._hubConnection.start()
            .then(() => {
                console.log("Hub connection started")
            })
            .catch(err => {
                console.log("error while establishing hub connection")
            });


        this.timer.newTimer('participant timer', 1);
    }

    subscribeTimer(id) {
        if (this.timerIds[id]) {
            this.timer.unsubscribe(this.timerIds[id]);
            this.timerIds[id] = '';
        } else {
            this.timerIds[id] = this.timer.subscribe('participant timer', () => this.timerCallback(id));
            console.log("Subscribed timer: " + id);
        }
        console.log(this.timer.getSubscription());
    }

    timerCallback(id) {
        this.counters[id]--;

        //if (this.counters[id] == 0) {
        //    this.timer.unsubscribe(this.timerIds[id]);
        //    if (id != 4) {
        //        this.subscribeTimer(id + 1);
        //    }
        //}
    }

    getVotes(item, index) {
        let vote = (item.positiveVote == true) ? true : false;
        return vote;
    }

    loadHostedSession(id) {
        this.errorMessage = "";
        this.http
            .get(`${this.repo.urlBase}/api/sessions/host/${id}`)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                this.session = response.json();
                console.log(this.session);
                if (this.session.status == 2) {
                    (this.session.quiz != null && this.session.quiz.timeLimit != null) ? this.counters[1] = this.session.quiz.timeLimit : this.counters[1] = 0;
                    (this.session.quiz != null && this.session.quiz.challengeTimer != null) ? this.counters[3] = this.session.quiz.challengeTimer : this.counters[3] = 0;
                }
                console.log((this.session.selectedToExplain != null) ? this.session.selectedToExplain.username : ' not defined ');
                if (this.session.selectedToExplain != null && this.auth.username == this.session.selectedToExplain.username) {
                    this.selected = true;
                }    
            }, response => {
                this.errorMessage = "Unable to load session.";
            });
    }

    ngOnDestroy() {
        console.log("destroyed" + this.session.generatedHostId)
        this.alive = false;
        this.repo.alive = false;
        this._hubConnection.stop();
        if (this.session.status != null && this.session.status <= 3) { this.repo.deleteResult(parseInt(this.getCookie("resultId"))); }
        this.clearCookies();
        this.timerIds.map((timerId) => this.timer.unsubscribe(timerId));
    }

    noParticipationAction() {
        this.promptAnswered = true;
        this.joiningSelection = false;
        this.updateResult();
    }

    participationAction() {
        this.promptAnswered = true;
        this.joiningSelection = true;
        this.updateResult();
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

    voteYes() {
        this.voted = true;
        this.vote = true;
        this.updateResult();
    }

    voteNo() {
        this.voted = true;
        this.vote = false;
    }

    updateResult() {
        let changes = new Map<string, any>();
        console.log("Score:" + this.score);
        changes.set("score", this.score);
        changes.set("choice", this.choiceId);
        changes.set("participatedSelection", this.joiningSelection);
        console.log("Vote: " + this.vote);
        changes.set("positiveVote", this.vote);
        console.log("Changes:" + changes);
        console.log("ResultID: " + parseInt(this.getCookie("resultId")));

        let patch: any[] = [];
        changes.forEach((value, key) =>
            patch.push({ op: "replace", path: key, value: value }));

        console.log("Patch: " + patch);
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

    compare(a: Choice, b: Choice) {
        if (a.title != null && b.title != null && a.title <= b.title) {
            return -1;
        }
        if (a.title != null && b.title != null && a.title > b.title) {
            return 1;
        }
        // a must be equal to b
        return 0;
    }

    //get hostedSession() {
    //    return this.repo.hostedSession;
    //}
}
