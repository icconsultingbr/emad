import { Routes } from "@angular/router";
import { EspecialidadeEntidadeCampoFormComponent } from "./especialidade-entidade-campo-form.component";

export const especialidadeEntidadeCampoRoutes: Routes = [
    {
        path: '',
        component: EspecialidadeEntidadeCampoFormComponent,        
    },
    {
        path: 'especialidade/:id',
        component: EspecialidadeEntidadeCampoFormComponent,        
    }
];