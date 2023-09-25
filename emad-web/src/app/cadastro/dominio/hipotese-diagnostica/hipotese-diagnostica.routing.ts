import { Routes } from '@angular/router';
import { HipoteseDiagnosticaFormComponent } from './hipotese-diagnostica-form.component';
import { HipoteseDiagnosticaComponent } from './hipotese-diagnostica.component';

export const hipoteseDiagnosticaRoutes: Routes = [
    {
        path: '',
        component: HipoteseDiagnosticaComponent
    },
    {
        path: 'cadastro',
        component: HipoteseDiagnosticaFormComponent
    },
    {
        path: 'cadastro/:id',
        component: HipoteseDiagnosticaFormComponent
    }
];
