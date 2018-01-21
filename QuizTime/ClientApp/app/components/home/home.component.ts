import { Component, OnInit } from '@angular/core';
import { Repository } from '../../data/repository';
import { Session } from '../../models/session.model';
import { HubConnection } from "@aspnet/signalr-client";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    private _hubConnection: HubConnection;
    public async: any;
    message = '';
    messages: string[] = [];


    constructor(private repo: Repository) {
        this.repo.getHostedSession(3456);
    }

    public sendMessage(): void {
        const data = `Sent: ${this.message}`;

        this._hubConnection.invoke('Send', data);
        this.messages.push(data);
    }

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
    }

    get hostedSession(): Session {
        return this.repo.hostedSession;
    }
}
