import { Routes } from "@angular/router";
import { ExameFormComponent } from "./exame-form.component";
import { ExameComponent } from "./exame.component";

export const exameRoutes: Routes = [
    {
        path: '',
        component: ExameComponent,        
    },
    {
        path: 'cadastro',
        component: ExameFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: ExameFormComponent,        
    }
];