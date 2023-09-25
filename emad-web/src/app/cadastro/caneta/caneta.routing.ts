import { Routes } from '@angular/router';
import { CanetaFormComponent } from './caneta-form.component';
import { CanetaComponent } from './caneta.component';

export const canetaRoutes: Routes = [
    {
        path: '',
        component: CanetaComponent,
    },
    {
        path: 'cadastro',
        component: CanetaFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: CanetaFormComponent,
    }
];
