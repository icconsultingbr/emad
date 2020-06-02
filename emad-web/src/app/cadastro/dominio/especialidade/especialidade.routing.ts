import { Routes } from "@angular/router";
import { EspecialidadeFormComponent } from "./especialidade-form.component";
import { EspecialidadeComponent } from "./especialidade.component";

export const especiadadeRoutes: Routes = [
    {
        path: '',
        component: EspecialidadeComponent
    },
    {
        path: 'cadastro',
        component: EspecialidadeFormComponent
    },
    {
        path: 'cadastro/:id',
        component: EspecialidadeFormComponent
    }
];