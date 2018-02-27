import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { User } from '../../models/user.model';
import { Choice } from '../../models/choice.model';
import { Session } from '../../models/session.model';
import { HubConnection } from "@aspnet/signalr-client";
import { Observable } from "rxjs/Observable";
import { SimpleTimer } from 'ng2-simple-timer';
import { Http } from '@angular/http';
import "rxjs/add/operator/takeWhile";

const ahem = "sounds/ahem.wav";
const milionaire = "sounds/milionaire.mp3";

@Component({
    selector: 'session-board',
    templateUrl: './sessionboard.component.html'
})

export class SessionBoardComponent implements OnInit, OnDestroy {
    private _hubConnection: HubConnection;
    participant = '';
    participants: string[] = [];
    currentStatus: number = 1;
    session: Session;
    errorMessage = "";
    timer1Id: string;
    timer2Id: string;
    timer3Id: string;
    timer4Id: string;
    timer5Id: string;
    counter1 = 3; // FIRST TIMER 
    counter2: number; // SECOND TIMER = TIME LIMIT
    counter3 = 10; // THIRD TIMER = PICK YES/NO to explain
    counter4 = 30; // EXPLAIN
    counter5 = 10; // VOTING
    private alive: boolean = true;
    baseUrl: string;
    id: number;
    yesVotes: number = 0;
    noVotes: number = 0;
    audio = new Audio();
    selectedParticipant: User;
    greenIcon: boolean = false;



    constructor(
        private repo: Repository,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private timer: SimpleTimer,
        private http: Http,
        @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;

        this.id = Number.parseInt(this.activeRoute.snapshot.params["id"]);

        if (this.id < 1)
            return;
        this.loadHostedSession(this.id);
    }

