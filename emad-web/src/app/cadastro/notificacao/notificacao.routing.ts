import { Routes } from "@angular/router";
import { NotificacaoFormComponent } from "./notificacao-form.component";
import { NotificacaoComponent } from "./notificacao.component";

export const notificacaoRoutes: Routes = [
    {
        path: '',
        component: NotificacaoComponent,        
    },
    {
        path: 'cadastro',
        component: NotificacaoFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: NotificacaoFormComponent,        
    }
];