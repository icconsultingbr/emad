import { Routes } from '@angular/router';
import { TipoFichaFormComponent } from './tipo-ficha-form.component';
import { TipoFichaComponent } from './tipo-ficha.component';

export const tipoFichaRoutes: Routes = [
    {
        path: '',
        component: TipoFichaComponent,
    },
    {
        path: 'cadastro',
        component: TipoFichaFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: TipoFichaFormComponent,
    }
];
