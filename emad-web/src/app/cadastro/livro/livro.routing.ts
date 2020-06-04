import { Routes } from "@angular/router";
import { LivroFormComponent } from "./livro-form.component";
import { LivroComponent } from "./livro.component";

export const livroRoutes: Routes = [
    {
        path: '',
        component: LivroComponent,        
    },
    {
        path: 'cadastro',
        component: LivroFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: LivroFormComponent,        
    }
];