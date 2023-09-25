import { Routes } from '@angular/router';
import { AtencaoContinuadaFormComponent } from './atencao-continuada-form.component';
import { AtencaoContinuadaComponent } from './atencao-continuada.component';

export const atencaoContinuadaRoutes: Routes = [
    {
        path: '',
        component: AtencaoContinuadaComponent,
    },
    {
        path: 'cadastro',
        component: AtencaoContinuadaFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: AtencaoContinuadaFormComponent,
    }
];
