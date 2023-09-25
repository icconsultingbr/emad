import { Routes } from '@angular/router';
import { GrupoOrigemReceitaFormComponent } from './grupo-origem-receita-form.component';
import { GrupoOrigemReceitaComponent } from './grupo-origem-receita.component';

export const grupoOrigemReceitaRoutes: Routes = [
    {
        path: '',
        component: GrupoOrigemReceitaComponent,
    },
    {
        path: 'cadastro',
        component: GrupoOrigemReceitaFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: GrupoOrigemReceitaFormComponent,
    }
];
