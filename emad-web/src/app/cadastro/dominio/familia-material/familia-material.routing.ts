import { Routes } from "@angular/router";
import { FamiliaMaterialFormComponent } from "./familia-material-form.component";
import { FamiliaMaterialComponent } from "./familia-material.component";

export const familiaMaterialRoutes: Routes = [
    {
        path: '',
        component: FamiliaMaterialComponent,        
    },
    {
        path: 'cadastro',
        component: FamiliaMaterialFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: FamiliaMaterialFormComponent,        
    }
];