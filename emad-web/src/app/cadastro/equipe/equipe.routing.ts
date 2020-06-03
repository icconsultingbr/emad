import { Routes } from "@angular/router";
import { EquipeFormComponent } from "./equipe-form.component";
import { EquipeComponent } from "./equipe.component";

export const equipeRoutes: Routes = [
    {
        path: '',
        component: EquipeComponent,        
    },
    {
        path: 'cadastro',
        component: EquipeFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: EquipeFormComponent,        
    }
];