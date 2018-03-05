import { Component, Inject, PLATFORM_ID, OnDestroy } from "@angular/core";
import { Result } from "../../models/result.model";
import { Report } from "../../models/report.model";
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

export class FetchResultsComponent implements OnDestroy {
    isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private repo: Repository) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.repo.getParticipantResults(0);
            this.repo.getParticipantReport();
        }
    }

    ngOnInit() {
        this.repo.alive = true;
    }

    ngOnDestroy() {
        this.repo.alive = false;
    }

    get result(): Result {
        return this.repo.result;
    }

    get results(): Result[] {
        return this.repo.participantResults;
    }

    get report(): Report[] {
        return this.repo.participantReport;
    }
}