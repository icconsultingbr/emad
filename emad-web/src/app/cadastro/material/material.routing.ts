import { Routes } from '@angular/router';
import { MaterialFormComponent } from './material-form.component';
import { MaterialComponent } from './material.component';

export const materialRoutes: Routes = [
    {
        path: '',
        component: MaterialComponent,
    },
    {
        path: 'cadastro',
        component: MaterialFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: MaterialFormComponent,
    }
];
