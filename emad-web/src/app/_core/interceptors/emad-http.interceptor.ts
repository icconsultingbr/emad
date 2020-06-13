import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../loaders/services/loader.service';

@Injectable()
export class EmadHttpInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
        private router: Router,
        private loaderService: LoaderService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const index = req.url.indexOf('/assets');
        const indexUrl = req.url.indexOf('http');

        const headers: { [name: string]: string | string[]; } = {};

        headers['Accept'] = 'application/json';
        headers['Authorization'] = this.authService.getToken();

        if (localStorage.getItem("est")) {
            req.headers.delete("est");
            headers['est'] = JSON.parse(localStorage.getItem("est"))[0].id;
        }

        if (req.body instanceof FormData) {
            headers['Content-Type'] = 'multipart/form-data';
        } else {
            headers['Content-Type'] = 'application/json';
        }

        if (index < 0 && indexUrl < 0) {
            req = req.clone({
                url: environment.apiUrl + '/' + req.url,
                headers: new HttpHeaders(headers)
            });
        }

        this.loaderService.open();

        return next.handle(req)
            .pipe(finalize(() => this.loaderService.close()),
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        this.router.navigate(['login']);
                    } else {
                        return Observable.throw(error.error);
                    }
                }));
    }
}