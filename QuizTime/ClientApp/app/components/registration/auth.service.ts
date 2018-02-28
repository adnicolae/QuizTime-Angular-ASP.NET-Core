import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router'

@Injectable()

export class AuthService {

    //baseUrl = "http://localhost:61886/auth/register";
    baseUrl;
    usernameKey = 'username';
    tokenKey = 'token';
    nameKey = 'name';
    localStorage: any;

    constructor(private http: Http, @Inject('BASE_URL') baseUrl: string, private router: Router) {
        this.baseUrl = baseUrl;
    }

    get name() {
        return localStorage.getItem(this.nameKey);
    }

    get username() {
        return localStorage.getItem(this.usernameKey);
    }

    get isAuthenticated() {
        return !!localStorage.getItem(this.tokenKey);
    }

    get tokenHeader() {
        var header = new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem(this.tokenKey)
        });

        return new RequestOptions({ headers: header });
    }

    register(user) {
        delete user.passwordConfirmation;
        this.http.post(this.baseUrl + '/auth/register', user)
            .subscribe(response => {
                this.authenticate(response);
            });
        console.log(this.baseUrl);
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.usernameKey);
        localStorage.removeItem(this.nameKey);
    }

    login(loginData) {
        this.http.post(this.baseUrl + 'auth/login', loginData).subscribe(response => { this.authenticate(response); })
    }

    authenticate(response) {
        var authenticationResponse = response.json();

        if (!authenticationResponse.token)
            return;

        localStorage.setItem(this.tokenKey, authenticationResponse.token)
        localStorage.setItem(this.usernameKey, authenticationResponse.username)
        localStorage.setItem(this.nameKey, authenticationResponse.name)

        this.router.navigate(['/home'])
    }
}