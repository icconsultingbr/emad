import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
    getToken(): string {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        return user ? user.token : '';
    }
}