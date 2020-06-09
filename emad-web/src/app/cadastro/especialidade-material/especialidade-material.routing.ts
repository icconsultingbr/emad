import { Routes } from "@angular/router";
import { EspecialidadeMaterialFormComponent } from "./especialidade-material-form.component";

export const especialidadeMaterialRoutes: Routes = [
    {
        path: '',
        component: EspecialidadeMaterialFormComponent,        
    },
    {
        path: 'especialidade/:id',
        component: EspecialidadeMaterialFormComponent,        
    }
];