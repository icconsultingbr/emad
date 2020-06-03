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
import { PlanoTerapeuticoComponent } from './operacao/plano-terapeutico/plano-terapeutico.component';
import { GeorreferenciamentoComponent } from './cadastro/georreferenciamento/georreferenciamento.component';
import { AgendaComponent } from './operacao/agenda/agenda.component';
import { LogComponent } from './seguranca/log/log.component';
import { AtendimentoFormComponent } from './operacao/atendimento/atendimento-form.component';
import { AtendimentoComponent } from './operacao/atendimento/atendimento.component';
import { AtribuicaoCanetaComponent } from './operacao/atribuicao-caneta/atribuicao-caneta.component';
import { AtribuicaoCanetaFormComponent } from './operacao/atribuicao-caneta/atribuicao-caneta-form.component';
import { EscalaProfissionalFormComponent } from './operacao/escala-profissional/escala-profissional-form.component';
import { ParametroSegurancaComponent } from './seguranca/parametro-seguranca/parametro-seguranca.component';
import { ParametroSegurancaFormComponent } from './seguranca/parametro-seguranca/parametro-seguranca-form.component';

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

    { path : 'atribuicao-caneta', component : AtribuicaoCanetaComponent, canActivate: [AuthGuard]  },
    { path : 'atribuicao-caneta-form', component : AtribuicaoCanetaFormComponent, canActivate: [AuthGuard]  },

    { path : 'escala-profissional-form', component : EscalaProfissionalFormComponent, canActivate: [AuthGuard]  },
    { path : 'escala-profissional-form/id/:id', component : EscalaProfissionalFormComponent, canActivate: [AuthGuard]  }, 

    { path : 'parametro-seguranca', component : ParametroSegurancaComponent, canActivate: [AuthGuard]  },
    { path : 'parametro-seguranca-form', component : ParametroSegurancaFormComponent, canActivate: [AuthGuard]  },
    { path : 'parametro-seguranca-form/:id', component : ParametroSegurancaFormComponent, canActivate: [AuthGuard]  }, 

    { path : 'plano-terapeutico', component : PlanoTerapeuticoComponent, canActivate: [AuthGuard]  },
    { path : 'agenda', component : AgendaComponent, canActivate: [AuthGuard]  },
    
    { path : 'atendimento', component : AtendimentoComponent, canActivate: [AuthGuard]  },
    { path : 'atendimento/idPaciente/:idPaciente', component : AtendimentoComponent, canActivate: [AuthGuard]  },
    { path : 'atendimento-form', component : AtendimentoFormComponent, canActivate: [AuthGuard]  },
    { path : 'atendimento-view/:id', component : AtendimentoFormComponent, canActivate: [AuthGuard]  },
    
    { path : 'georreferenciamento', component : GeorreferenciamentoComponent, canActivate: [AuthGuard]  },
    { path : 'georreferenciamento', component : GeorreferenciamentoComponent, canActivate: [AuthGuard]  },
    { path : 'georreferenciamento/:id', component : GeorreferenciamentoComponent, canActivate: [AuthGuard]  }, 
    { path : 'log', component : LogComponent, canActivate: [AuthGuard]  }, 

    { path: 'especialidades', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/dominio/especialidade/especialidade.module').then(m => m.EspecialidadeModule) },
    { path: 'hipoteses-diagnosticas', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/dominio/hipotese-diagnostica/hipotese-diagnostica.module').then(m => m.HipoteseDiagnosticaModule) },
    { path: 'modalidades', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/dominio/modalidade/modalidade.module').then(m => m.ModalidadeModule) },    
    { path: 'modelos-canetas', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/dominio/modelo-caneta/modelo-caneta.module').then(m => m.ModeloCanetaModule) },    
    { path: 'tipos-unidades', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/dominio/tipo-unidade/tipo-unidade.module').then(m => m.TipoUnidadeModule) },
    { path: 'tipos-fichas', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/dominio/tipo-ficha/tipo-ficha.module').then(m => m.TipoFichaModule) },
    { path: 'canetas', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/caneta/caneta.module').then(m => m.CanetaModule) },
    { path: 'pacientes', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/paciente/paciente.module').then(m => m.PacienteModule) },
    { path: 'equipes', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/equipe/equipe.module').then(m => m.EquipeModule) },
    { path: 'profissionais', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/profissional/profissional.module').then(m => m.ProfissionalModule) },
    
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent }, 
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });