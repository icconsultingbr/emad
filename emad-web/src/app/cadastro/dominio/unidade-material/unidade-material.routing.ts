import { Routes } from '@angular/router';
import { UnidadeMaterialFormComponent } from './unidade-material-form.component';
import { UnidadeMaterialComponent } from './unidade-material.component';

export const unidadeMaterialRoutes: Routes = [
    {
        path: '',
        component: UnidadeMaterialComponent,
    },
    {
        path: 'cadastro',
        component: UnidadeMaterialFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: UnidadeMaterialFormComponent,
    }
];