    ngOnInit() {

        this._hubConnection = new HubConnection('/boardhub');

        this._hubConnection.on('send', (username: any) => {
            this.loadHostedSession(this.id);
            console.log(username);
        });

        this._hubConnection.on('update', (status: any) => {
            console.log("HOST: Session status became: " + status);
            this.loadHostedSession(this.id);
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
        this.timer.newTimer('timer3', 1);
        this.timer.newTimer('timer4', 1);
        this.timer.newTimer('timer5', 1);
    }

    ngOnDestroy() {
        console.log("destroyed " + this.session.generatedHostId)
        this.alive = false;
        this.repo.alive = false;
        this._hubConnection.stop();
        this.timer.unsubscribe(this.timer1Id);
        this.timer.unsubscribe(this.timer2Id);
        this.timer.unsubscribe(this.timer3Id);
        this.timer.unsubscribe(this.timer4Id);
        this.timer.unsubscribe(this.timer5Id);
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    loadHostedSession(id) {
        this.errorMessage = "";
        this.http
            .get(this.baseUrl + "/api/sessions/host/" + id)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                this.session = response.json();
                console.log(this.session);
            }, response => {
                this.errorMessage = "Unable to load session.";
            });
    }

    setGreen() {
        this.greenIcon = true;
    }

    setBlack() {
        this.greenIcon = false;
    }

    updateSession(timeLimit: number) {
        let changes = new Map<string, any>();
        changes.set("status", this.currentStatus + 1);
        this.repo.updateSession(this.session.sessionId as number, changes);
        this.currentStatus++;
        if (timeLimit != 0) {
            this.counter2 = timeLimit;
        }

        if (this.currentStatus == 2) {
            this.subscribeTimer1();
        }
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

    getRandomResult(item, index) {
        let users = (item.participatedSelection == true) ?item.sessionParticipant : null;
        return users;
    }

    getVotes(item, index) {
        let vote = (item.positiveVote == true) ? true : false;
        return vote;
    }

    updateSessionWithNoTimer() {
        let changes = new Map<string, any>();
        changes.set("status", this.currentStatus + 1);
        this.repo.updateSession(this.session.sessionId as number, changes);
        this.currentStatus++;

        if (this.currentStatus == 3) {
            this.playAudio(milionaire);
        }

        if (this.currentStatus == 4) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.playAudio(ahem);
        }

        if (this.currentStatus == 5 && this.session.results != null) {
            let users = this.session.results.map(this.getRandomResult);
            let cleanUsers = users.filter((user) => user != null);
            console.log(cleanUsers);

            if (cleanUsers.length > 0) {
                let randIdx = Math.floor((Math.random() * (users.length - 1)) + 0);
                this.selectedParticipant = cleanUsers[randIdx];
            }
            let changes = new Map<string, any>();
            changes.set("selectedToExplain", this.selectedParticipant.userId);
            this.repo.updateSession(this.session.sessionId as number, changes);
            console.log(this.selectedParticipant);
        } else {
            this.selectedParticipant = new User();
        }

        if (this.currentStatus == 7 && this.session.results != null) {
            let votes = this.session.results.map(this.getVotes);
            let posVotes = votes.filter((vote) => vote == true);
            let negVotes = votes.filter((vote) => vote == false);
            console.log("Votes: " + votes + " posvotes: " + posVotes + "negVotes: " + negVotes);
            this.yesVotes = posVotes.length;
            this.noVotes = negVotes.length - 1;
        }
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
    subscribeTimer3() {
        if (this.timer3Id) {
            // Unsubscribe if timer Id is defined
            this.timer.unsubscribe(this.timer3Id);
            this.timer3Id = '';
        } else {
            // Subscribe if timer Id is undefined
            this.timer3Id = this.timer.subscribe('timer3', () => this.timer3callback());
            console.log('timer 3 Subscribed.');
        }
        console.log(this.timer.getSubscription());
    }
    subscribeTimer4() {
        if (this.timer4Id) {
            // Unsubscribe if timer Id is defined
            this.timer.unsubscribe(this.timer4Id);
            this.timer4Id = '';
        } else {
            // Subscribe if timer Id is undefined
            this.timer4Id = this.timer.subscribe('timer4', () => this.timer4callback());
            console.log('timer 4 Subscribed.');
        }
        console.log(this.timer.getSubscription());
    }
    subscribeTimer5() {
        if (this.timer5Id) {
            // Unsubscribe if timer Id is defined
            this.timer.unsubscribe(this.timer5Id);
            this.timer5Id = '';
        } else {
            // Subscribe if timer Id is undefined
            this.timer5Id = this.timer.subscribe('timer5', () => this.timer5callback());
            console.log('timer 5 Subscribed.');
        }
        console.log(this.timer.getSubscription());
    }

    timer1callback(): void {
        this.counter1--;

        if (this.counter1 == 1) {
            this.playAudio(ahem);
        }

        if (this.counter1 == 0) {
            this.timer.unsubscribe(this.timer1Id);
            this.updateSessionWithNoTimer();
            this.subscribeTimer2();
        }
    }

    timer2callback(): void {
        this.counter2--;

        if (this.counter2 == 0) {
            this.timer.unsubscribe(this.timer2Id);
            this.updateSessionWithNoTimer();
            this.subscribeTimer3();
        }
    }

    timer3callback(): void {
        this.counter3--;

        if (this.counter3 == 0) {
            this.timer.unsubscribe(this.timer3Id);
            this.updateSessionWithNoTimer();
            this.subscribeTimer4();
        }
    }

    timer4callback(): void {
        this.counter4--;

        if (this.counter4 == 0) {
            this.timer.unsubscribe(this.timer4Id);
            this.updateSessionWithNoTimer();
            this.subscribeTimer5();
        }
    }

    timer5callback(): void {
        this.counter5--;

        if (this.counter5 == 0) {
            this.timer.unsubscribe(this.timer5Id);
            this.updateSessionWithNoTimer();
        }
    }


    //subscribeTimer(timerId: string, callback, name) {
    //    if (timerId) {
    //        this.timer.unsubscribe(timerId);
    //        timerId = '';
    //    } else {
    //        timerId = this.timer.subscribe(name, () => callback);
    //        console.log('timer ' + name + ' subscribed.')
    //    }
    //}

    playAudio(source) {
        this.audio.src = source;
        this.audio.load();
        this.audio.play();
    }
}
