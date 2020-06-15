import { Injectable } from '@angular/core';
import { GenericsService } from '../../_services/generics.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppGridViewService extends GenericsService {
    constructor(public http: HttpClient) {
        super(http);
    }
}