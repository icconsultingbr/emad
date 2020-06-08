import { Routes } from "@angular/router";
import { EstabelecimentoGrupoMaterialFormComponent } from "./estabelecimento-grupo-material-form.component";
import { EstabelecimentoGrupoMaterialComponent } from "./estabelecimento-grupo-material.component";

export const estabelecimentoGrupoMaterialRoutes: Routes = [
    {
        path: '',
        component: EstabelecimentoGrupoMaterialComponent,        
    },
    {
        path: 'cadastro',
        component: EstabelecimentoGrupoMaterialFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: EstabelecimentoGrupoMaterialFormComponent,        
    }
];