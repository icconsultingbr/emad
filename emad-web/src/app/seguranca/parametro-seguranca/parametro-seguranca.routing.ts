import { Routes } from "@angular/router";
import { ParametroSegurancaFormComponent } from "./parametro-seguranca-form.component";
import { ParametroSegurancaComponent } from "./parametro-seguranca.component";

export const parametroSegurancaRoutes: Routes = [
    {
        path: '',
        component: ParametroSegurancaComponent,        
    },
    {
        path: 'cadastro',
        component: ParametroSegurancaFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: ParametroSegurancaFormComponent,        
    }
];