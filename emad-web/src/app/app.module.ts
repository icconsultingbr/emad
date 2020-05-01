import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import 'rxjs/add/operator/map';
import { routing } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from "ngx-mask";
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { LoginService } from './login/login.service';
import { AuthGuard } from './_core/_guards';
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
import { SocketService } from './_core/_services/socket.service';
import { NotificacaoSistemaService } from './_core/_services/notificacao-sistema.service';
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
import { AppNavbarService } from './_core/_components/app-navbar/app-navbar.service';
import { EstabelecimentoFormComponent } from './seguranca/estabelecimento/estabelecimento-form.component';
import { EstabelecimentoService } from './seguranca/estabelecimento/estabelecimento.service';
import { EstabelecimentoComponent } from './seguranca/estabelecimento/estabelecimento.component';
import { ProfissionalComponent } from './cadastro/profissional/profissional.component';
import { ProfissionalFormComponent } from './cadastro/profissional/profissional-form.component';
import { PacienteComponent } from './cadastro/paciente/paciente.component';
import { PacienteFormComponent } from './cadastro/paciente/paciente-form.component';
import { EquipeComponent } from './cadastro/equipe/equipe.component';
import { EquipeFormComponent } from './cadastro/equipe/equipe-form.component';
import { TipoUnidadeComponent } from './cadastro/dominio/tipo-unidade/tipo-unidade.component';
import { TipoUnidadeFormComponent } from './cadastro/dominio/tipo-unidade/tipo-unidade-form.component';
import { EspecialidadeComponent } from './cadastro/dominio/especialidade/especialidade.component';
import { EspecialidadeFormComponent } from './cadastro/dominio/especialidade/especialidade-form.component';
import { ModalidadeComponent } from './cadastro/dominio/modalidade/modalidade.component';
import { ModalidadeFormComponent } from './cadastro/dominio/modalidade/modalidade-form.component';
import { PlanoTerapeuticoComponent } from './operacao/plano-terapeutico/plano-terapeutico.component';
import { HipoteseDiagnosticaComponent } from './cadastro/dominio/hipotese-diagnostica/hipotese-diagnostica.component';
import { HipoteseDiagnosticaFormComponent } from './cadastro/dominio/hipotese-diagnostica/hipotese-diagnostica-form.component';
import { MedicamentoComponent } from './cadastro/dominio/medicamento/medicamento.component';
import { MedicamentoFormComponent } from './cadastro/dominio/medicamento/medicamento-form.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { GeorreferenciamentoComponent } from './cadastro/georreferenciamento/georreferenciamento.component';
import { AgendaComponent } from './operacao/agenda/agenda.component';
import { LogComponent } from './seguranca/log/log.component';
import { LogService } from './seguranca/log/log.service';
import { AtendimentoFormComponent } from './operacao/atendimento/atendimento-form.component';
import { AtendimentoComponent } from './operacao/atendimento/atendimento.component';
import { CanetaComponent } from './cadastro/caneta/caneta.component';
import { CanetaFormComponent } from './cadastro/caneta/caneta-form.component';
import { AtribuicaoCanetaComponent } from './operacao/atribuicao-caneta/atribuicao-caneta.component';
import { AtribuicaoCanetaFormComponent } from './operacao/atribuicao-caneta/atribuicao-caneta-form.component';

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
        NgxMaskModule.forRoot({ dropSpecialCharacters: false }),
        NgMultiSelectDropDownModule.forRoot(),
        ReactiveFormsModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        AgGridModule.withComponents([]),
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        ChartsModule,
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.none ,
            backdropBackgroundColour: 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '4px',
            primaryColour: '#FDBA31',
            secondaryColour: '#FDBA31',
            tertiaryColour: '#ffffff'
        }),
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
        ProfissionalComponent,
        ProfissionalFormComponent,
        PacienteComponent,
        PacienteFormComponent,
        EquipeComponent,
        EquipeFormComponent,
        CanetaComponent,
        CanetaFormComponent,
        AtribuicaoCanetaComponent,
        AtribuicaoCanetaFormComponent,
        TipoUnidadeComponent,
        TipoUnidadeFormComponent,
        EspecialidadeComponent,
        EspecialidadeFormComponent,
        ModalidadeComponent,
        ModalidadeFormComponent,
        PlanoTerapeuticoComponent,
        HipoteseDiagnosticaComponent,
        HipoteseDiagnosticaFormComponent,
        MedicamentoComponent,
        MedicamentoFormComponent,
        GeorreferenciamentoComponent,
        AgendaComponent,
        AtendimentoComponent,
        AtendimentoFormComponent,
        LogComponent,
        AtendimentoComponent
    ],
    bootstrap: [AppComponent],
    providers: [
        AppNavbarService,
        LoginService,
        AuthGuard,
        PagerService,
        AppService,
        AppFormService,
        AppGridViewService,
        MenuService,
        UsuarioService,
        SocketService,
        NotificacaoSistemaService,
        PreviousRouteService,
        EstabelecimentoService,
        LogService

    ]

})
export class AppModule { }