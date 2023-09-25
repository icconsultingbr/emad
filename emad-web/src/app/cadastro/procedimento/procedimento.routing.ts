import { Routes } from '@angular/router';
import { ProcedimentoFormComponent } from './procedimento-form.component';
import { ProcedimentoComponent } from './procedimento.component';

export const procedimentoRoutes: Routes = [
    {
        path: '',
        component: ProcedimentoComponent,
    },
    {
        path: 'cadastro',
        component: ProcedimentoFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: ProcedimentoFormComponent,
    }
];
