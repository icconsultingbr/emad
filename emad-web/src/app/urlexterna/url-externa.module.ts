import { NgModule } from '@angular/core';
import { CoreModule } from '../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedServiceModule } from '../shared/services/shared-service.module';
import { UrlExternaComponent } from './url-externa.component';
import { UrlExternaService } from './url-externa.service';
import { urlExternaRoutes } from './url-externa.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(urlExternaRoutes),
        SharedServiceModule
    ],
    declarations: [
        UrlExternaComponent,
    ],
    providers: [
        UrlExternaService
    ]
})
export class UrlExternaModule {
}
