import { Routes } from "@angular/router";
import { GrupoMaterialFormComponent } from "./grupo-material-form.component";
import { GrupoMaterialComponent } from "./grupo-material.component";

export const grupoMaterialRoutes: Routes = [
    {
        path: '',
        component: GrupoMaterialComponent,        
    },
    {
        path: 'cadastro',
        component: GrupoMaterialFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: GrupoMaterialFormComponent,        
    }
];