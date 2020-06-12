import { Routes } from "@angular/router";
import { CorClassificacaoRiscoFormComponent } from "./cor-classificacao-risco-form.component";
import { CorClassificacaoRiscoComponent } from "./cor-classificacao-risco.component";

export const corClassificacaoRiscoRoutes: Routes = [
    {
        path: '',
        component: CorClassificacaoRiscoComponent,        
    },
    {
        path: 'cadastro',
        component: CorClassificacaoRiscoFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: CorClassificacaoRiscoFormComponent,        
    }
];