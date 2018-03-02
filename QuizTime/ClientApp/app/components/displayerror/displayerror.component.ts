import { Component, PLATFORM_ID, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../registration/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Repository } from '../../data/repository';
import { ErrorHandlerService } from '../../errorHandler.service';

@Component({
    selector: 'err',
    templateUrl: './displayerror.component.html'
})
export class DisplayErrorComponent {
    isBrowser: boolean;
    private lastError: string[];
    @Output() sendingFormFailed = new EventEmitter<boolean>();

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        public auth: AuthService,
        private fb: FormBuilder,
        private repo: Repository,
        errorHandler: ErrorHandlerService) {
        this.isBrowser = isPlatformBrowser(platformId);
        errorHandler.validationErrors.subscribe(error => {
            this.lastError = error;
            this.sendingFormFailed.emit(true);
            this.repo.groupCreated = false;
        });
    }

    get error(): string[] {
        return this.lastError;
    }

    clearError() {
        this.lastError = [];
    }

}
