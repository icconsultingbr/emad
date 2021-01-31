import { Routes } from "@angular/router";
import { TipoExameFormComponent } from "./tipo-exame-form.component";
import { TipoExameComponent } from "./tipo-exame.component";

export const tipoExameRoutes: Routes = [
    {
        path: '',
        component: TipoExameComponent,        
    },
    {
        path: 'cadastro',
        component: TipoExameFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: TipoExameFormComponent,        
    }
];