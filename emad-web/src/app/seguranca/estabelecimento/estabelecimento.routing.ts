import { Routes } from "@angular/router";
import { EstabelecimentoFormComponent } from "./estabelecimento-form.component";
import { EstabelecimentoComponent } from "./estabelecimento.component";

export const estabelecimentoRoutes: Routes = [
    {
        path: '',
        component: EstabelecimentoComponent,        
    },
    {
        path: 'cadastro',
        component: EstabelecimentoFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: EstabelecimentoFormComponent,        
    }
];