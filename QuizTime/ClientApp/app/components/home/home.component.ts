import { Component } from '@angular/core';
import { Repository } from '../../data/repository';
import { Session } from '../../models/session.model';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    constructor(private repo: Repository) {
        this.repo.getHostedSession(3456);
    }

    get hostedSession(): Session {
        return this.repo.hostedSession;
    }
}
