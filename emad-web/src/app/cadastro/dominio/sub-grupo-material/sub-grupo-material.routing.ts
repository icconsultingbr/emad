import { Routes } from "@angular/router";
import { SubGrupoMaterialFormComponent } from "./sub-grupo-material-form.component";
import { SubGrupoMaterialComponent } from "./sub-grupo-material.component";

export const subGrupoMaterialRoutes: Routes = [
    {
        path: '',
        component: SubGrupoMaterialComponent,        
    },
    {
        path: 'cadastro',
        component: SubGrupoMaterialFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: SubGrupoMaterialFormComponent,        
    }
];