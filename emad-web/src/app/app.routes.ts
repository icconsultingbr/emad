import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './_core/_guards';
import { NotFoundComponent } from './not-found/not-found.component';
import { MenuComponent } from './seguranca/menu/menu.component';
import { MenuFormComponent } from './seguranca/menu/menu-form.component';
import { UsuarioComponent } from './seguranca/usuario/usuario.component';
import { UsuarioFormComponent } from './seguranca/usuario/usuario-form.component';
import { TipoUsuarioComponent } from './seguranca/tipo-usuario/tipo-usuario.component';
import { TipoUsuarioFormComponent } from './seguranca/tipo-usuario/tipo-usuario-form.component';
import { UsuarioResetComponent } from './seguranca/usuario/usuario-reset.component';
import { EstabelecimentoComponent } from './seguranca/estabelecimento/estabelecimento.component';
import { EstabelecimentoFormComponent } from './seguranca/estabelecimento/estabelecimento-form.component';
import { ProfissionalComponent } from './cadastro/profissional/profissional.component';
import { ProfissionalFormComponent } from './cadastro/profissional/profissional-form.component';
import { PacienteComponent } from './cadastro/paciente/paciente.component';
import { PacienteFormComponent } from './cadastro/paciente/paciente-form.component';
import { EquipeComponent } from './cadastro/equipe/equipe.component';
import { EquipeFormComponent } from './cadastro/equipe/equipe-form.component';
import { TipoUnidadeFormComponent } from './cadastro/dominio/tipo-unidade/tipo-unidade-form.component';
import { TipoUnidadeComponent } from './cadastro/dominio/tipo-unidade/tipo-unidade.component';
import { EspecialidadeComponent } from './cadastro/dominio/especialidade/especialidade.component';
import { EspecialidadeFormComponent } from './cadastro/dominio/especialidade/especialidade-form.component';
import { ModalidadeComponent } from './cadastro/dominio/modalidade/modalidade.component';
import { ModalidadeFormComponent } from './cadastro/dominio/modalidade/modalidade-form.component';
import { PlanoTerapeuticoComponent } from './operacao/plano-terapeutico/plano-terapeutico.component';
import { HipoteseDiagnosticaComponent } from './cadastro/dominio/hipotese-diagnostica/hipotese-diagnostica.component';
import { HipoteseDiagnosticaFormComponent } from './cadastro/dominio/hipotese-diagnostica/hipotese-diagnostica-form.component';
import { MedicamentoComponent } from './cadastro/dominio/medicamento/medicamento.component';
import { MedicamentoFormComponent } from './cadastro/dominio/medicamento/medicamento-form.component';
import { GeorreferenciamentoComponent } from './cadastro/georreferenciamento/georreferenciamento.component';
import { AgendaComponent } from './operacao/agenda/agenda.component';
import { LogComponent } from './seguranca/log/log.component';
import { AtendimentoFormComponent } from './operacao/atendimento/atendimento-form.component';
import { AtendimentoComponent } from './operacao/atendimento/atendimento.component';
import { CanetaComponent } from './cadastro/caneta/caneta.component';
import { CanetaFormComponent } from './cadastro/caneta/caneta-form.component';
import { AtribuicaoCanetaComponent } from './operacao/atribuicao-caneta/atribuicao-caneta.component';
import { AtribuicaoCanetaFormComponent } from './operacao/atribuicao-caneta/atribuicao-caneta-form.component';

