import { Routes } from "@angular/router";
import { BloqueioLoteFormComponent } from "./bloqueio-lote-form.component";
import { BloqueioLoteComponent } from "./bloqueio-lote.component";

export const bloqueioLoteRoutes: Routes = [
    {
        path: '',
        component: BloqueioLoteComponent,        
    },
    {
        path: 'cadastro',
        component: BloqueioLoteFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: BloqueioLoteFormComponent,        
    }
];