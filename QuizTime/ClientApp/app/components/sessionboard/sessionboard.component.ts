import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { Session } from '../../models/session.model';

@Component({
    selector: 'session-board',
    templateUrl: './sessionboard.component.html'
})
export class SessionBoardComponent {
    constructor(
        private repo: Repository,
        router: Router,
        activeRoute: ActivatedRoute) {

        let id = Number.parseInt(activeRoute.snapshot.params["id"]);

        if (id) {
            this.repo.getHostedSession(id);
        } else {
            router.navigateByUrl("/");
        }
    }

    get hostedSession(): Session {
        return this.repo.hostedSession;
    }

    get quiz(): Quiz {
        return this.repo.quiz;
    }
}
