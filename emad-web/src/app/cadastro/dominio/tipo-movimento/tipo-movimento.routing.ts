import { Routes } from '@angular/router';
import { TipoMovimentoFormComponent } from './tipo-movimento-form.component';
import { TipoMovimentoComponent } from './tipo-movimento.component';

export const tipoMovimentoRoutes: Routes = [
    {
        path: '',
        component: TipoMovimentoComponent,
    },
    {
        path: 'cadastro',
        component: TipoMovimentoFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: TipoMovimentoFormComponent,
    }
];
