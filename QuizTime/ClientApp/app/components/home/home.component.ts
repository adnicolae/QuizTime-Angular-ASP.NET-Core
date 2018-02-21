import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Repository } from '../../data/repository';
import { Result } from '../../models/result.model';
import { Session } from '../../models/session.model';
import { HubConnection } from "@aspnet/signalr-client";
import { Observable } from "rxjs/Observable";
import { AuthService } from '../registration/auth.service';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    private _hubConnection: HubConnection;
    public async: any;
    message = '';
    messages: string[] = [];
    isBrowser: boolean

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private repo: Repository, public auth: AuthService) {
        //this.repo.getHostedSession(3456);
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser && this.auth.isAuthenticated) {
            this.repo.getParticipantResults(5);
        }
    }

    //public sendMessage(): void {
    //    const data = `Sent: ${this.message}`;

    //    this._hubConnection.invoke('Send', data);
    //    this.messages.push(data);
    //}

    ngOnInit() {
        //this._hubConnection = new HubConnection('/quiz');

        //this._hubConnection.on('Send', (data: any) => {
        //    const received = `Received: ${data}`;
        //    this.messages.push(received);
        //});

        //this._hubConnection.on('send', data => {
        //    console.log(data);
        //});

        //this._hubConnection.start()
        //    .then(() => {
        //        console.log("Hub connection started")
        //    })
        //    .catch(err => {
        //        console.log("error while establishing hub connection")
        //    });
        if (this.isBrowser) {
            this.repo.getUser().subscribe();
        }
    }

    //get hostedSession(): Session {
    //    return this.repo.hostedSession;
    //}

    get participantResults(): Result[] {
        if (this.isBrowser && this.auth.isAuthenticated) {
            return this.repo.participantResults;
        }
        else return [];
    }
}
