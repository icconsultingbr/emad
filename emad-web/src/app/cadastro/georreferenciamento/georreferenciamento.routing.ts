import { Routes } from "@angular/router";
import { GeorreferenciamentoComponent } from "./georreferenciamento.component";

export const georreferenciamentoRoutes: Routes = [
    {
        path: '',
        component: GeorreferenciamentoComponent,        
    },
    {
        path: '/:id',
        component: GeorreferenciamentoComponent,        
    }
];