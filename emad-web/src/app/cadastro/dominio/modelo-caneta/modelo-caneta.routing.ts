import { Routes } from "@angular/router";
import { ModeloCanetaFormComponent } from "./modelo-caneta-form.component";
import { ModeloCanetaComponent } from "./modelo-caneta.component";

export const modeloCanetaRoutes: Routes = [
    {
        path: '',
        component: ModeloCanetaComponent,        
    },
    {
        path: 'cadastro',
        component: ModeloCanetaFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: ModeloCanetaFormComponent,        
    }
];