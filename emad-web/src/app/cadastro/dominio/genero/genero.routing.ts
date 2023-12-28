import { Routes } from '@angular/router';
import { GeneroFormComponent } from './genero-form.component';
import { GeneroComponent } from './genero.component';

export const generoRoutes: Routes = [
    {
        path: '',
        component: GeneroComponent,
    },
    {
        path: 'cadastro',
        component: GeneroFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: GeneroFormComponent,
    }
];
