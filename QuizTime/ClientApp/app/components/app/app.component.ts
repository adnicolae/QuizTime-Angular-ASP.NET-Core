import { Component, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../registration/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Repository } from '../../data/repository';
import { ErrorHandlerService } from '../../errorHandler.service';

//declare var $: any;

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    isBrowser: boolean;
    private lastError: string[];

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        public auth: AuthService,
        private fb: FormBuilder,
        private repo: Repository,
        errorHandler: ErrorHandlerService) {
        this.isBrowser = isPlatformBrowser(platformId);
        errorHandler.applicationErrors.subscribe(error => {
            this.lastError = error;
        });
    }

    get error(): string[] {
        return this.lastError;
    }

    clearError() {
        this.lastError = [];
    }

    //ngOnInit() {
    //    $('.ui.sidebar')
    //        .sidebar('attach events', '.toc.item')
    //        ;
    //}
 
}
