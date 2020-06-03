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
import { MenuComponent } from './seguranca/menu/menu.component';
import { MenuFormComponent } from './seguranca/menu/menu-form.component';
import { MenuService } from './seguranca/menu/menu.service';
import { UsuarioComponent } from './seguranca/usuario/usuario.component';
import { UsuarioFormComponent } from './seguranca/usuario/usuario-form.component';
import { UsuarioService } from './seguranca/usuario/usuario.service';
import { TipoUsuarioComponent } from './seguranca/tipo-usuario/tipo-usuario.component';
import { TipoUsuarioFormComponent } from './seguranca/tipo-usuario/tipo-usuario-form.component';
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
import { UsuarioResetComponent } from './seguranca/usuario/usuario-reset.component';
import { PreviousRouteService } from './_core/_services/previous-router.service';
import { AppGridViewModule } from './_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from './_core/_components/app-form/app-form.module';
import { AppFormService } from './_core/_components/app-form/app-form.service';
import { AppGridViewService } from './_core/_components/app-grid-view/app-grid-view.service';
import { AppModalModule } from './_core/_components/app-modal/app-modal.module';
import { AppNavbarComponent } from './_core/_components/app-navbar/app-navbar.component';
import { EstabelecimentoFormComponent } from './seguranca/estabelecimento/estabelecimento-form.component';
import { EstabelecimentoService } from './seguranca/estabelecimento/estabelecimento.service';
import { EstabelecimentoComponent } from './seguranca/estabelecimento/estabelecimento.component';
import { PlanoTerapeuticoComponent } from './operacao/plano-terapeutico/plano-terapeutico.component';
import { GeorreferenciamentoComponent } from './cadastro/georreferenciamento/georreferenciamento.component';
import { AgendaComponent } from './operacao/agenda/agenda.component';
import { LogComponent } from './seguranca/log/log.component';
import { LogService } from './seguranca/log/log.service';
import { AtendimentoFormComponent } from './operacao/atendimento/atendimento-form.component';
import { AtendimentoComponent } from './operacao/atendimento/atendimento.component';
import { AtribuicaoCanetaComponent } from './operacao/atribuicao-caneta/atribuicao-caneta.component';
import { AtribuicaoCanetaFormComponent } from './operacao/atribuicao-caneta/atribuicao-caneta-form.component';
import { EscalaProfissionalFormComponent } from './operacao/escala-profissional/escala-profissional-form.component';
import { ParametroSegurancaComponent } from './seguranca/parametro-seguranca/parametro-seguranca.component';
import { ParametroSegurancaFormComponent } from './seguranca/parametro-seguranca/parametro-seguranca-form.component';
import { CoreModule } from './_core/core.module';

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
        MenuComponent, 
        MenuFormComponent,
        UsuarioComponent,
        UsuarioFormComponent,
        TipoUsuarioComponent,
        TipoUsuarioFormComponent,
        UsuarioResetComponent,
        EstabelecimentoComponent,
        EstabelecimentoFormComponent,
        AtribuicaoCanetaComponent,
        AtribuicaoCanetaFormComponent,
        EscalaProfissionalFormComponent,        
        ParametroSegurancaComponent, 
        ParametroSegurancaFormComponent,        
        PlanoTerapeuticoComponent,
        GeorreferenciamentoComponent,
        AgendaComponent,
        AtendimentoComponent,
        AtendimentoFormComponent,
        LogComponent,
        AtendimentoComponent
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