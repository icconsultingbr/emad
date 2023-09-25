import { Routes } from '@angular/router';
import { ListaControleEspecialFormComponent } from './lista-controle-especial-form.component';
import { ListaControleEspecialComponent } from './lista-controle-especial.component';

export const listaControleEspecialRoutes: Routes = [
    {
        path: '',
        component: ListaControleEspecialComponent,
    },
    {
        path: 'cadastro',
        component: ListaControleEspecialFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: ListaControleEspecialFormComponent,
    }
];
