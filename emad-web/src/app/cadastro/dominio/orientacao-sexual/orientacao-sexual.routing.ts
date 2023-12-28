import { Routes } from '@angular/router';
import { OrientacaoSexualFormComponent } from './orientacao-sexual-form.component';
import { OrientacaoSexualComponent } from './orientacao-sexual.component';

export const orientacaoSexualRoutes: Routes = [
    {
        path: '',
        component: OrientacaoSexualComponent,
    },
    {
        path: 'cadastro',
        component: OrientacaoSexualFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: OrientacaoSexualFormComponent,
    }
];
