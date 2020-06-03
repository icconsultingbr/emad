import { Routes } from "@angular/router";
import { PacienteFormComponent } from "./paciente-form.component";
import { PacienteComponent } from "./paciente.component";

export const pacienteRoutes: Routes = [
    {
        path: '',
        component: PacienteComponent,        
    },
    {
        path: 'cadastro',
        component: PacienteFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: PacienteFormComponent,        
    }
];