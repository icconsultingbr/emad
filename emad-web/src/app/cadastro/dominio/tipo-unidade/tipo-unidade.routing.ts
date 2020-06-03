import { Routes } from "@angular/router";
import { TipoUnidadeFormComponent } from "./tipo-unidade-form.component";
import { TipoUnidadeComponent } from "./tipo-unidade.component";

export const tipoUnidadeRoutes: Routes = [
    {
        path: '',
        component: TipoUnidadeComponent,        
    },
    {
        path: 'cadastro',
        component: TipoUnidadeFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: TipoUnidadeFormComponent,        
    }
];