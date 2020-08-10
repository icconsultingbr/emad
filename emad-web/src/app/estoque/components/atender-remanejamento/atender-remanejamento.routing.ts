import { Routes } from "@angular/router";
import { AtenderRemanejamentoFormComponent } from "./atender-remanejamento-form.component";
import { AtenderRemanejamentoComponent } from "./atender-remanejamento.component";

export const atenderRemanejamentoRoutes: Routes = [
    {
        path: '',
        component: AtenderRemanejamentoComponent,        
    },
    {
        path: 'cadastro',
        component: AtenderRemanejamentoFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: AtenderRemanejamentoFormComponent,        
    }
];