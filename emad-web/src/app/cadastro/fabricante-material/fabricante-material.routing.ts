import { Routes } from '@angular/router';
import { FabricanteMaterialFormComponent } from './fabricante-material-form.component';
import { FabricanteMaterialComponent } from './fabricante-material.component';

export const fabricanteMaterialRoutes: Routes = [
    {
        path: '',
        component: FabricanteMaterialComponent,
    },
    {
        path: 'cadastro',
        component: FabricanteMaterialFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: FabricanteMaterialFormComponent,
    }
];
