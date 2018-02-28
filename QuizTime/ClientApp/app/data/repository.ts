import { Quiz } from "../models/quiz.model";
import { Result } from "../models/result.model";
import { Session } from "../models/session.model";
import { Choice } from "../models/choice.model";
import { Report } from "../models/report.model";
import { Group } from "../models/group.model";
import { User } from "../models/user.model";
import { GroupResults } from "../models/groupResults.model";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Http, RequestMethod, Request, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/map";
import { QuizFilter, ResultFilter } from "./config.repository";
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../components/registration/auth.service';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

const quizzesUrl = "api/quizzes";
const resultsUrl = "api/results";
const sessionsUrl = "api/sessions";
const choicesUrl = "api/choices";
const groupsUrl = "api/groups";

@Injectable()
export class Repository {
    private quizFilterObject = new QuizFilter();
    private resultFilterObject = new ResultFilter();
    quiz: Quiz;
    result: Result;
    session: Session;
    hostedSession: Session;
    quizzes: Quiz[];
    results: Result[];
    participantRecentResults: Result[];
    participantResults: Result[];
    participantReport: Report[];
    sessions: Session[];
    userGroups: Group[];
    group: Group;
    latestQuiz: Quiz;
    groupResults: GroupResults[];
    private currentUser = {
        id: ''
    };
    alive: boolean = true;
    urlBase: string;
    isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private http: Http,
        @Inject('BASE_URL') baseUrl: string,
        private cookieService: CookieService,
        private auth: AuthService,
        private router: Router) {

        this.quizFilter.related = true;
        this.urlBase = baseUrl;
        this.getQuizzes(true, 0);
        //this.getResults();
        this.isBrowser = isPlatformBrowser(platformId);

        this.initialise();
    }

    initialise() {
        if (this.isBrowser && this.auth.isAuthenticated) {
            this.getParticipantResults(0);
            this.getParticipantResults(5);
            this.getParticipantReport();
            this.getGroups();
        }
    }


    getQuiz(id: number) {
        this.sendRequest(RequestMethod.Get, this.urlBase + quizzesUrl + "/" + id)
            .subscribe(response => { this.quiz = response; });
    }

    getLastQuiz() {
        this.sendRequest(RequestMethod.Get, this.urlBase + quizzesUrl + "/last")
            .subscribe(response => { this.latestQuiz = response });
    }

    getResult(id: number) {
        this.sendRequest(RequestMethod.Get, this.urlBase + resultsUrl + "/" + id)
            .subscribe(response => { this.result = response; });
    }

    getSession(id: number) {
        this.sendRequest(RequestMethod.Get, this.urlBase + sessionsUrl + "/" + id)
            .subscribe(response => { this.session = response; });
    }

    getHostedSession(generatedHostId: number) {
        this.sendRequest(RequestMethod.Get, this.urlBase + sessionsUrl + "/host/" + generatedHostId)
            .takeWhile(() => this.alive)
            .subscribe(response => { this.hostedSession = response; });
    }


    getQuizzes(related = true, groupId: number) {
        let url = this.urlBase + quizzesUrl + "?related=" + this.quizFilter.related;

        if (this.quizFilter.search) {
            url += "&search=" + this.quizFilter.search;
        }

        if (groupId > 0) {
            url += "&groupId=" + groupId;
        }

        this.sendRequest(RequestMethod.Get, url)
            .takeWhile(() => this.alive)
            .subscribe(response => this.quizzes = response);
    }

    getParticipantResults(last: number) {
        let url = this.urlBase + resultsUrl + "?specific=" + this.resultFilter.specific + "&related=" + this.resultFilter.related;
        if (this.auth.isAuthenticated) {
            this.resultFilter.participantUsername = this.auth.username as string;
            this.resultFilter.last = last;
            url += "&participantUsername=" + this.resultFilter.participantUsername;
            url += "&last=" + this.resultFilter.last;
            this.sendRequest(RequestMethod.Get, url)
                .takeWhile(() => this.alive)
                .subscribe(response => {
                    if (last == 0) {
                        this.participantResults = response.reverse();
                    } else {
                        this.participantRecentResults = response.reverse();
                    }
                });
        }
    }

    getParticipantReport() {
        let url = this.urlBase + resultsUrl + "/user/";
        if (this.auth.isAuthenticated) {
            url += this.auth.username;
            return this.sendRequest(RequestMethod.Get, url)
                .takeWhile(() => this.alive)
                .subscribe(response => {
                    this.participantReport = response
                });
        }
        return null;
    }

    getResults(quizId: number) {
        console.log(this.alive);
        let url = this.urlBase + resultsUrl + "?specific=" + this.resultFilter.specific + "&related=" + this.resultFilter.related;
        //if (this.auth.isAuthenticated) {
            url += "&quizId=" + quizId;
            return this.sendRequest(RequestMethod.Get, url)
                .takeWhile(() => this.alive);
        //}
    }

    getSessions() {
        let url = this.urlBase + sessionsUrl;

        this.sendRequest(RequestMethod.Get, url)
            .subscribe(response => this.sessions = response);
    }

    createQuiz(newQuiz: Quiz) {
        let data = {
            title: newQuiz.title,
            timeLimit: newQuiz.timeLimit,
            assignedPoints: newQuiz.assignedPoints,
            deducedPoints: newQuiz.deducedPoints,
            dateCreated: newQuiz.dateCreated,
            creator: newQuiz.creator ? newQuiz.creator.userId : 0
        };

        let url = this.urlBase + quizzesUrl;

        this.sendRequest(RequestMethod.Post, url, data)
            .subscribe(response => {
                newQuiz.quizId = response;
                this.quizzes.push(newQuiz);
            });
    }

    createChoice(newChoice: Choice) {
        let data = {
            title: newChoice.title,
            correctness: newChoice.correctness,
            quiz: newChoice.quiz ? newChoice.quiz.quizId : 0
        };

        let url = this.urlBase + choicesUrl;

        this.sendRequest(RequestMethod.Post, url, data)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                newChoice.choiceId = response;
            });
    }

    createResult(score: number, participant: string, session: number) {
        let data = {
            score: score,
            sessionParticipant: participant,
            session: session
        };

        let url = this.urlBase + resultsUrl;

        this.sendRequest(RequestMethod.Post, url, data)
            .takeWhile(() => this.alive)
            .subscribe(response => { this.cookieService.put("resultId", response); });
    }

    createSession(newSession: Session) {
        let data = {
            dateCreated: newSession.dateCreated,
            generatedHostId: newSession.generatedHostId,
            status: newSession.status,
            quiz: newSession.quiz ? newSession.quiz.quizId : 0
        };

        let url = this.urlBase + sessionsUrl;

        this.sendRequest(RequestMethod.Post, url, data)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                newSession.sessionId = response;
                this.sessions.push(newSession);
            });
    }

    updateSession(id: number, changes: Map<string, any>) {
        let patch: any[] = [];
        changes.forEach((value, key) =>
            patch.push({ op: "replace", path: key, value: value }));

        let url = this.urlBase + sessionsUrl;

        this.http.patch(url + "/" + id, patch)
            .takeWhile(() => this.alive)
            .subscribe(response => this.getSessions());
        //this.sendRequest(RequestMethod.Patch, url + "/" + id, patch)
        //    .subscribe(response => this.getSessions());
    }

    updateResult(id: number, changes: Map<string, any>) {
        let patch: any[] = [];
        changes.forEach((value, key) =>
            patch.push({ op: "replace", path: key, value: value }));

        let url = this.urlBase + resultsUrl;

        this.http.patch(url + "/" + id, patch)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                //this.getResults();
                console.log("Updated result " + id + ";");
            }, response => {
                console.log("Unable to update result " + id);
            });
    }

    getUser() {
        console.log(this.auth.tokenHeader);
        return this.http.get(this.urlBase + 'api/users/me', this.auth.tokenHeader).map(response => response.json());
    }

    // Returns the groups owned by the logged user
    // check for null inside components.
    getGroups() {
        return this.http
            .get(this.urlBase + groupsUrl + '/user', this.auth.tokenHeader)
            .map(res => res.json())
            .takeWhile(() => this.alive)
            .subscribe(res => {
                this.userGroups = res.reverse();
            });
    }

    saveUser(userData) {
        return this.http.post(this.urlBase + 'api/users/me', userData, this.auth.tokenHeader).map(response => response.json());
    }

    createGroup(groupData) {
        groupData.dateCreated = new Date();
        return this.http
            .post(this.urlBase + groupsUrl, groupData)
            .map(response => response.json())
            .subscribe(res => this.userGroups.push(res));
    }

    getGroup(groupId) {
        return this.http
            .get(this.urlBase + groupsUrl + "/" + groupId + "?username=" + this.auth.username)
            .map(res => res.json())
            .takeWhile(() => this.alive)
    }

    getGroupResults(groupId: number) {
        let url = this.urlBase + resultsUrl + "/group/" + groupId;
        console.log(url);
        return this.http.get(url, this.auth.tokenHeader)
            .map(res => res.json())
            .subscribe(res => this.groupResults = res);
    }

    joinSession(sessionId, username) {
        let sessionToJoin: Session;
        return this.http
            .get(`${this.urlBase}/api/sessions/host/${sessionId}`)
            .takeWhile(() => this.alive)
            .subscribe(response => {
                sessionToJoin = response.json();


                let data = {
                    score: 0,
                    sessionParticipant: username,
                    session: sessionToJoin.sessionId
                };

                this.http
                    .post(`${this.urlBase}/api/results`, data)
                    .takeWhile(() => this.alive)
                    .subscribe(response => {
                        this.cookieService.put("resultId", response.json());
                        this.cookieService.put("participantName", username);
                        this.router.navigateByUrl(`/session-board/participant/${parseInt(sessionId)}`);
                    });
            }, response => {
                console.log("Unable to load session.");
            });
    }

    get resultFilter(): ResultFilter {
        return this.resultFilterObject;
    }

    get quizFilter(): QuizFilter {
        return this.quizFilterObject;
    }

    // http.request is an Observable<Response> which will produce a Response when the request is complete
    // the map method allows the observable to be transformed by parsing JSON from the HTTP reponse
    private sendRequest(verb: RequestMethod, url: string, data?: any): Observable<any> {
        return this.http.request(new Request({
            method: verb,
            url: url,
            body: data
        })).map(response => response.json());
    }
}