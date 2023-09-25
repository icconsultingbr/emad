import { Routes } from '@angular/router';
import { AtribuicaoCanetaFormComponent } from './atribuicao-caneta-form.component';
import { AtribuicaoCanetaComponent } from './atribuicao-caneta.component';

export const atribuicaoCanetaRoutes: Routes = [
    {
        path: '',
        component: AtribuicaoCanetaComponent,
    },
    {
        path: 'cadastro',
        component: AtribuicaoCanetaFormComponent,
    }
];
