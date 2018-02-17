import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../registration/auth.service';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})

export class NavMenuComponent {
    isBrowser: boolean;

    constructor( @Inject(PLATFORM_ID) private platformId: Object, public auth: AuthService) {
        this.isBrowser = isPlatformBrowser(platformId);
    }
}
