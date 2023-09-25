import { Routes } from '@angular/router';
import { SubgrupoOrigemFormComponent } from './subgrupo-origem-form.component';
import { SubgrupoOrigemComponent } from './subgrupo-origem.component';

export const subgrupoOrigemRoutes: Routes = [
    {
        path: '',
        component: SubgrupoOrigemComponent,
    },
    {
        path: 'cadastro',
        component: SubgrupoOrigemFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: SubgrupoOrigemFormComponent,
    }
];
