import { Routes } from "@angular/router";
import { MotivoFimReceitaFormComponent } from "./motivo-fim-receita-form.component";
import { MotivoFimReceitaComponent } from "./motivo-fim-receita.component";

export const motivoFimReceitaRoutes: Routes = [
    {
        path: '',
        component: MotivoFimReceitaComponent,        
    },
    {
        path: 'cadastro',
        component: MotivoFimReceitaFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: MotivoFimReceitaFormComponent,        
    }
];