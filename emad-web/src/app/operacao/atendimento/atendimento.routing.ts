import { Routes } from "@angular/router";
import { AtendimentoFormComponent } from "./atendimento-form.component";
import { AtendimentoComponent } from "./atendimento.component";
import { RelatorioReceitaComponent } from "./relatorio-receita.component";

export const atendimentoRoutes: Routes = [
    {
        path: '',
        component: AtendimentoComponent,        
    },
    {
        path: 'idPaciente/:idPaciente',
        component: AtendimentoComponent,        
    },
    {
        path: 'cadastro',
        component: AtendimentoFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: AtendimentoFormComponent,        
    },
    {
        path: 'relatorio-receita/:ano/:estabelecimentoId/:numero/:farmacia',
        component: RelatorioReceitaComponent
    }
];


// { path : 'atendimento', component : AtendimentoComponent, canActivate: [AuthGuard]  },
// { path : 'atendimento/idPaciente/:idPaciente', component : AtendimentoComponent, canActivate: [AuthGuard]  },

// { path : 'atendimento-form', component : AtendimentoFormComponent, canActivate: [AuthGuard]  },
// { path : 'atendimento-view/:id', component : AtendimentoFormComponent, canActivate: [AuthGuard]  },