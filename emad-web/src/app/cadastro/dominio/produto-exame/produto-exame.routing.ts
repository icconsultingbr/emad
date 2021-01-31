import { Routes } from "@angular/router";
import { ProdutoExameFormComponent } from "./produto-exame-form.component";
import { ProdutoExameComponent } from "./produto-exame.component";

export const produtoExameRoutes: Routes = [
    {
        path: '',
        component: ProdutoExameComponent,        
    },
    {
        path: 'cadastro',
        component: ProdutoExameFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: ProdutoExameFormComponent,        
    }
];