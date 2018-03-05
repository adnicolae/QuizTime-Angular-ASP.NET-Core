import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Repository } from '../../data/repository';
import { AuthService } from '../registration/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Result } from '../../models/result.model';


declare var $;

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
    isBrowser: boolean;

    constructor( @Inject(PLATFORM_ID) private platformId: Object, private repo: Repository, public auth: AuthService) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser && this.auth.isAuthenticated) {
            this.repo.initialise();
            this.repo.getParticipantResults(5);
        }
    }

    ngOnInit() {
        this.repo.alive = true;
    }

    ngOnDestroy() {
        this.repo.alive = false;
    }

    get participantResults(): Result[] {
        if (this.isBrowser && this.auth.isAuthenticated) {
            return this.repo.participantRecentResults;
        }
        else return [];
    }
}
