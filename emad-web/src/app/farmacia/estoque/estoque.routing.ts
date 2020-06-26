import { Routes } from "@angular/router";
import { EstoqueFormComponent } from "./estoque-form.component";
import { EstoqueComponent } from "./estoque.component";

export const estoqueRoutes: Routes = [
    {
        path: '',
        component: EstoqueComponent,        
    },
    {
        path: 'cadastro',
        component: EstoqueFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: EstoqueFormComponent,        
    }
];