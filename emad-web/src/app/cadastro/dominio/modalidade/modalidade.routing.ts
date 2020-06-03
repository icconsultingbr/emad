import { Routes } from "@angular/router";
import { ModalidadeComponent } from "./modalidade.component";
import { ModalidadeFormComponent } from "./modalidade-form.component";

export const modalidadeRoutes: Routes = [
    {
        path: '',
        component: ModalidadeComponent
    },
    {
        path: 'cadastro',
        component: ModalidadeFormComponent
    },
    {
        path: 'cadastro/:id',
        component: ModalidadeFormComponent
    }
];