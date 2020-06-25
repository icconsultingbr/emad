import { Routes } from "@angular/router";
import { ReceitaFormComponent } from "./receita-form.component";
import { ReceitaComponent } from "./receita.component";

export const receitaRoutes: Routes = [
    {
        path: '',
        component: ReceitaComponent,        
    },
    {
        path: 'cadastro',
        component: ReceitaFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: ReceitaFormComponent,        
    }
];