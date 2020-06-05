import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './_core/_guards';
import { NotFoundComponent } from './not-found/not-found.component';
import { UsuarioResetComponent } from './seguranca/usuario/usuario-reset.component';

const appRoutes : Routes = [
    { path : '', component : MainComponent, canActivate: [AuthGuard] },
    { path : 'login', component : LoginComponent},

    { path : 'usuario-reset', component : UsuarioResetComponent, canActivate: [AuthGuard]  },  
     
    { path: 'especialidades', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/especialidade/especialidade.module#EspecialidadeModule' },
    { path: 'hipoteses-diagnosticas', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/hipotese-diagnostica/hipotese-diagnostica.module#HipoteseDiagnosticaModule' },
    { path: 'modalidades', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/modalidade/modalidade.module#ModalidadeModule' },    
    { path: 'modelos-canetas', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/modelo-caneta/modelo-caneta.module#ModeloCanetaModule' },    
    { path: 'tipos-unidades', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/tipo-unidade/tipo-unidade.module#TipoUnidadeModule'},
    { path: 'tipos-fichas', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/tipo-ficha/tipo-ficha.module#TipoFichaModule'},
    { path: 'canetas', canActivate: [AuthGuard], loadChildren: './cadastro/caneta/caneta.module#CanetaModule'},
    { path: 'pacientes', canActivate: [AuthGuard], loadChildren: './cadastro/paciente/paciente.module#PacienteModule' },
    { path: 'equipes', canActivate: [AuthGuard], loadChildren: './cadastro/equipe/equipe.module#EquipeModule' },
    { path: 'profissionais', canActivate: [AuthGuard], loadChildren: './cadastro/profissional/profissional.module#ProfissionalModule' },
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
    { path: 'logs', canActivate: [AuthGuard], loadChildren: './seguranca/log/log.module#LogModule' },
    { path: 'atencoes-continuadas', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/atencao-continuada/atencao-continuada.module#AtencaoContinuadaModule' },
    { path: 'grupos-materiais', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/grupo-material/grupo-material.module#GrupoMaterialModule' },
    { path: 'motivos-fim-receitas', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/motivo-fim-receita/motivo-fim-receita.module#MotivoFimReceitaModule' },
    { path: 'livros', canActivate: [AuthGuard], loadChildren: './cadastro/livro/livro.module#LivroModule' },
    { path: 'fabricantes-materiais', canActivate: [AuthGuard], loadChildren: './cadastro/fabricante-material/fabricante-material.module#FabricanteMaterialModule' },
    { path: 'grupos-origens-receitas', canActivate: [AuthGuard], loadChildren: './cadastro/grupo-origem-receita/grupo-origem-receita.module#GrupoOrigemReceitaModule' },
    { path: 'sub-grupos-origens-receitas', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/sub-grupo-origem-receita/sub-grupo-origem-receita.module#SubGrupoOrigemReceitaModule' },
    { path: 'sub-grupos-materiais', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/sub-grupo-material/sub-grupo-material.module#SubGrupoMaterialModule' },
    { path: 'familias-materiais', canActivate: [AuthGuard], loadChildren: './cadastro/dominio/familia-material/familia-material.module#FamiliaMaterialModule' },
    
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent }, 
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });