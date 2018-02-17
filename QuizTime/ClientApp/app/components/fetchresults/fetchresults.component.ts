import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { Result } from "../../models/result.model";
import { Http } from '@angular/http';
import { Repository } from "../../data/repository";
import { ResultFilter } from "../../data/config.repository";
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Component(
    {
        selector: 'fetchresults',
        templateUrl: './fetchresults.component.html'
    }
)

export class FetchResultsComponent {
    isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private repo: Repository) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.repo.getParticipantResults(0);
        }
    }

    get result(): Result {
        return this.repo.result;
    }

    get results(): Result[] {
        return this.repo.participantResults;
    }
}