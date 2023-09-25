import { Routes } from '@angular/router';
import { PacienteFormComponent } from './paciente-form.component';
import { PacienteComponent } from './paciente.component';
import { ProntuarioPacienteFormComponent } from './prontuario-paciente/prontuario-paciente-form.component';

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
    },
    {
        path: 'prontuario/:id',
        component: ProntuarioPacienteFormComponent,
    }
];
