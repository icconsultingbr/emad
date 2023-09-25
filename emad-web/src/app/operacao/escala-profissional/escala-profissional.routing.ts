import { Routes } from '@angular/router';
import { EscalaProfissionalFormComponent } from './escala-profissional-form.component';

export const escalaProfissionalRoutes: Routes = [
    {
        path: '',
        component: EscalaProfissionalFormComponent,
    },
    {
        path: 'id/:id',
        component: EscalaProfissionalFormComponent,
    }
];
