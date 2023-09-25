import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class AuthService {

    getToken(): string {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        return user ? user.token : '';
    }
}