const appRoutes : Routes = [
    { path : '', component : MainComponent, canActivate: [AuthGuard] },
    { path : 'login', component : LoginComponent},
    
    { path : 'menu', component : MenuComponent, canActivate: [AuthGuard]  },
    { path : 'menu-form', component : MenuFormComponent, canActivate: [AuthGuard]  },
    { path : 'menu-form/:id', component : MenuFormComponent, canActivate: [AuthGuard]  },
    
    { path : 'usuario', component : UsuarioComponent, canActivate: [AuthGuard]  },
    { path : 'usuario-form', component : UsuarioFormComponent, canActivate: [AuthGuard]  },
    { path : 'usuario-form/:id', component : UsuarioFormComponent, canActivate: [AuthGuard]  }, 
    { path : 'usuario-reset', component : UsuarioResetComponent, canActivate: [AuthGuard]  },   

    { path : 'tipo-usuario', component : TipoUsuarioComponent, canActivate: [AuthGuard]  },
    { path : 'tipo-usuario-form', component : TipoUsuarioFormComponent, canActivate: [AuthGuard]  },
    { path : 'tipo-usuario-form/:id', component : TipoUsuarioFormComponent, canActivate: [AuthGuard]  }, 

    { path : 'estabelecimento', component : EstabelecimentoComponent, canActivate: [AuthGuard]  },
    { path : 'estabelecimento-form', component : EstabelecimentoFormComponent, canActivate: [AuthGuard]  },
    { path : 'estabelecimento-form/:id', component : EstabelecimentoFormComponent, canActivate: [AuthGuard]  }, 

    { path : 'profissional', component : ProfissionalComponent, canActivate: [AuthGuard]  },
    { path : 'profissional-form', component : ProfissionalFormComponent, canActivate: [AuthGuard]  },
    { path : 'profissional-form/:id', component : ProfissionalFormComponent, canActivate: [AuthGuard]  }, 

    { path : 'paciente', component : PacienteComponent, canActivate: [AuthGuard]  },
    { path : 'paciente-form', component : PacienteFormComponent, canActivate: [AuthGuard]  },
    { path : 'paciente-form/:id', component : PacienteFormComponent, canActivate: [AuthGuard]  }, 

    { path : 'equipe', component : EquipeComponent, canActivate: [AuthGuard]  },
    { path : 'equipe-form', component : EquipeFormComponent, canActivate: [AuthGuard]  },
    { path : 'equipe-form/:id', component : EquipeFormComponent, canActivate: [AuthGuard]  },     

    { path : 'caneta', component : CanetaComponent, canActivate: [AuthGuard]  },
    { path : 'caneta-form', component : CanetaFormComponent, canActivate: [AuthGuard]  },
    { path : 'caneta-form/:id', component : CanetaFormComponent, canActivate: [AuthGuard]  }, 

    { path : 'atribuicao-caneta', component : AtribuicaoCanetaComponent, canActivate: [AuthGuard]  },
    { path : 'atribuicao-caneta-form', component : AtribuicaoCanetaFormComponent, canActivate: [AuthGuard]  },

    { path : 'tipo-unidade', component : TipoUnidadeComponent, canActivate: [AuthGuard]  },
    { path : 'tipo-unidade-form', component : TipoUnidadeFormComponent, canActivate: [AuthGuard]  },
    { path : 'tipo-unidade-form/:id', component : TipoUnidadeFormComponent, canActivate: [AuthGuard]  }, 

    { path : 'especialidade', component : EspecialidadeComponent, canActivate: [AuthGuard]  },
    { path : 'especialidade-form', component : EspecialidadeFormComponent, canActivate: [AuthGuard]  },
    { path : 'especialidade-form/:id', component : EspecialidadeFormComponent, canActivate: [AuthGuard]  }, 

    { path : 'modalidade', component : ModalidadeComponent, canActivate: [AuthGuard]  },
    { path : 'modalidade-form', component : ModalidadeFormComponent, canActivate: [AuthGuard]  },
    { path : 'modalidade-form/:id', component : ModalidadeFormComponent, canActivate: [AuthGuard]  }, 

    { path : 'plano-terapeutico', component : PlanoTerapeuticoComponent, canActivate: [AuthGuard]  },
    { path : 'agenda', component : AgendaComponent, canActivate: [AuthGuard]  },
    
    { path : 'atendimento', component : AtendimentoComponent, canActivate: [AuthGuard]  },
    { path : 'atendimento-form', component : AtendimentoFormComponent, canActivate: [AuthGuard]  },
    { path : 'atendimento-view/:id', component : AtendimentoFormComponent, canActivate: [AuthGuard]  },
    
    { path : 'hipotese-diagnostica', component : HipoteseDiagnosticaComponent, canActivate: [AuthGuard]  },
    { path : 'hipotese-diagnostica-form', component : HipoteseDiagnosticaFormComponent, canActivate: [AuthGuard]  },
    { path : 'hipotese-diagnostica-form/:id', component : HipoteseDiagnosticaFormComponent, canActivate: [AuthGuard]  },

    { path : 'medicamento', component : MedicamentoComponent, canActivate: [AuthGuard]  },
    { path : 'medicamento-form', component : MedicamentoFormComponent, canActivate: [AuthGuard]  },
    { path : 'medicamento-form/:id', component : MedicamentoFormComponent, canActivate: [AuthGuard]  }, 
    
    { path : 'georreferenciamento', component : GeorreferenciamentoComponent, canActivate: [AuthGuard]  },
    { path : 'georreferenciamento', component : GeorreferenciamentoComponent, canActivate: [AuthGuard]  },
    { path : 'georreferenciamento/:id', component : GeorreferenciamentoComponent, canActivate: [AuthGuard]  }, 

    { path : 'log', component : LogComponent, canActivate: [AuthGuard]  }, 
    
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent }
];

export const routing = RouterModule.forRoot(appRoutes);