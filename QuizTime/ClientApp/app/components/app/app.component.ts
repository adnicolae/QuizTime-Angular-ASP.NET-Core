import { Component, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../registration/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Repository } from '../../data/repository';

declare var $;

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        public auth: AuthService,
        private fb: FormBuilder,
        private repo: Repository) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit() {
        $('.ui.sidebar')
            .sidebar('attach events', '.toc.item')
            ;
    }
 
}
