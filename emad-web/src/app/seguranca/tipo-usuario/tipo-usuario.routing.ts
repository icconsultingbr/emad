import { Routes } from '@angular/router';
import { TipoUsuarioFormComponent } from './tipo-usuario-form.component';
import { TipoUsuarioComponent } from './tipo-usuario.component';

export const tipoUsuarioRoutes: Routes = [
    {
        path: '',
        component: TipoUsuarioComponent,
    },
    {
        path: 'cadastro',
        component: TipoUsuarioFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: TipoUsuarioFormComponent,
    }
];
