import { Component, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../registration/auth.service';

//declare var $;

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})

export class NavMenuComponent {
    isBrowser: boolean;
    loginShowed: boolean = false;
    registerShowed: boolean = false;

    constructor( @Inject(PLATFORM_ID) private platformId: Object, public auth: AuthService) {
        this.isBrowser = isPlatformBrowser(platformId);

    }

    _opened: boolean = false;

    _toggleSidebar() {
        this._opened = !this._opened;
    }

    showLoginForm() {
        this.loginShowed = true;
    }

    showRegisterForm() {
        this.registerShowed = true;
    }

    hideLogin() {
        this.loginShowed = false;
        this.showRegisterForm();
    }

    hideRegister() {
        this.registerShowed = false;
        this.showLoginForm();
    }
    //ngOnInit() {
    //    $('.ui.labeled.icon.sidebar')
    //        .sidebar('attach events', '.toc.item')
    //        ;
    //}
}
