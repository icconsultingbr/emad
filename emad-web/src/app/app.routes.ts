import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './_core/_guards';
import { NotFoundComponent } from './not-found/not-found.component';
import { UsuarioResetComponent } from './seguranca/usuario/usuario-reset.component';
import { LogComponent } from './seguranca/log/log.component';

const appRoutes : Routes = [
    { path : '', component : MainComponent, canActivate: [AuthGuard] },
    { path : 'login', component : LoginComponent},

    { path : 'usuario-reset', component : UsuarioResetComponent, canActivate: [AuthGuard]  },  
     
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
    { path: 'georreferenciamentos', canActivate: [AuthGuard], loadChildren: './cadastro/georreferenciamento/georreferenciamento.module#GeorreferenciamentoModule' },
    { path: 'atribuicoes-canetas', canActivate: [AuthGuard], loadChildren: './operacao/atribuicao-caneta/atribuicao-caneta.module#AtribuicaoCanetaModule' },
    { path: 'escalas-profissionais', canActivate: [AuthGuard], loadChildren: './operacao/escala-profissional/escala-profissional.module#EscalaProfissionalModule' },
    { path: 'planos-terapeuticos', canActivate: [AuthGuard], loadChildren: './operacao/plano-terapeutico/plano-terapeutico.module#PlanoTerapeuticoModule' },
    { path: 'agendas', canActivate: [AuthGuard], loadChildren: './operacao/agenda/agenda.module#AgendaModule' },
    { path: 'estabelecimentos', canActivate: [AuthGuard], loadChildren: './seguranca/estabelecimento/estabelecimento.module#EstabelecimentoModule' },
    { path: 'menus', canActivate: [AuthGuard], loadChildren: './seguranca/menu/menu.module#MenuModule' },
    { path: 'parametros-segurancas', canActivate: [AuthGuard], loadChildren: './seguranca/parametro-seguranca/parametro-seguranca.module#ParametroSegurancaModule' },
    { path: 'usuarios', canActivate: [AuthGuard], loadChildren: './seguranca/usuario/usuario.module#UsuarioModule' },
    { path: 'tipos-usuarios', canActivate: [AuthGuard], loadChildren: './seguranca/tipo-usuario/tipo-usuario.module#TipoUsuarioModule' },
    { path: 'atendimentos', canActivate: [AuthGuard], loadChildren: './operacao/atendimento/atendimento.module#AtendimentoModule' },
    { path: 'logs', canActivate: [AuthGuard], loadChildren: () => import('./seguranca/log/log.module').then(m => m.LogModule) },
    { path: 'atencoes-continuadas', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/dominio/atencao-continuada/atencao-continuada.module').then(m => m.AtencaoContinuadaModule) },
    { path: 'grupos-materiais', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/dominio/grupo-material/grupo-material.module').then(m => m.GrupoMaterialModule) },
    { path: 'motivos-fim-receitas', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/dominio/motivo-fim-receita/motivo-fim-receita.module').then(m => m.MotivoFimReceitaModule) },
    { path: 'livros', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/livro/livro.module').then(m => m.LivroModule) },
    { path: 'fabricantes-materiais', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/fabricante-material/fabricante-material.module').then(m => m.FabricanteMaterialModule) },
    { path: 'grupos-origens-receitas', canActivate: [AuthGuard], loadChildren: () => import('./cadastro/grupo-origem-receita/grupo-origem-receita.module').then(m => m.GrupoOrigemReceitaModule) },
    
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent }, 
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });