import { Routes } from '@angular/router';
import { SubGrupoOrigemReceitaFormComponent } from './sub-grupo-origem-receita-form.component';
import { SubGrupoOrigemReceitaComponent } from './sub-grupo-origem-receita.component';

export const subGrupoOrigemReceitaRoutes: Routes = [
    {
        path: '',
        component: SubGrupoOrigemReceitaComponent,
    },
    {
        path: 'cadastro',
        component: SubGrupoOrigemReceitaFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: SubGrupoOrigemReceitaFormComponent,
    }
];
