import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';

@Component({
    selector: 'session-board',
    templateUrl: './sessionboard.component.html'
})
export class SessionBoardComponent {
    constructor(private repo: Repository) {

    }

    get quiz(): Quiz {
        return this.repo.quiz;
    }
}
