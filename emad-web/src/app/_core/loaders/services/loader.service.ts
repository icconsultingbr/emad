import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LoaderService {
    private count = 0;
    private openSubject: Subject<any> = new Subject<any>();
    private closeSubject: Subject<any> = new Subject<any>();

    constructor() {
    }

    open(): void {
        if (this.count == 0) {
            this.openSubject.next();
        }

        this.count++;
    }

    close(): void {
        this.count--;

        if (this.count == 0) {
            this.closeSubject.next();
        }
    }

    opened(): Observable<any> {
        return this.openSubject.asObservable();
    }

    closed(): Observable<any> {
        return this.closeSubject.asObservable();
    }
}
