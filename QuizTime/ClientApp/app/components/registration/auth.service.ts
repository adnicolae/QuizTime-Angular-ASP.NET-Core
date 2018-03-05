import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router'
import { ErrorHandlerService, ValidationError } from '../../errorHandler.service';

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
        this.http
            .post(this.baseUrl + '/auth/register', user)
            .map(response => response.json())
            .catch((errorResponse: Response) => {
                if (errorResponse.status == 400) {
                    let jsonData: string;
                    try {
                        jsonData = errorResponse.json();
                    } catch (e) {
                        throw new Error("Network error!");
                    }

                    if (typeof jsonData == "string") {
                        let messages: string[] = [];
                        messages.push(jsonData);
                        throw new ValidationError(messages);
                    } else if (typeof jsonData == "object") {
                        let messages = Object.getOwnPropertyNames(jsonData)
                            .map(p => jsonData[p]);
                        throw new ValidationError(messages);
                    }
                }
                throw new Error("Network error!");
            })
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
        this.http
            .post(this.baseUrl + 'auth/login', loginData)
            .map(response => response.json())
            .catch((errorResponse: Response) => {
                if (errorResponse.status == 400) {
                    let jsonData: string;
                    try {
                        jsonData = errorResponse.json();
                    } catch (e) {
                        throw new Error("Network error!");
                    }

                    if (typeof jsonData == "string") {
                        let messages: string[] = [];
                        messages.push(jsonData);
                        throw new ValidationError(messages);
                    } else if (typeof jsonData == "object") {
                        let messages = Object.getOwnPropertyNames(jsonData)
                            .map(p => jsonData[p]);
                        throw new ValidationError(messages);
                    }
                }
                throw new Error("Network error!");
            })
            .subscribe(response => {
                this.authenticate(response);
            });
    }

    authenticate(response) {
        var authenticationResponse = response;

        if (!authenticationResponse.token)
            return;

        localStorage.setItem(this.tokenKey, authenticationResponse.token)
        localStorage.setItem(this.usernameKey, authenticationResponse.username)
        localStorage.setItem(this.nameKey, authenticationResponse.name)

        this.router.navigate(['/home'])
    }
}