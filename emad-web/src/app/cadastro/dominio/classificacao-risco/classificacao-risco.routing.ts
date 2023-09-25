import { Routes } from '@angular/router';
import { ClassificacaoRiscoFormComponent } from './classificacao-risco-form.component';
import { ClassificacaoRiscoComponent } from './classificacao-risco.component';

export const classificacaoRiscoRoutes: Routes = [
    {
        path: '',
        component: ClassificacaoRiscoComponent,
    },
    {
        path: 'cadastro',
        component: ClassificacaoRiscoFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: ClassificacaoRiscoFormComponent,
    }
];
