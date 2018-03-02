import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ErrorHandlerService {
    private applicationErrorsSubject = new Subject<string[]>();
    private validationErrorsSubject = new Subject<string[]>();

    handleError(error: any) {
        setTimeout(() => {
            if (error instanceof ValidationError) {
                this.validationErrorsSubject.next(error.errors);
            } else if (error instanceof Error) {
                this.applicationErrorsSubject.next([error.message]);
            } else {
                this.applicationErrorsSubject.next(["An error has occurred"]);
            }
        });
    }

    get applicationErrors(): Observable<string[]> {
        return this.applicationErrorsSubject;
    }

    get validationErrors(): Observable<string[]> {
        return this.validationErrorsSubject;
    }
}

export class ValidationError implements Error {
    constructor(public errors: string[]) { }
    name: string;
    message: string;
}