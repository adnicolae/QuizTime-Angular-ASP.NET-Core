﻿import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
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

const hooray = "sounds/scootermaria.wav";
const whah = "sounds/whah_whah.wav";
const milionaire = "sounds/milionaire.mp3";

interface IDictionary {
    [index: string]: number;
}

@Component({
    selector: 'session-board',
    templateUrl: './sessionboard.component.html',
    styleUrls: ['./sessionboard.component.css']
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
    counter3 = 15; // THIRD TIMER = PICK YES/NO to explain
    counter4: number; // EXPLAIN-ChallengeTimer
    counter5 = 15; // VOTING
    private alive: boolean = true;
    baseUrl: string;
    id: number;
    yesVotes: number = 0;
    noVotes: number = 0;
    audio = new Audio();
    selectedParticipant: User;
    greenIcon: boolean = false;
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = ['Challenge votes'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;
    public barChartChoicesLabels: string[] = ['Choices'];

    public barChartChoicesData: any[] = [
    ];

    public barChartData: any[] = [
        { data: [20], label: 'Bad' },
        { data: [20], label: 'Good' }
        //{ data: [(this.session != null && this.session.results != null) ? this.session.results.length : 0 ], label: 'Participants' }
    ];



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
        this.cancelSession();
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

                if (this.currentStatus == 2) {
                    let sessionChoicesTitles = (this.session.quiz != null && this.session.quiz.choices != null) ? this.session.quiz.choices.map(this.getSessionChoices) : null;
                    console.log(sessionChoicesTitles);
                    let clone = JSON.parse(JSON.stringify(this.barChartChoicesData));
                    (sessionChoicesTitles != null) ? sessionChoicesTitles.map(title => clone.push({ data: [0], label: title })) : [];
                    this.barChartChoicesData = clone;
                    console.log(this.barChartChoicesData);
                }
                if (this.currentStatus == 4) {
                    console.log(this.session.results);
                    let choicesTitles = (this.session.results != null) ? this.session.results.map(this.getChoices) : null;
                    let choiceCounters = {} as IDictionary;
                    (choicesTitles != null) ? choicesTitles.forEach(title => choiceCounters[title]=0) : [];
                    (choicesTitles != null) ? choicesTitles.forEach(title => choiceCounters[title]++) : [];
                    let uniqueChoiceTitles = uniq(choicesTitles);
                    let clone = JSON.parse(JSON.stringify(this.barChartChoicesData));
                    console.log("Unique: " + uniqueChoiceTitles);
                    (uniqueChoiceTitles != null) ? uniqueChoiceTitles.map(title => clone.forEach(item => (item.label == title) ? item.data[0] = choiceCounters[title] : null)) : [];
                    console.log("clone: " + clone);
                    this.barChartChoicesData = uniq(clone);
                    console.log(this.barChartChoicesData);
                    console.log(choicesTitles);
                    console.log(choiceCounters);
                }
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

    cancelSession() {
        let changes = new Map<string, any>();
        changes.set("status", 8);
        this.repo.updateSession(this.session.sessionId as number, changes);
        this.router.navigateByUrl("/");
    }

    updateSession(timeLimit: number, challengeTimer: number) {
        let changes = new Map<string, any>();
        changes.set("status", this.currentStatus + 1);
        this.repo.updateSession(this.session.sessionId as number, changes);
        this.currentStatus++;
        if (timeLimit != 0) {
            this.counter2 = timeLimit;
        }

        console.log("Updating session with: " + challengeTimer);
        if (challengeTimer != null) {
            this.counter4 = challengeTimer;
            console.log("counter 4 is now " + this.counter4);
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

    getSessionChoices(item, index) {
        let choices = (item != null && item.title != null) ? item.title : 'None';
        return choices;
    }

    getChoices(item, index) {
        let choiceTitle = (item.choice != null && item.choice.title != null) ? item.choice.title : 'None';
        return choiceTitle;
    }

    updateSessionWithNoTimer() {
        let changes = new Map<string, any>();
        this.currentStatus++;
        changes.set("status", this.currentStatus);
        if (this.currentStatus == 2) {
            this.repo.updateSession(this.session.sessionId as number, changes);
        }

        if (this.currentStatus == 3) {
            this.repo.updateSession(this.session.sessionId as number, changes);
            this.playAudio(milionaire);
        }

        if (this.currentStatus == 4) {
            this.repo.updateSession(this.session.sessionId as number, changes);
            this.audio.pause();
            this.audio.currentTime = 0;
            this.playAudio(whah);
        }

        if (this.currentStatus == 5 && this.session.results != null) {
            let users = this.session.results.map(this.getRandomResult);
            let cleanUsers = users.filter((user) => user != null);
            console.log(cleanUsers);

            if (cleanUsers.length > 0) {
                let changes = new Map<string, any>();
                let randIdx = Math.floor((Math.random() * (cleanUsers.length - 1)) + 0);
                console.log("Random index is: " + randIdx);
                this.selectedParticipant = cleanUsers[randIdx];

                changes.set("selectedToExplain", this.selectedParticipant.userId);
                console.log(this.selectedParticipant);
            } else {
                this.cancelSession();
            }
            (this.selectedParticipant != null && this.selectedParticipant.userId != null) ? changes.set("selectedToExplain", this.selectedParticipant.userId) : null;
            this.repo.updateSession(this.session.sessionId as number, changes);
        }

        if (this.currentStatus == 6) {
            this.repo.updateSession(this.session.sessionId as number, changes);
        }

        if (this.currentStatus == 7 && this.session.results != null) {
            this.repo.updateSession(this.session.sessionId as number, changes);
            let votes = this.session.results.map(this.getVotes);
            let posVotes = votes.filter((vote) => vote == true);
            let negVotes = votes.filter((vote) => vote == false);
            console.log("Votes: " + votes + " posvotes: " + posVotes + "negVotes: " + negVotes);
            this.yesVotes = posVotes.length;
            this.noVotes = (negVotes.length > 0) ? negVotes.length - 1 : negVotes.length;
            this.barChartData[0].data[0] = this.noVotes;
            this.barChartData[1].data[0] = this.yesVotes;
            this.audio.pause();
            this.audio.currentTime = 0;
            if (this.yesVotes >= this.noVotes) {
                this.playAudio(hooray);
            } else {
                this.playAudio(whah);
            }
            
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
            //this.playAudio(ahem);
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
            console.log("Counter 4: " + this.counter4);
            if (this.counter4 > 0) {
                this.subscribeTimer3();
            }
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
            if (this.session.status != 8) {
                this.updateSessionWithNoTimer();
                this.subscribeTimer5();
            }

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

function uniq(a) {
    return a.sort().filter(function (item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
