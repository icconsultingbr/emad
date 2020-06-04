import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import 'rxjs/add/operator/map';
import { routing } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { LoginService } from './login/login.service';
import { PagerService } from './_core/_services';
import { NotFoundComponent } from './not-found/not-found.component';
import { AppService } from './app.service';
import { environment } from '../environments/environment';
import { MenuService } from './seguranca/menu/menu.service';
import { UsuarioService } from './seguranca/usuario/usuario.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { AgGridModule } from 'ag-grid-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { deLocale } from 'ngx-bootstrap/locale';
import { HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts';
import { PreviousRouteService } from './_core/_services/previous-router.service';
import { AppGridViewModule } from './_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from './_core/_components/app-form/app-form.module';
import { AppFormService } from './_core/_components/app-form/app-form.service';
import { AppGridViewService } from './_core/_components/app-grid-view/app-grid-view.service';
import { AppModalModule } from './_core/_components/app-modal/app-modal.module';
import { AppNavbarComponent } from './_core/_components/app-navbar/app-navbar.component';
import { EstabelecimentoService } from './seguranca/estabelecimento/estabelecimento.service';
import { LogService } from './seguranca/log/log.service';
import { CoreModule } from './_core/core.module';
import { UsuarioResetComponent } from './seguranca/usuario/usuario-reset.component';

if (environment.production) {
    enableProdMode();
}
defineLocale('pt-br', deLocale);

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        routing,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        AppGridViewModule,
        AppFormModule,
        AppModalModule,
        NgbCollapseModule.forRoot(),
        NgbDatepickerModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot(),
        ReactiveFormsModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        AgGridModule.withComponents([]),
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        ChartsModule,
        CoreModule,
    ], declarations: [
        AppComponent,
        AppNavbarComponent,
        LoginComponent,
        MainComponent, 
        NotFoundComponent,
        UsuarioResetComponent
    ],
    bootstrap: [AppComponent],
    providers: [
        LoginService,
        PagerService,
        AppService,
        AppFormService,
        AppGridViewService,
        MenuService,
        UsuarioService,
        PreviousRouteService,
        EstabelecimentoService,
        LogService
    ]

})
export class AppModule { }