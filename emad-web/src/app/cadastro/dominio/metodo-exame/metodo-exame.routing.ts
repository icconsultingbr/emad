import { Routes } from '@angular/router';
import { MetodoExameFormComponent } from './metodo-exame-form.component';
import { MetodoExameComponent } from './metodo-exame.component';

export const metodoExameRoutes: Routes = [
    {
        path: '',
        component: MetodoExameComponent,
    },
    {
        path: 'cadastro',
        component: MetodoExameFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: MetodoExameFormComponent,
    }
];
