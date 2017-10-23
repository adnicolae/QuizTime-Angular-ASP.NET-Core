import { Component, Inject } from "@angular/core";
import { Result } from "../../models/result.model";
import { Http } from '@angular/http';
import { Repository } from "../../data/repository";
import { ResultFilter } from "../../data/config.repository";

@Component(
    {
        selector: 'fetchresults',
        templateUrl: './fetchresults.component.html'
    }
)

export class FetchResultsComponent {

    constructor(private repo: Repository) { }

    get result(): Result {
        return this.repo.result;
    }

    get results(): Result[] {
        return this.repo.results;
    }
}