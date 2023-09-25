import { Routes } from '@angular/router';
import { MenuFormComponent } from './menu-form.component';
import { MenuComponent } from './menu.component';

export const menuRoutes: Routes = [
    {
        path: '',
        component: MenuComponent,
    },
    {
        path: 'cadastro',
        component: MenuFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: MenuFormComponent,
    }
];
