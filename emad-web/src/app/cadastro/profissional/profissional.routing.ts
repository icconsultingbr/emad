import { Routes } from "@angular/router";
import { ProfissionalFormComponent } from "./profissional-form.component";
import { ProfissionalComponent } from "./profissional.component";

export const profissionalRoutes: Routes = [
    {
        path: '',
        component: ProfissionalComponent,        
    },
    {
        path: 'cadastro',
        component: ProfissionalFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: ProfissionalFormComponent,        
    }
];