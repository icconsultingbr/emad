import { Routes } from '@angular/router';
import { SolicitacaoRemanejamentoFormComponent } from './solicitacao-remanejamento-form.component';
import { SolicitacaoRemanejamentoComponent } from './solicitacao-remanejamento.component';

export const solicitacaoRemanejamentoRoutes: Routes = [
    {
        path: '',
        component: SolicitacaoRemanejamentoComponent,
    },
    {
        path: 'cadastro',
        component: SolicitacaoRemanejamentoFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: SolicitacaoRemanejamentoFormComponent,
    }
];
