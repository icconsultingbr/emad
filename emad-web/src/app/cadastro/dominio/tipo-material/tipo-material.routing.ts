import { Routes } from '@angular/router';
import { TipoMaterialFormComponent } from './tipo-material-form.component';
import { TipoMaterialComponent } from './tipo-material.component';

export const tipoMaterialRoutes: Routes = [
    {
        path: '',
        component: TipoMaterialComponent,
    },
    {
        path: 'cadastro',
        component: TipoMaterialFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: TipoMaterialFormComponent,
    }
];
