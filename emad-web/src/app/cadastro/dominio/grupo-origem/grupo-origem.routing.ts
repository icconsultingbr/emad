import { Routes } from "@angular/router";
import { GrupoOrigemFormComponent } from "./grupo-origem-form.component";
import { GrupoOrigemComponent } from "./grupo-origem.component";

export const grupoOrigemRoutes: Routes = [
    {
        path: '',
        component: GrupoOrigemComponent,        
    },
    {
        path: 'cadastro',
        component: GrupoOrigemFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: GrupoOrigemFormComponent,        
    }
];